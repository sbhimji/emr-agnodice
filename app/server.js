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
    patientData = new Patient(req.body.fname, req.body.lname, req.body.sex, req.body.birth_year, req.body.birth_month, req.body.birth_day, req.body.age, req.body.insurance, req.body.pcp);
    await patientData.initializeData();
    res.redirect('/patient-record')
})



app.post('/login', async (req, res) => {
    const date = new Date();
    const text = `
        INSERT INTO public."login"(
            date, username)
            VALUES ($1, $2);
        `
    const values = [date, req.body.username];
    pool            
        .query(text, values)
        .then((res) => {
            console.log("Login attempt logged successfully.")
            
        })
        .catch((err) => console.error('Error executing query', err.stack))
    res.redirect('/home')
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
        visitData = new Visit(req.query.visit_id, null, null, null, null);
        await visitData.getById(req.query.visit_id);
        //await patientData.getById();
    }
    //visitData = new VisitWithID(req.query.visit_id);
    //await (visitData.initializeDataById());
    await res.render('visit-record.ejs', { visit: visitData, patient: patientData, title: 'Visit Record'})
}) 

app.post('/visit', async (req, res) => {
    await patientData.addVisit(req.body.eventName, req.body.visitDate, req.body.phys);
    //visitData = await patientData.addVisit(req.body.eventName, req.body.visitDate, req.body.phys);

    await res.render('patient-record.ejs', { patient: patientData, title: 'Patient Record'})
})

app.get('/newPatient', (req, res) => {
    res.render('newPatient.ejs')
})

app.get('/newVisit', (req, res) => {
    res.render('newVisit.ejs')
})

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});