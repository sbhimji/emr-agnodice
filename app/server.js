const express = require('express');
const pool = require('../database/db');
const fs = require('fs');
const PatientWithID = require('../libs/classes/Patient.js');
const { render } = require('ejs');
const { builtinModules } = require('module');
var bodyParser = require('body-parser');
const Visit = require('../libs/classes/Visit.js');
const path = require('path');
const bcrypt = require('bcrypt')
const notifier = require('node-notifier');
var session = require('express-session');
var passport = require("passport");
require("../config/passport")(passport);
const app = express();
const User = require('../libs/classes/User.js')
const addAudit = require('../libs/misc-func/addAudit');

require('dotenv').config();

const expressSession = require('express-session');
app.use(expressSession({secret: process.env.EXPRESS_SECRET}));
app.use(passport.initialize());
app.use(passport.session());
app.use(session({secret: process.env.APP_SECRET}))

app.use(bodyParser.urlencoded({ extended: false }))


const port = 3000;

app.set('views', '../public/views');
app.set('view_engine', 'ejs')
app.use(express.static('../public'));
app.use(express.urlencoded({ extended: false}))

app.get('/', (req, res) => {
    if (Object.keys(req.query).length > 0 && req.query.str) {
        res.render('login.ejs', {title: 'Login Page', str : 'Incorrect username or password'}); 
    } else {
        req.logout(function(err) {
            if (err) { 
                res.render('login.ejs', {title: 'Login Page', str : ""}); 
            }
            res.render('login.ejs', {title: 'Login Page', str : ""});
        });
    }
}) 

app.post('/patient', async (req, res) => {
    console.log(req.body.birthday);
    const today = new Date();
    const birth = new Date(req.body.birthday);

    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
        age--;
    }
    let patientData = new PatientWithID(null);
    await patientData.addPatient(req.body.fname, req.body.lname, req.body.sex, req.body.birthday, age, req.body.insurance, req.body.pcp);
    await patientData.getPatientId();

    //await addAudit(req.user.username, "Add", patientData.patient_id, null, (req.user.fname + " " + req.user.lname + " added patient: " + req.body.fname + " " + req.body.lname))
    res.redirect('/patient-record?patient_id=' + patientData.patient_id);
})

app.post(
    "/login",
    passport.authenticate("local-login", { 
        successRedirect: '/home',
        failureRedirect: `/?str=true`,
        session: true
    }),
    (req, res, next) => {
        res.json({ user: req.user });
    }
);


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
    const query = require('../libs/misc-func/selectPatients');
    const patients = await query();
    if (req.isAuthenticated()) {
        res.render('home.ejs', { 
            patients 
        })
    } else{
        res.redirect('/')
    }
    
})

app.get('/user', async (req, res) => {
    if (req.isAuthenticated()) {
        const user = req.user;
        res.render('records/user.ejs', { user: user, title: "User Record"})
    } else{
        res.redirect('/')
    }
    
})





app.get('/patient-record', async (req, res) => {
    if (req.isAuthenticated()) {
        let patientData = null;
        if (Object.keys(req.query).length > 0) {
            console.log("Patient Record: " + req.query.patient_id);
            patientData = new PatientWithID(req.query.patient_id);
            await patientData.initializeData();
           // await addAudit(req.user.username, "Accessed", patientData.patient_id, null, (req.user.fname + " " + req.user.lname + ": accessed patient record " + req.query.patient_id))
            //await patientData.getById();
        }   
        res.render('records/patient-record.ejs', { patient: patientData, title: 'Patient Record'})
    } else{
        res.redirect('/')
    }
    
}) 

app.get('/visit-record', async (req, res) => {
    if (req.isAuthenticated()) {
        let visitData;
        let patientData;
        if (Object.keys(req.query).length > 0) {
            console.log("YO: " + req.query.patient_id);
            patientData = new PatientWithID(req.query.patient_id);
            await patientData.getById();
        
            visitData = new Visit(req.query.visit_id, null, null, null, null);
            await visitData.getById(req.query.visit_id);
            
            //await addAudit(req.user.username, "Accessed", req.query.patient_id, req.query.visit_id, (req.user.fname + " " + req.user.lname + ": accessed visit record " + req.query.visit_id))
            console.log("Visit Record: " + req.query.visit_id);
        }
        res.render('records/visit-record.ejs', { visit: visitData, patient: patientData, title: 'Visit Record'})
    } else{
        res.redirect('/')
    }
    
}) 

app.post('/visit', async (req, res) => {
    console.log(req.query.patient_id);
    let patientData = new PatientWithID(req.query.patient_id);
    await patientData.initializeData();

    //var visDate = req.body.year + '-' + req.body.month + '-' + req.body.day;
    await patientData.addVisit(req.body.eventName, req.body.visitDate, req.body.phys, req.body.consent);

    let visitData = new Visit(null, req.body.eventName, req.body.visitDate, req.body.phys, req.body.consent);
    await visitData.getVisitId();
    //await addAudit(req.user.username, "Added", req.query.patient_id, visitData.visit_id, (req.user.fname + " " + req.user.lname + ": added visit record " + visitData.visit_id))
    await res.render('records/patient-record.ejs', { patient: patientData, title: 'Patient Record'})
})

app.post('/vitals', async (req, res) => {
    let patientData = new PatientWithID(req.query.patient_id);
    await patientData.getById();
    let visitData = new Visit(req.query.visit_id, null, null, null, null);
    await visitData.getById(req.query.visit_id);
    await visitData.addVitals(req.body.pulse, req.body.bp, req.body.temp, req.body.r_rate,
        req.body.height, req.body.weight, req.body.blood_sug, req.body.hrs_meal);
   // await addAudit(req.user.username, "Added", req.query.patient_id, req.query.visit_id, (req.user.fname + " " + req.user.lname + ": added vitals to visit-record " + req.query.visit_id))
    res.redirect('/visit-record?patient_id=' + req.query.patient_id + '&visit_id=' + req.query.visit_id);
})

app.post('/newROS', async (req, res) => {
    let patientData = new PatientWithID(req.query.patient_id);
    await patientData.getById();
    let visitData = new Visit(req.query.visit_id, null, null, null, null);
    await visitData.getById(req.query.visit_id);
    const updateText = require('../libs/misc-func/updateROSText')
    var ros_gen = await updateText([req.body.weight_loss, req.body.fatigue, req.body.sweats, req.body.sleep]);
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
    //await addAudit(req.user.username, "Added", req.query.patient_id, req.query.visit_id, (req.user.fname + " " + req.user.lname + ": added ROS to visit-record " + req.query.visit_id))
    res.redirect('/visit-record?patient_id=' + req.query.patient_id + '&visit_id=' + req.query.visit_id);
})

app.post('/newPhys', async (req, res) => {
    let vals = [req.body.gen_norm, req.body.gen_ab, req.body.heart_norm, req.body.heart_ab,
        req.body.lung_norm, req.body.lung_ab, req.body.skin_norm, req.body.skin_ab, req.body.heent_norm, req.body.heent_ab,
        req.body.abdo_norm, req.body.abdo_ab, req.body.mus_norm,  req.body.mus_ab, req.body.neuro_norm, req.body.neuro_ab,
        req.body.omm_norm, req.body.omm_ab, req.body.phys_oth_norm, req.body.phys_oth_ab];
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
    //await addAudit(req.user.username, "Added", req.query.patient_id, req.query.visit_id, (req.user.fname + " " + req.user.lname + ": added phys-exam to visit-record " + req.query.visit_id))
    res.redirect('/visit-record?patient_id=' + req.query.patient_id + '&visit_id=' + req.query.visit_id);
})

app.post('/newHPI', async (req, res) => {
    let patientData = new PatientWithID(req.query.patient_id);
    await patientData.getById();
    let visitData = new Visit(req.query.visit_id, null, null, null, null);
    await visitData.getById(req.query.visit_id);
    await visitData.addHPI(req.body.hpi);
    //await addAudit(req.user.username, "Added", req.query.patient_id, req.query.visit_id, (req.user.fname + " " + req.user.lname + ": added HPI to visit-record " + req.query.visit_id))
    res.redirect('/visit-record?patient_id=' + req.query.patient_id + '&visit_id=' + req.query.visit_id);
})

app.post('/medHist', async (req, res) => {
    let patientData = new PatientWithID(req.query.patient_id);
    await patientData.getById();
    let visitData = new Visit(req.query.visit_id, null, null, null, null);
    await visitData.getById(req.query.visit_id);
    await patientData.addMedHist(req.body.condition, req.body.year, req.body.meds, req.body.dose, req.body.hosp);
    //await addAudit(req.user.username, "Added", req.query.patient_id, req.query.visit_id, (req.user.fname + " " + req.user.lname + ": added medical-history to visit-record " + req.query.visit_id))
    res.redirect('/visit-record?patient_id=' + req.query.patient_id + '&visit_id=' + req.query.visit_id);
})

app.get('/newHPI', async (req, res) => {
    if (req.isAuthenticated()) {
        let patientData = new PatientWithID(req.query.patient_id);
        await patientData.getById();
        let visitData = new Visit(req.query.visit_id, null, null, null, null);
        await visitData.getById(req.query.visit_id);
        res.render('forms/visit/newHPI.ejs', {patient: patientData, visit: visitData, title: 'Add HPI'});
    } else{
        res.redirect('/')
    }
})

app.get('/medHist', async (req, res) => {
    if (req.isAuthenticated()) {
        let patientData = new PatientWithID(req.query.patient_id);
        await patientData.getById();
        let visitData = new Visit(req.query.visit_id, null, null, null, null);
        await visitData.getById(req.query.visit_id);
        res.render('forms/visit/medHist.ejs', {patient: patientData, visit: visitData, title: 'Update Medical History'});
    } else{
        res.redirect('/')
    }
})

app.post('/newSocial', async (req, res) => {
    pkday = parseInt(req.body.pkday);
    yrs = parseInt(req.body.yrs);
    alc = parseInt(req.body.alc);

    if (req.body.pkday === "" || req.body.yrs === "" || req.body.alc === "") {
        pkday = 0;
        yrs = 0;
        alc = 0;
    }
    let patientData = new PatientWithID(req.query.patient_id);
    await patientData.getById();
    let visitData = new Visit(req.query.visit_id, null, null, null, null);
    await visitData.getById(req.query.visit_id);
    let packs_yr = pkday * yrs;
    await patientData.addSocial(req.body.occupation,req.body.diet, req.body.exercise, req.body.curr_hous, req.body.yr3_hous, 
        req.body.caffeine, alc, pkday, yrs, packs_yr, req.body.quit, req.body.marijuana, req.body.fundr, req.body.pets, req.body.sex_act, 
        req.body.partners, req.body.protection, req.body.sti, req.query.visit_id);
   // await addAudit(req.user.username, "Added", req.query.patient_id, req.query.visit_id, (req.user.fname + " " + req.user.lname + ": added social-history to visit-record " + req.query.visit_id))
    res.redirect('/visit-record?patient_id=' + req.query.patient_id + '&visit_id=' + req.query.visit_id);
})

app.post('/newAssessment', async (req, res) => {
    let patientData = new PatientWithID(req.query.patient_id);
    await patientData.getById();
    let visitData = new Visit(req.query.visit_id, null, null, null, null);
    await visitData.getById(req.query.visit_id);
    await visitData.addAssessment(req.body.health, req.body.diff);
    //await addAudit(req.user.username, "Added", req.query.patient_id, req.query.visit_id, (req.user.fname + " " + req.user.lname + ": added assessment to visit-record " + req.query.visit_id))
    res.redirect('/visit-record?patient_id=' + req.query.patient_id + '&visit_id=' + req.query.visit_id);
})

app.get('/newAssessment', async (req, res) => {
    if (req.isAuthenticated()) {
        let patientData = new PatientWithID(req.query.patient_id);
        await patientData.getById();
        let visitData = new Visit(req.query.visit_id, null, null, null, null);
        await visitData.getById(req.query.visit_id);
        res.render('forms/visit/newAssessment.ejs', {patient: patientData, visit: visitData, title: 'Add Assessment'});
    } else{
        res.redirect('/')
    }
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
    //await addAudit(req.user.username, "Added", req.query.patient_id, req.query.visit_id, (req.user.fname + " " + req.user.lname + ": added MDM to visit-record " + req.query.visit_id))
    res.redirect('/visit-record?patient_id=' + req.query.patient_id + '&visit_id=' + req.query.visit_id);
})

app.post('/urine', async (req, res) => {
    let patientData = new PatientWithID(req.query.patient_id);
    await patientData.getById();
    let visitData = new Visit(req.query.visit_id, null, null, null, null);
    await visitData.getById(req.query.visit_id);
    await visitData.addUrine(req.body.leuko, req.body.nitrite, req.body.uro, req.body.protein, req.body.ph, req.body.blood, req.body.spec, req.body.ketone, req.body.bili, req.body.glucose);
    //await addAudit(req.user.username, "Added", req.query.patient_id, req.query.visit_id, (req.user.fname + " " + req.user.lname + ": added urine testing to visit-record " + req.query.visit_id))
    res.redirect('/visit-record?patient_id=' + req.query.patient_id + '&visit_id=' + req.query.visit_id);
})

app.post('/newFamily', async (req, res) => {
    let patientData = new PatientWithID(req.query.patient_id);
    await patientData.getById();
    let visitData = new Visit(req.query.visit_id, null, null, null, null);
    await visitData.getById(req.query.visit_id);
    await patientData.addFamily(req.body.mother, req.body.father, req.body.siblings, req.body.children, req.body.sig_other, req.query.visit_id);
    //await addAudit(req.user.username, "Added", req.query.patient_id, req.query.visit_id, (req.user.fname + " " + req.user.lname + ": added family-history to visit-record " + req.query.visit_id))
    res.redirect('/visit-record?patient_id=' + patientData.patient_id + '&visit_id=' + visitData.visit_id);
})

app.get('/register', async (req, res) => {
    if (req.isAuthenticated()) {
        const user = req.user;
        if (user.role === "admin") {
            res.render('forms/register.ejs')
        }
    } else {
        res.redirect('/')
    }
})

app.get('/reset', async (req, res) => {
    if (req.isAuthenticated()) {
        const user = req.user;
        if (user.role === "admin") {
            res.render('forms/resetPassword.ejs')
        }
    } else {
        res.redirect('/')
    }
})

app.get('/changePassword', async (req, res) => {
    if (req.isAuthenticated()) {
        const user = req.user;
        res.render('forms/changePassword.ejs', {user: user})
    } else {
        res.redirect('/')
    }
})

app.post('/change-pass', async (req, res) => {
    const user = req.user;
    const text = `
        UPDATE public."Users"
        SET password = $1
        WHERE username = $2
      `;
      const password = await bcrypt.hash(req.body.pass, 10)
      const values = [password, user.username];
      await pool
        .query(text, values)
        .then((res) => {
          console.log("Password changed.")
        })
        .catch((err) => console.error('Error executing query', err.stack));
    
    res.redirect('/')
})

app.post('/register', async (req, response) => {
    const text0 = `
    SELECT * FROM public."Users"
    WHERE username = $1
    `
    const values0 = [req.body.user];
    await pool
      .query(text0, values0)
      .then(async (res) => {
        if (res.rowCount === 0) {
            const text = `
            INSERT INTO public."Users"
            VALUES($1, $2, $3, $4, $5, $6)
            `
            const password = await bcrypt.hash(req.body.pass, 10)
            console.log(password)
            const values = [req.body.fname, req.body.lname, req.body.user, password, req.body.email, req.body.role];
            await pool
              .query(text, values)
              .then(async (res) => {
                console.log("User Added.")
               // await addAudit(req.user.username, "Added", null, null, (req.user.fname + " " + req.user.lname + ": added a new user "))
              })
              .catch((err) => console.error('Error executing query', err.stack));
            response.redirect('/');
        } else {
            response.redirect('/register');
        }
      })
      .catch((err) => console.error('Error executing query', err.stack));
})

app.post('/reset', async (req, response) => {
    const text = `
    UPDATE public."Users"
    SET password = $2
    WHERE username = $1
    `
    const password = await bcrypt.hash(req.body.pass, 10)
    const values = [req.body.username, password];
    await pool
      .query(text, values)
      .then(async (res) => {
       // await addAudit(req.user.username, "Changed ", null, null, (req.user.fname + " " + req.user.lname + ": changed " + req.body.username + " password"))
        response.redirect('/user')
      })
      .catch((err) => console.error('Error executing query', err.stack));
})


app.get('/newPhys', async (req, res) => {
    if (req.isAuthenticated()) {
        let patientData = new PatientWithID(req.query.patient_id);
        await patientData.getById();
        let visitData = new Visit(req.query.visit_id, null, null, null, null);
        await visitData.getById(req.query.visit_id);
        res.render('forms/visit/newPhys.ejs', {patient: patientData, visit: visitData, title: 'Add Physical Exam'})
    } else{
        res.redirect('/')
    }
})

app.get('/newMDM', async (req, res) => {
    if (req.isAuthenticated()) {
        let patientData = new PatientWithID(req.query.patient_id);
        await patientData.getById();
        let visitData = new Visit(req.query.visit_id, null, null, null, null);
        await visitData.getById(req.query.visit_id);
        res.render('forms/visit/newMDM.ejs', {patient: patientData, visit: visitData, title: 'Add MDM'})
    } else{
        res.redirect('/')
    }
   
})




app.get('/newFamily', async (req, res) => {
    if (req.isAuthenticated()) {
        let patientData = new PatientWithID(req.query.patient_id);
        await patientData.getById();
        let visitData = new Visit(req.query.visit_id, null, null, null, null);
        await visitData.getById(req.query.visit_id);
        res.render('forms/visit/newFamily.ejs', {patient: patientData, visit: visitData, title: 'Add Family'})
    } else{
        res.redirect('/')
    }
})

app.get('/newPatient', (req, res) => {
    if (req.isAuthenticated()) {
        res.render('forms/newPatient.ejs', {title: 'Add Patient'})
    } else{
        res.redirect('/')
    }
    
})

app.get('/newSocial', async (req, res) => {
    if (req.isAuthenticated()) {
        let patientData = new PatientWithID(req.query.patient_id);
        await patientData.getById();
        let visitData = new Visit(req.query.visit_id, null, null, null, null);
        await visitData.getById(req.query.visit_id);
        res.render('forms/visit/newSocial.ejs', {patient: patientData, visit: visitData, title: 'Add Social History'})
    } else{
        res.redirect('/')
    }
})

app.get('/newVitals', async (req, res) => {
    if (req.isAuthenticated()) {
        let patientData = new PatientWithID(req.query.patient_id);
        await patientData.getById();
        let visitData = new Visit(req.query.visit_id, null, null, null, null);
        await visitData.getById(req.query.visit_id);
        res.render('forms/visit/newVitals.ejs', {visit: visitData, patient: patientData, title: 'Add Vitals'})
    } else{
        res.redirect('/')
    }
    
})

app.get('/newVisit', async (req, res) => {
    if (req.isAuthenticated()) {
        let patientData = new PatientWithID(req.query.patient_id);
        await patientData.getById();
        res.render('forms/visit/newVisit.ejs', {patient: patientData, title: 'Add Visit'})
    } else{
        res.redirect('/')
    }
    
})

app.get('/newROS', async (req, res) => {
    if (req.isAuthenticated()) {
        let patientData = new PatientWithID(req.query.patient_id);
        await patientData.getById();
        let visitData = new Visit(req.query.visit_id, null, null, null, null);
        await visitData.getById(req.query.visit_id);
        res.render('forms/visit/newROS.ejs', {patient: patientData, visit: visitData, title: 'Review of Systems'})
    } else{
        res.redirect('/')
    }
})

app.get('/urine', async (req, res) => {
    if (req.isAuthenticated()) {
        let patientData = new PatientWithID(req.query.patient_id);
        await patientData.getById();
        let visitData = new Visit(req.query.visit_id, null, null, null, null);
        await visitData.getById(req.query.visit_id);
        res.render('forms/visit/urineTest.ejs', {patient: patientData, visit: visitData, title: 'Urine Test'})
    } else{
        res.redirect('/')
    }
})

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});