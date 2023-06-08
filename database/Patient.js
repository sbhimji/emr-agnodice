const pool = require('/Users/saim_bhimji/repo/emr2/database/db.js');
const Visit = require('../database/Visit');

class Patient {
    constructor(fName, lName, sex, birthday, age, insurance, pcp) {
        this.fName = fName;
        this.lName = lName;
        this.sex = sex;
        this.birthday = birthday;
        this.age = age;
        this.insurance = insurance;
        this.pcp = pcp;
        this.visits = [];
        this.patient_id = null;
        this.occupation = null;
        this.diet = null;
        this.exercise = null;
        this.curr_hous = null;
        this.yr3_hous = null;
        this.caffeine = null;
        this.alc = null
        this.packs_day = null;
        this.yrs = null;
        this.pack_yrs = null;
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
    async addPatient() {
        const text = `
        INSERT INTO public."patientGenInfo"(
        fname, lname, sex, birthday, age, insurance, pcp)
        VALUES ($1, $2, $3, $4, $5, $6, $7);
        `
        const values = [this.fName, this.lName, this.sex, this.birthday, this.age, this.insurance, this.pcp];
        await pool
        .query(text, values)
        .then((res) => {console.log("Patient added")})
        .catch((err) => console.error('Error executing query action: add-patient', err.stack))
    }
    async getPatientId() {
        const text = `
            SELECT * FROM public."patientGenInfo"
            WHERE fname LIKE '%' || $1  || '%'
            AND lname LIKE '%' || $2 || '%' 
            AND sex LIKE '%' || $3 || '%' 
            AND birthday LIKE '%' || $4 || '%' 
            `;
        const values = [this.fName, this.lName, this.sex, this.birthday];
        await pool
            .query(text, values)
            .then((res) => {
                //return res.rows[0].patient_id;
                this.patient_id = res.rows[0].patient_id;
            })
            .catch((err) => console.log('Error executing query', err.stack))
    };
    
    async initializeData() {
        await this.addPatient();
        await (this.getPatientId());
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
            .then((res) => {
                console.log("Visit added");
                console.log
                //visit.initializeData();
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
            .catch((err) => console.log('Error executing query', err.stack))
    };

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

module.exports = Patient;


    


    




