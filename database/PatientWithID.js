const pool = require('/Users/saim_bhimji/repo/emr2/database/db.js');
const Visit = require('../database/Visit');
//const VisitWithID = require('../database/VisitWithID');

class PatientWithID {
  constructor(patient_id) {
    this.patient_id = patient_id;
    this.fName = null;
    this.lName = null;
    this.sex = null;
    this.birth_year = null;
    this.birth_month = null;
    this.birth_day = null;
    this.age = null;
    this.insurance = null;
    this.pcp = null;
    this.visits = [];
  }

  async getById() {
    const text = `
      SELECT * FROM public."patientGenInfo"
      WHERE patient_id = $1
    `;
    const values = [this.patient_id];
    await pool
      .query(text, values)
      .then((res) => {
        this.fName = res.rows[0].fname;
        this.lName = res.rows[0].lname;
        this.sex = res.rows[0].sex;
        this.birth_year = res.rows[0].birth_year;
        this.birth_month = res.rows[0].birth_month;
        this.birth_day = res.rows[0].birth_day;
        this.age = res.rows[0].age;
        this.insurance = res.rows[0].insurance;
        this.pcp = res.rows[0].pcp;
      })
      .catch((err) => console.error('Error executing query', err.stack));
  }

  async getVisits() {
    const qtext = `
      SELECT * FROM public."visit"
      WHERE patient_id = $1
    `;
    const qvalues = [this.patient_id];
    await pool
      .query(qtext, qvalues)
      .then(async (res) => {
        await Promise.all(res.rows.map(async (row) => {
          const visit1 = new Visit(row.visit_id, null, null, null, null, null, null, null, null, null, null, null, null,
            null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null,
            null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null);
          //await visit1.initializeDataById();
          await visit1.getById(row.visit_id);
          await this.visits.push(visit1);
        }));
      })
      .catch((err) => console.error('Error executing query', err.stack));
  }

  async initializeData() {
    await this.getById();
    await this.getVisits();
  }

  async addVisit(event, date, physician) {
    //const visit = new Visit(null, this.patient_id, event, date, physician);
    

    const text = `
        INSERT INTO public."visit" (
            patient_id, event_name, visit_date, attending_physician
        )
        VALUES ($1, $2, $3, $4);
        `;
    const values = [this.patient_id, event, date, physician];

    await pool
        .query(text, values)
        .then(async (res) => {
            //const visit = new Visit(res.rows[0].visit_id, this.patient_id, event, date, physician);
            console.log("Visit added");
            //await (visit.initializeData());
            //console.log(visit.visit_id);
            //this.visits.push(visit);
            //return visit;
        })
        .catch((err) => {
            console.error('Error executing query', err.stack);
        });

    const text2 = `
        SELECT * FROM public."visit"
        WHERE patient_id = $1
        AND event_name LIKE '%' || $2 || '%' 
        AND visit_date LIKE '%' || $3 || '%' 
        `;
    const values2 = [this.patient_id, event, date];
    await pool
        .query(text2, values2)
        .then(async (res) => {
            const visit = new Visit(res.rows[0].visit_id, this.patient_id, event, date, physician, null, null, null, null, null, 
              null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null,
              null, null, null, null, null, null, null, null, null, null, null, null, null, null);
            console.log("Visit added");
            this.visits.push(visit);
            //return visit;
        })
  }
}

module.exports = PatientWithID;

