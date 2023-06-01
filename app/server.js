const express = require('express');
const pool = require('/Users/saim_bhimji/repo/emr2/database/db.js');
const fs = require('fs');
const Patient = require('../database/Patient.js');
const PatientWithID = require('../database/PatientWithID.js');
const { render } = require('ejs');
const { builtinModules } = require('module');
var bodyParser = require('body-parser');
const Visit = require('../database/Visit.js');
//const VisitWithID = require('../database/VisitWithID.js');

const app = express();


app.use(bodyParser.urlencoded({ extended: false }))


const port = 3000;

app.set('view_engine', 'ejs')
app.use(express.static(__dirname + '/views'));
app.use(express.static(__dirname + '/img'));
app.use(express.urlencoded({ extended: false}))

let patientData = null;
let visitData = null;
let visFound = false;

app.post('/patient', async (req, res) => {
    patientData = new Patient(req.body.fname, req.body.lname, req.body.sex, req.body.birth_year, 
        req.body.birth_month, req.body.birth_day, req.body.age, req.body.insurance, req.body.pcp);
    await patientData.initializeData();
    res.direct('/patient-record')
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
                console.log('Account not found.')
                response.redirect('/');
            } else {
                if ((req.body.password).localeCompare(res.rows[0].password) === 0) {
                    console.log("Login attempt logged successfully.")
                    response.redirect('/home');
                } else {
                    console.log("Incorrect username/password.")
                    response.redirect('/');
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
        if (req.body.birth_year.localeCompare("") != 0) {
            if (count != 1) {
                text += ` AND CAST(birth_year AS VARCHAR(4)) LIKE '%' || $${count++} || '%'`
            } else {
                text += ` CAST(birth_year AS VARCHAR(4)) LIKE '%' || $${count++} || '%'`
            }
            values.push(req.body.birth_year);
        }
        if (req.body.birth_month.localeCompare("Select Month") != 0) {
            if (count != 1) {
                text += ` AND birth_month LIKE '%' || $${count++} || '%'`
            } else {
                text += `birth_month LIKE '%' || $${count++} || '%'`
            }
            values.push(req.body.birth_month);
        }
        if (req.body.birth_day.localeCompare("Select Day") != 0) {
            if (count != 1) {
                text += ` AND CAST(birth_day AS VARCHAR(2)) LIKE '%' || $${count++} || '%'`
            } else {
                text += `CAST(birth_day AS VARCHAR(2)) LIKE '%' || $${count++} || '%'`
            }
            values.push(req.body.birth_day);
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
        //const values = [req.body.fname.toUpperCase(), req.body.lname.toUpperCase(), req.body.birth_year, req.body.birth_month, req.body.birth_day, req.body.mrn]
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
    res.render('login.ejs', {title: 'Login Page'})
}) 

app.get('/patient-record', async (req, res) => {
    if (Object.keys(req.query).length > 0) {
        patientData = new PatientWithID(req.query.patient_id);
        await patientData.initializeData();
        //await patientData.getById();
    }
    await res.render('patient-record.ejs', { patient: patientData, title: 'Patient Record'})
}) 

app.get('/visit-record', async (req, res) => {
    if (Object.keys(req.query).length > 0) {
        console.log(req.query.visit_id);
        visitData = new Visit(req.query.visit_id, null, null, null, null, null, null, null, null, null, null, null, null, null,
            null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null,
            null, null, null, null, null, null, null, null, null, null, null, null, null, null);
        await visitData.getById(req.query.visit_id);
    }
    await res.render('visit-record.ejs', { visit: visitData, patient: patientData, title: 'Visit Record'})
}) 

app.post('/visit', async (req, res) => {
    await patientData.addVisit(req.body.eventName, req.body.visitDate, req.body.phys);

    await res.render('patient-record.ejs', { patient: patientData, title: 'Patient Record'})
})

app.post('/vitals', async (req, res) => {
    await visitData.addVitals(req.body.pulse, req.body.bp, req.body.temp, req.body.r_rate,
        req.body.height, req.body.weight, req.body.blood_sug, req.body.hrs_meal);
    res.redirect('/visit-record')
})

app.post('/newROS', async (req, res) => {
    var ros_gen = req.body.weight_loss + '/' + req.body.fatigue + '/' + req.body.sweats;
    var ros_cardio = req.body.chestPain + '/' + req.body.palp + '/' + req.body.sob;
    var ros_resp = req.body.coughing + '/' + req.body.wheez + '/' + req.body.diff + '/' + req.body.phlegm;
    var ros_skin = req.body.rashes + '/' + req.body.bruis + '/' + req.body.moles;
    var ros_heent = req.body.headaches + '/' + req.body.vis + '/' + req.body.sinus + '/' + req.body.sore;
    var ros_gi = req.body.nausea + '/' + req.body.diar + '/' + req.body.const + '/' + req.body.bm_change;
    var ros_mus = req.body.stiff + '/' + req.body.musc + '/' + req.body.back;
    var ros_endo = req.body.heat + '/' + req.body.hair + '/' + req.body.thirst + '/' + req.body.polyuria;

    var ros_gu = '';
    if(patientData.sex.localeCompare('Male') === 0) {
        ros_gu = req.body.penile + '/' + req.body.dysuria + '/' + req.body.tes + '/' + req.body.hernias;
    } else {
        ros_gu = req.body.lmp + '/' + req.body.regular + '/' + req.body.tamp + '/' + req.body.breast + '/' + req.body.vag + '/' + req.body.dysuria2;
    }
    await visitData.addROS(ros_gen, ros_cardio, ros_resp, ros_skin, ros_heent, ros_gi, ros_gu, ros_mus, ros_endo);
    res.redirect('/visit-record')
})

app.post('/newPhys', async (req, res) => {
    console.log(req.body.gen_norm)
    await visitData.addPhys(req.body.gen_norm, req.body.gen_ab, req.body.heart_norm, req.body.heart_ab, 
        req.body.lung_norm, req.body.lung_ab, req.body.skin_norm, req.body.skin_ab, req.body.heent_norm, req.body.heent_ab,
        req.body.abdo_norm, req.body.abdo_ab, req.body.mus_norm, req.body.mus_ab, req.body.neuro_norm, req.body.neuro_ab, req.body.omm_norm, req.body.omm_ab, 
        req.body.phys_oth_norm, req.body.phys_oth_ab);
    res.redirect('/visit-record');
})

app.post('/newHPI', async (req, res) => {
    await visitData.addHPI(req.body.hpi);
    res.redirect('/visit-record');
})

app.post('/newAssessment', async (req, res) => {
    await visitData.addAssessment(req.body.health, req.body.diff);
    res.redirect('/newMDM');
})

// app.post('/newMedicine', async (req, res) => {
//     await visitData.addMedicine(req.body.medicine);
//     res.redirect('/newMDM');
// })

app.post('/newMDM', async (req, res) => {
    await visitData.addMDM(req.body.thoughts, req.body.name, req.body.ref, req.body.plan, req.body.med);
    res.redirect('/visit-record');
})

app.get('/newPhys', (req, res) => {
    res.render('newPhys.ejs', {title: 'Add Physical Exam'})
})
app.get('/newMDM', (req, res) => {
    res.render('newMDM.ejs', {title: 'Add MDM'})
})


app.get('/newHPI', (req, res) => {
    res.render('newHPI.ejs', {title: 'Add HPI'})
})

app.get('/newPatient', (req, res) => {
    res.render('newPatient.ejs', {title: 'Add Patient'})
})

app.get('/newHPI', (req, res) => {
    res.render('newHPI.ejs', {title: 'Add HPI'})
})

app.get('/newVitals', (req, res) => {
    res.render('newVitals.ejs', {title: 'Add Vitals'})
})

app.get('/newVisit', (req, res) => {
    res.render('newVisit.ejs', {title: 'Add Visit'})
})

app.get('/newROS', (req, res) => {
    res.render('newROS.ejs', {patient: patientData, title: 'Review of Systems'})
})

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});