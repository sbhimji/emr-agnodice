const pool = require('../database/db');
const Visit = require('../database/Visit');

class PatientWithID {
  constructor(patient_id) {
    this.patient_id = patient_id;
    this.fName = null;
    this.lName = null;
    this.sex = null;
    this.birthday = null;
    this.age = null;
    this.insurance = null;
    this.pcp = null;
    this.visits = [];
    this.occupation = null;
    this.diet = null;
    this.exercise = null
    this.curr_hous = null;
    this.yr3_hous = null;
    this.caffeine = null;
    this.alc = null
    this.packs_day = null;
    this.yrs = null;
    this.pack_yrs = null;
    this.tobacco = null;
    this.marijuana = null;
    this.quit = null;
    this.fun_drugs = null;
    this.sex_act = null;
    this.partners = null;
    this.protection = null;
    this.sti = null;
    this.mother = null;
    this.father = null;
    this.siblings = null;
    this.children = null;
    this.sig_other = null;
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
        this.birthday = res.rows[0].birthday;
        this.age = res.rows[0].age;
        this.packs_day = res.rows[0].packs_day;
        this.yrs = res.rows[0].tobac_yrs;
        this.pack_yrs = res.rows[0].pack_yrs;
        this.insurance = res.rows[0].insurance;
        this.pcp = res.rows[0].pcp;
        this.occupation = res.rows[0].soc_hist_occ;
        this.diet = res.rows[0].soc_hist_diet;
        this.exercise = res.rows[0].soc_hist_exc;
        this.curr_hous = res.rows[0].curr_housing;
        this.yr3_hous = res.rows[0].yr3_housing;
        this.caffeine = res.rows[0].caffeine_use;
        this.alc = res.rows[0].alc_use;
        this.tobacco = res.rows[0].tobacco_use;
        this.marijuana = res.rows[0].marijuana_use;
        this.quit = res.rows[0].desire_to_quit;
        this.fun_drugs = res.rows[0].fun_drugs;
        this.sex_act = res.rows[0].sex_active;
        this.partners = res.rows[0].last_year_part;
        this.protection = res.rows[0].protection_use;
        this.sti = res.rows[0].sti;
        this.mother = res.rows[0].fam_mother;
        this.father = res.rows[0].fam_father;
        this.siblings = res.rows[0].fam_siblings;
        this.children = res.rows[0].fam_children;
        this.sig_other = res.rows[0].fam_sig_other;
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
          const visit1 = new Visit(row.visit_id, null, null, null, null);
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

  async addVisit(event, date, physician, consent) {
    //const visit = new Visit(null, this.patient_id, event, date, physician);
    

    const text = `
        INSERT INTO public."visit" (
            patient_id, event_name, visit_date, attending_physician, consent
        )
        VALUES ($1, $2, $3, $4, $5);
        `;
    const values = [this.patient_id, event, date, physician, consent];

    await pool
        .query(text, values)
        .then(async (res) => {
            console.log("Visit added");
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
            const visit = new Visit(res.rows[0].visit_id, this.patient_id, event, date, physician);
            console.log("Visit added");
            this.visits.push(visit);
            //return visit;
        })
  }
  async addSocial(occupation, diet, exercise, curr_hous, yr3_hous, caffeine, alc, packs_day, yrs, pack_yrs, quit, marijuana, fun_drugs,
    sex_act, partners, protection, sti, visit_id) {
    const text = `
    UPDATE public."patientGenInfo"
    SET soc_hist_occ = $1, soc_hist_diet = $2, soc_hist_exc = $3, curr_housing = $4, yr3_housing = $5,
        caffeine_use = $6, alc_use = $7, packs_day = $8, tobac_yrs = $9, pack_yrs = $10, desire_to_quit = $11, marijuana_use = $12,
        fun_drugs = $13, sex_active = $14, last_year_part = $15, protection_use = $16, sti = $17
    WHERE patient_id = $18
    `
    const values = [occupation, diet, exercise, curr_hous, yr3_hous, caffeine, alc, packs_day, yrs, pack_yrs, quit, marijuana, fun_drugs,
    sex_act, partners, protection, sti, this.patient_id];
    
    await pool
    .query(text, values)
    .then(async (res) => {
        this.occupation = occupation;
        this.diet = diet;
        this.exercise = exercise;
        this.curr_hous = curr_hous;
        this.yr3_hous = yr3_hous;
        this.caffeine = caffeine;
        this.alc = alc
        this.packs_day = packs_day;
        this.yrs = yrs;
        this.pack_yrs = pack_yrs;
        this.marijuana = marijuana;
        this.quit = quit;
        this.fun_drugs = fun_drugs;
        this.sex_act = sex_act;
        this.partners = partners;
        this.protection = protection;
        this.sti = sti;
    })
    .catch((err) => console.log('Error executing query', err.stack))

    const text2 = `
    UPDATE public."visit"
    SET soc_hist_occ = $1, soc_hist_diet = $2, soc_hist_exc = $3, curr_housing = $4, yr3_housing = $5,
        caffeine_use = $6, alc_use = $7, packs_day = $8, tobac_yrs = $9, pack_yrs = $10, desire_to_quit = $11, marijuana_use = $12,
        fun_drugs = $13, sex_act = $14, last_year_part = $15, protection_use = $16, sti = $17, soc_added = 'true'
    WHERE visit_id = $18
    `
    const values2 = [occupation, diet, exercise, curr_hous, yr3_hous, caffeine, alc, packs_day, yrs, pack_yrs, quit, marijuana, fun_drugs,
    sex_act, partners, protection, sti, visit_id];

    await pool
    .query(text2, values2)
    .catch((err) => console.log('Error executing query', err.stack))
}

async addFamily(mother, father, siblings, children, sig_other, visit_id) {
  const text = `
  UPDATE public."patientGenInfo"
  SET fam_mother = $1, fam_father = $2, fam_siblings = $3, fam_children = $4, fam_sig_other = $5
  WHERE patient_id = $6
  `
  const values = [mother, father, siblings, children, sig_other, this.patient_id];
  
  await pool
  .query(text, values)
  .then(async (res) => {
      this.mother = mother;
      this.father = father;
      this.siblings = siblings;
      this.children = children;
      this.sig_other = sig_other;
  })
  .catch((err) => console.log('Error executing query', err.stack))

  const text2 = `
  UPDATE public."visit"
  SET fam_mother = $1, fam_father = $2, fam_siblings = $3, fam_children = $4, fam_sig_other = $5, fam_added = 'true'
  WHERE visit_id = $6
  `
  const values2 = [mother, father, siblings, children, sig_other, visit_id];

  await pool
  .query(text2, values2)
  .catch((err) => console.log('Error executing query', err.stack))
}
}

module.exports = PatientWithID;

