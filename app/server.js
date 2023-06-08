const express = require('express');
const pool = require('/Users/saim_bhimji/repo/emr2/database/db.js');
const fs = require('fs');
const Patient = require('../database/Patient.js');
const PatientWithID = require('../database/PatientWithID.js');
const { render } = require('ejs');
const { builtinModules } = require('module');
var bodyParser = require('body-parser');
const Visit = require('../database/Visit.js');
const notifier = require('node-notifier');
//const VisitWithID = require('../database/VisitWithID.js');

const app = express();


app.use(bodyParser.urlencoded({ extended: false }))


const port = 3000;

app.set('view_engine', 'ejs')
app.use(express.static(__dirname + '/views'));
app.use(express.urlencoded({ extended: false}))


app.post('/patient', async (req, res) => {
    console.log(req.body.birthday);
    // let birthDate = req.body.birthday;
    const today = new Date();
    const birth = new Date(req.body.birthday);

    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
        age--;
    }
    // let patientData = new Patient(req.body.fname, req.body.lname, req.body.sex, req.body.birth_year, 
    //     req.body.birth_month, req.body.birth_day, age, req.body.insurance, req.body.pcp);
    let patientData = new Patient(req.body.fname, req.body.lname, req.body.sex, req.body.birthday,
        age, req.body.insurance, req.body.pcp);
    await patientData.initializeData();
    res.redirect('/patient-record?patient_id=' + patientData.patient_id);
})



app.post('/login', async (req, response) => {
    const date = new Date();
    const text = `
    SELECT * FROM public."Users"
    WHERE username = $1
    `;
    // const text = `
    //     INSERT INTO public."login"(
    //         date, username)
    //         VALUES ($1, $2);
    //     `
    const values = [req.body.username];
    await pool            
        .query(text, values)
        .then((res) => {
            if (res.rowCount === 0) {
                response.render('login.ejs', {str : "Incorrect username/password."});
                //response.redirect('/');
            } else {
                if ((req.body.password).localeCompare(res.rows[0].password) === 0) {
                    console.log("Login attempt logged successfully.")
                    response.redirect('/home');
                } else {
                    response.render('login.ejs', {str : "Incorrect username/password."});
                    //notifier.notify('Incorrect username/password.');
                    //response.redirect('/');
                }
            }
            
        })
        .catch((err) => console.log("ERROR", err.stack))
    
})

app.post('/searchPatient', async (req, res) => {

        let text = `
        SELECT * FROM public."patientGenInfo"
        WHERE
        `
        let count = 1;
        let values = [];

        if ((req.body.fname).localeCompare("") != 0) {
            text += ` UPPER(fname) LIKE '%' || $${count++} || '%'`
            values.push(req.body.fname.toUpperCase());
        } 
        if (req.body.lname.localeCompare("") != 0) {
            if (count != 1) {
                text += ` AND UPPER(lname) LIKE '%' || $${count++} || '%'`
            } else {
                text += ` UPPER(lname) LIKE '%' || $${count++} || '%'`
            }
            values.push(req.body.lname.toUpperCase());
        }
        if (req.body.birthday.localeCompare("") != 0) {
            if (count != 1) {
                text += ` AND UPPER(birthday) LIKE '%' || $${count++} || '%'`
            } else {
                text += ` UPPER(birthday) LIKE '%' || $${count++} || '%'`
            }
            values.push(req.body.birthday);
        }
        if (req.body.mrn.localeCompare("") != 0) {
            if (count != 1) {
                text += ` AND CAST(patient_id AS VARCHAR(255)) LIKE '%' || $${count++} || '%'`
            } else {
                text += `CAST(patient_id AS VARCHAR(255)) LIKE '%' || $${count++} || '%'`
            }
            values.push(req.body.mrn);
        }
        let patients = ''
        pool
            .query(text, values)
            .then(result => {
                patients = result.rows; // Assign the result to patients variable
                res.render('home.ejs', { patients });
              })
            .catch((err) => console.error('Error executing query', err.stack))
    //}
    
})

app.get('/home', async (req, res) => {
    const query = require('../app/queries/selectPatients');
    const patients = await query();
    //console.log(patients);
    res.render('home.ejs', { 
        patients 
    })
})

app.get('/', (req, res) => {
    res.render('login.ejs', {title: 'Login Page', str : ""});
}) 

app.get('/patient-record', async (req, res) => {
    let patientData = null;
    if (Object.keys(req.query).length > 0) {
        console.log("Patient Record: " + req.query.patient_id);
        patientData = new PatientWithID(req.query.patient_id);
        await patientData.initializeData();
        //await patientData.getById();
    }
    await res.render('patient-record.ejs', { patient: patientData, title: 'Patient Record'})
}) 

app.get('/visit-record', async (req, res) => {
    let visitData;
    let patientData;
    if (Object.keys(req.query).length > 0) {
        console.log("YO: " + req.query.patient_id);
        patientData = new PatientWithID(req.query.patient_id);
        await patientData.getById();
        
        visitData = new Visit(req.query.visit_id, null, null, null, null);
        await visitData.getById(req.query.visit_id);
        console.log("Visit Record: " + req.query.visit_id);
    }
    await res.render('visit-record.ejs', { visit: visitData, patient: patientData, title: 'Visit Record'})
}) 

app.post('/visit', async (req, res) => {
    console.log(req.query.patient_id);
    let patientData = new PatientWithID(req.query.patient_id);
    await patientData.initializeData();

    //var visDate = req.body.year + '-' + req.body.month + '-' + req.body.day;
    await patientData.addVisit(req.body.eventName, req.body.visitDate, req.body.phys, req.body.consent);

    await res.render('patient-record.ejs', { patient: patientData, title: 'Patient Record'})
})

app.post('/vitals', async (req, res) => {
    let patientData = new PatientWithID(req.query.patient_id);
    await patientData.getById();
    let visitData = new Visit(req.query.visit_id, null, null, null, null);
    await visitData.getById(req.query.visit_id);
    await visitData.addVitals(req.body.pulse, req.body.bp, req.body.temp, req.body.r_rate,
        req.body.height, req.body.weight, req.body.blood_sug, req.body.hrs_meal);
    res.redirect('/visit-record?patient_id=' + req.query.patient_id + '&visit_id=' + req.query.visit_id);
})

app.post('/newROS', async (req, res) => {
    let patientData = new PatientWithID(req.query.patient_id);
    await patientData.getById();
    let visitData = new Visit(req.query.visit_id, null, null, null, null);
    await visitData.getById(req.query.visit_id);
    const updateText = require('../app/queries/updateROSText')
    var ros_gen = await updateText([req.body.weight_loss, req.body.fatigue, req.body.sweats]);
    var ros_cardio = await updateText([req.body.chestPain, req.body.palp, req.body.sob]);
    var ros_resp = await updateText([req.body.coughing, req.body.wheez, req.body.phlegm, req.body.diff]); 
    var ros_skin = await updateText([req.body.rashes, req.body.bruis, req.body.moles]); 
    var ros_heent = await updateText([req.body.headaches, req.body.vis, req.body.sinus, req.body.sore]); 
    var ros_gi = await updateText([req.body.nausea, req.body.diar, req.body.const, req.body.bm_change]);
    var ros_mus = await updateText([req.body.stiff, req.body.musc, req.body.back]); 
    var ros_endo = await updateText([req.body.heat,  req.body.hair, req.body.thirst, req.body.polyuria]);

    var ros_gu = '';
    if(patientData.sex.localeCompare('Male') === 0) {
        ros_gu = await updateText([req.body.penile,  req.body.dysuria, req.body.tes, req.body.hernias]);
    } else {
        ros_gu = await updateText([req.body.lmp, req.body.regular,  req.body.tamp, req.body.breast, req.body.vag, req.body.dysuria2, req.body.tes, req.body.hernias]);
    }
    await visitData.addROS(ros_gen, ros_cardio, ros_resp, ros_skin, ros_heent, ros_gi, ros_gu, ros_mus, ros_endo);
    res.redirect('/visit-record?patient_id=' + req.query.patient_id + '&visit_id=' + req.query.visit_id);
})

app.post('/newPhys', async (req, res) => {
    let vals = [req.body.gen_norm, req.body.gen_ab, req.body.heart_norm, req.body.heart_ab, 
        req.body.lung_norm, req.body.lung_ab, req.body.skin_norm, req.body.skin_ab, req.body.heent_norm, req.body.heent_ab,
        req.body.abdo_norm, req.body.abdo_ab, req.body.mus_norm, req.body.mus_ab, req.body.neuro_norm, req.body.neuro_ab, req.body.omm_norm, req.body.omm_ab, 
        req.body.phys_oth_norm, req.body.phys_oth_ab];
    vals.forEach(await function(val) {
        if (val === null) {
            val = "";
        }
    })
    let patientData = new PatientWithID(req.query.patient_id);
    await patientData.getById();
    let visitData = new Visit(req.query.visit_id, null, null, null, null);
    await visitData.getById(req.query.visit_id);
    await visitData.addPhys(req.body.gen_norm, req.body.gen_ab, req.body.heart_norm, req.body.heart_ab, 
        req.body.lung_norm, req.body.lung_ab, req.body.skin_norm, req.body.skin_ab, req.body.heent_norm, req.body.heent_ab,
        req.body.abdo_norm, req.body.abdo_ab, req.body.mus_norm, req.body.mus_ab, req.body.neuro_norm, req.body.neuro_ab, req.body.omm_norm, req.body.omm_ab, 
        req.body.phys_oth_norm, req.body.phys_oth_ab);
    res.redirect('/visit-record?patient_id=' + req.query.patient_id + '&visit_id=' + req.query.visit_id);
})

app.post('/newHPI', async (req, res) => {
    let patientData = new PatientWithID(req.query.patient_id);
    await patientData.getById();
    let visitData = new Visit(req.query.visit_id, null, null, null, null);
    await visitData.getById(req.query.visit_id);
    await visitData.addHPI(req.body.hpi);

    res.redirect('/visit-record?patient_id=' + req.query.patient_id + '&visit_id=' + req.query.visit_id);
})

app.get('/newHPI', async (req, res) => {
    let patientData = new PatientWithID(req.query.patient_id);
    await patientData.getById();
    let visitData = new Visit(req.query.visit_id, null, null, null, null);
    await visitData.getById(req.query.visit_id);
    res.render('newHPI.ejs', {patient: patientData, visit: visitData, title: 'Add HPI'});
})

app.post('/newSocial', async (req, res) => {
    let patientData = new PatientWithID(req.query.patient_id);
    await patientData.getById();
    let visitData = new Visit(req.query.visit_id, null, null, null, null);
    await visitData.getById(req.query.visit_id);
    let packs_yr = parseInt(req.body.pkday) * parseInt(req.body.yrs);
    await patientData.addSocial(req.body.occupation,req.body.diet, req.body.exercise, req.body.curr_hous, req.body.yr3_hous, 
        req.body.caffeine, req.body.alc, req.body.pkday, req.body.yrs, packs_yr, req.body.quit, req.body.marijuana, req.body.fundr, req.body.sex_act, 
        req.body.partners, req.body.protection, req.body.sti, req.query.visit_id);
    res.redirect('/visit-record?patient_id=' + req.query.patient_id + '&visit_id=' + req.query.visit_id);
})

app.post('/newAssessment', async (req, res) => {
    let patientData = new PatientWithID(req.query.patient_id);
    await patientData.getById();
    let visitData = new Visit(req.query.visit_id, null, null, null, null);
    await visitData.getById(req.query.visit_id);
    await visitData.addAssessment(req.body.health, req.body.diff);
    res.redirect('/newMDM?patient_id=' + req.query.patient_id + '&visit_id=' + req.query.visit_id);
})

// app.post('/newMedicine', async (req, res) => {
//     await visitData.addMedicine(req.body.medicine);
//     res.redirect('/newMDM');
// })

app.post('/newMDM', async (req, res) => {
    let patientData = new PatientWithID(req.query.patient_id);
    await patientData.getById();
    let visitData = new Visit(req.query.visit_id, null, null, null, null);
    await visitData.getById(req.query.visit_id);
    await visitData.addMDM(req.body.thoughts, req.body.name, req.body.ref, req.body.plan, req.body.med);
    console.log(visitData.phys_thoughts);
    res.redirect('/visit-record?patient_id=' + req.query.patient_id + '&visit_id=' + req.query.visit_id);
})

app.post('/newFamily', async (req, res) => {
    let patientData = new PatientWithID(req.query.patient_id);
    await patientData.getById();
    let visitData = new Visit(req.query.visit_id, null, null, null, null);
    await visitData.getById(req.query.visit_id);
    await patientData.addFamily(req.body.mother, req.body.father, req.body.siblings, req.body.children, req.body.sig_other, req.query.visit_id);
    res.redirect('/visit-record?patient_id=' + patientData.patient_id + '&visit_id=' + visitData.visit_id);
})


app.get('/newPhys', async (req, res) => {
    let patientData = new PatientWithID(req.query.patient_id);
    await patientData.getById();
    let visitData = new Visit(req.query.visit_id, null, null, null, null);
    await visitData.getById(req.query.visit_id);
    res.render('newPhys.ejs', {patient: patientData, visit: visitData, title: 'Add Physical Exam'})
})

app.get('/newMDM', async (req, res) => {
    let patientData = new PatientWithID(req.query.patient_id);
    await patientData.getById();
    let visitData = new Visit(req.query.visit_id, null, null, null, null);
    await visitData.getById(req.query.visit_id);
    res.render('newMDM.ejs', {patient: patientData, visit: visitData, title: 'Add MDM'})
})




app.get('/newFamily', async (req, res) => {
    let patientData = new PatientWithID(req.query.patient_id);
    await patientData.getById();
    let visitData = new Visit(req.query.visit_id, null, null, null, null);
    await visitData.getById(req.query.visit_id);
    res.render('newFamily.ejs', {patient: patientData, visit: visitData, title: 'Add Family'})
})

app.get('/newPatient', (req, res) => {
    res.render('newPatient.ejs', {title: 'Add Patient'})
})

app.get('/newSocial', async (req, res) => {
    let patientData = new PatientWithID(req.query.patient_id);
    await patientData.getById();
    let visitData = new Visit(req.query.visit_id, null, null, null, null);
    await visitData.getById(req.query.visit_id);
    res.render('newSocial.ejs', {patient: patientData, visit: visitData, title: 'Add Social History'})
})

app.get('/newVitals', async (req, res) => {
    let patientData = new PatientWithID(req.query.patient_id);
    await patientData.getById();
    let visitData = new Visit(req.query.visit_id, null, null, null, null);
    await visitData.getById(req.query.visit_id);
    res.render('newVitals.ejs', {visit: visitData, patient: patientData, title: 'Add Vitals'})
})

app.get('/newVisit', async (req, res) => {
    let patientData = new PatientWithID(req.query.patient_id);
    await patientData.getById();
    res.render('newVisit.ejs', {patient: patientData, title: 'Add Visit'})
})

app.get('/newROS', async (req, res) => {
    let patientData = new PatientWithID(req.query.patient_id);
    await patientData.getById();
    let visitData = new Visit(req.query.visit_id, null, null, null, null);
    await visitData.getById(req.query.visit_id);
    res.render('newROS.ejs', {patient: patientData, visit: visitData, title: 'Review of Systems'})
})

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});