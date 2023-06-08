const pool = require('/Users/saim_bhimji/repo/emr2/database/db.js');

class Visit {
    constructor(visit_id, patient_id, event, date, physician) { 
        this.visit_id = visit_id;
        this.patient_id = patient_id;
        this.event = event;
        this.date = date;
        this.physician = physician;
        this.pulse = null;
        this.bp = null;
        this.temp = null;
        this.resp_rate = null;
        this.ht = null;
        this.wt = null;
        this.blood_sug = null;
        this.hrs_meal = null;
        this.ros_general = null;
        this.ros_cardio = null;
        this.ros_resp = null;
        this.ros_skin = null;
        this.ros_heent = null;
        this.ros_gi = null;
        this.ros_gu = null;
        this.ros_mus = null;
        this.ros_endo = null;
        this.phys_gen_norm = null;
        this.phys_gen_ab = null;
        this.phys_heart_norm = null;
        this.phys_heart_ab = null;
        this.phys_lungs_norm = null;
        this.phys_lungs_ab = null;
        this.phys_skin_norm = null;
        this.phys_skin_ab = null;
        this.phys_heent_norm = null;
        this.phys_heent_ab = null;
        this.phys_abdo_norm = null;
        this.phys_abdo_ab = null;
        this.phys_mus_norm = null;
        this.phys_mus_ab = null;
        this.phys_neuro_norm = null;
        this.phys_neuro_ab = null;
        this.phys_omm_norm = null;
        this.phys_omm_ab = null;
        this.phys_other_norm = null;
        this.phys_other_ab = null;
        this.hpi = null;
        this.phys_thoughts = null;
        this.phys_name = null;
        this.reff = null;
        this.patient_agreement = null;
        this.med_presc = null;
        this.health_iss = [];
        this.diffs = [];
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
        this.fam_added = null;
        this.soc_added = null;
    }
    
    

    async getVisitId() {
        const text = `
            SELECT * FROM public."visit"
            WHERE patient_id = $1
            AND event_name LIKE '%' || $2 || '%' 
            AND visit_date LIKE '%' || $3 || '%' 
            `;
        const values = [this.patient_id, this.event, this.date];
        await pool
            .query(text, values)
            .then((res) => {
                return res.rows[0].visit_id;
            })
            .catch((err) => console.log('Error executing query', err.stack))
    };

    async getById(id) {
        console.log(id);
        const text = `
        SELECT * FROM public."visit"
        WHERE visit_id = $1
        `;
        const values = [id];
        await pool
            .query(text, values)
            .then((res) => {
                this.visit_id = id;
                this.patient_id = res.rows[0].patient_id;
                this.event = res.rows[0].event_name;
                this.date = res.rows[0].visit_date;
                this.physician = res.rows[0].attending_physician;
                this.ros_general = res.rows[0].ros_general;
                this.ros_cardio = res.rows[0].ros_cardio;
                this.ros_resp = res.rows[0].ros_resp;
                this.ros_skin = res.rows[0].ros_skin;
                this.ros_heent = res.rows[0].ros_heent;
                this.ros_gi = res.rows[0].ros_gi;
                this.ros_gu = res.rows[0].ros_gu;
                this.ros_mus = res.rows[0].ros_mus;
                this.ros_endo = res.rows[0].ros_endo;
                this.phys_gen_norm = res.rows[0].phys_gen_norm;
                this.phys_gen_ab = res.rows[0].phys_gen_ab;
                this.phys_heart_norm = res.rows[0].phys_heart_norm;
                this.phys_heart_ab = res.rows[0].phys_heart_ab;
                this.phys_lungs_norm = res.rows[0].phys_lungs_norm;
                this.phys_lungs_ab = res.rows[0].phys_lungs_ab;
                this.phys_skin_norm = res.rows[0].phys_skin_norm;
                this.phys_skin_ab = res.rows[0].phys_skin_ab;
                this.phys_heent_norm = res.rows[0].phys_heent_norm;
                this.phys_heent_ab = res.rows[0].phys_heent_ab;
                this.phys_abdo_norm = res.rows[0].phys_abdo_norm;
                this.phys_abdo_ab = res.rows[0].phys_abdo_ab;
                this.phys_mus_norm = res.rows[0].phys_mus_norm;
                this.phys_mus_ab = res.rows[0].phys_mus_ab;
                this.phys_neuro_norm = res.rows[0].phys_neuro_norm;
                this.phys_neuro_ab = res.rows[0].phys_neuro_ab;
                this.phys_omm_norm = res.rows[0].phys_omm_norm;
                this.phys_omm_ab = res.rows[0].phys_omm_ab;
                this.phys_other_norm = res.rows[0].phys_other_norm;
                this.phys_other_ab = res.rows[0].phys_other_ab;
                this.hpi = res.rows[0].hpi;
                this.phys_thoughts = res.rows[0].phys_thoughts;
                this.phys_name = res.rows[0].phys_name;
                this.reff = res.rows[0].refferals;
                this.patient_agreement = res.rows[0].patient_agreement;
                this.med_presc = res.rows[0].med_presc;
                this.pulse = res.rows[0].pulse_bpm;
                this.bp = res.rows[0].blood_pressure;
                this.temp = res.rows[0].temperature;
                this.resp_rate = res.rows[0].resp_rate;
                this.ht = res.rows[0].height;
                this.wt = res.rows[0].weight;
                this.blood_sug = res.rows[0].blood_sugar;
                this.hrs_meal = res.rows[0].hours_last_meal;
                this.occupation = res.rows[0].soc_hist_occ;
                this.diet = res.rows[0].soc_hist_diet;
                this.exercise = res.rows[0].soc_hist_exc;
                this.curr_hous = res.rows[0].curr_housing;
                this.yr3_hous = res.rows[0].yr3_housing;
                this.caffeine = res.rows[0].caffeine_use;
                this.alc = res.rows[0].alc_use;
                this.packs_day = res.rows[0].packs_day;
                this.yrs = res.rows[0].tobac_yrs;
                this.pack_yrs = res.rows[0].pack_yrs;
                this.marijuana = res.rows[0].marijuana_use;
                this.quit = res.rows[0].desire_to_quit;
                this.sti = res.rows[0].sti;
                this.mother = res.rows[0].fam_mother;
                this.father = res.rows[0].fam_father;
                this.siblings = res.rows[0].fam_siblings;
                this.children = res.rows[0].fam_children;
                this.fun_drugs = res.rows[0].fun_drugs;
                this.sex_act = res.rows[0].sex_active;
                this.partners = res.rows[0].last_year_part;
                this.protection = res.rows[0].protection_use;
                this.fam_added = res.rows[0].fam_added;
                this.soc_added = res.rows[0].soc_added;
            })
            .catch((err) => {
                console.error('Error executing query', err.stack);
            });

        const text3 = `
        SELECT * FROM public."Assessments"
        WHERE visit_id = $1
        `;
        await pool
            .query(text3, values)
            .then((res) => {
                if (res.rowCount > 0) {
                    this.health_iss.push(res.rows[0].health_issue);
                    this.diffs.push(res.rows[0].Differential);
                }
            })
            .catch((err) => {
                console.error('Error executing query', err.stack);
            });
    }

    async addVitals(pulse, bp, temp, resp_rate, ht, wt, blood_sug, hrs_meal) {
        console.log(blood_sug);
        let text = ``;
        let values = [];
        if (blood_sug.localeCompare("") === 0 && hrs_meal.localeCompare("") === 0) {
            text = `
            UPDATE public."visit"
            SET pulse_bpm = $2, blood_pressure = $3, temperature = $4, resp_rate  = $5, height = $6, weight = $7
            WHERE visit_id = $1
            `
            values = [this.visit_id, pulse, bp, temp, resp_rate, ht, wt];
        } else {
            text = `
            UPDATE public."visit"
            SET pulse_bpm = $2, blood_pressure = $3, temperature = $4, resp_rate  = $5, height = $6, weight = $7, blood_sugar = $8, hours_last_meal = $9
            WHERE visit_id = $1
            `
            values = [this.visit_id, pulse, bp, temp, resp_rate, ht, wt, blood_sug, hrs_meal];
        }
        
        
        await pool
            .query(text, values)
            .then((res) => {
                this.pulse = pulse;
                this.bp = bp;
                this.temp = temp;
                this.resp_rate = resp_rate;
                this.ht = ht;
                this.wt = wt;
                this.blood_sug = blood_sug;
                this.hrs_meal = hrs_meal;
            })
        .catch((err) => console.error('Error executing query', err.stack));
    }   

    async addROS(ros_general, ros_cardio, ros_resp, ros_skin, ros_heent, ros_gi, ros_gu, ros_mus, ros_endo) {
        const text = `
        UPDATE public."visit"
        SET ros_general = $1, ros_cardio = $2, ros_resp = $3, ros_skin = $4, ros_heent = $5, ros_gi = $6, ros_gu = $7, ros_mus = $8, ros_endo = $9
        WHERE visit_id = $10
        `
        console.log(ros_general);
        const values = [ros_general, ros_cardio, ros_resp, ros_skin, ros_heent, ros_gi, ros_gu, ros_mus, ros_endo, this.visit_id];
        await pool
            .query(text, values)
            .then((res) => {
                this.ros_general = ros_general;
                this.ros_cardio = ros_cardio;
                this.ros_resp = ros_resp;
                this.ros_skin = ros_skin;
                this.ros_heent = ros_heent;
                this.ros_gi = ros_gi;
                this.ros_gu = ros_gu;
                this.ros_mus = ros_mus;
                this.ros_endo = ros_endo;
            })
        .catch((err) => console.error('Error executing query', err.stack));
    }   

    async addPhys(phys_gen_norm, phys_gen_ab,
        phys_heart_norm, phys_heart_ab, phys_lungs_norm, phys_lungs_ab, phys_skin_norm, phys_skin_ab, phys_heent_norm, phys_heent_ab,
        phys_abdo_norm, phys_abdo_ab, phys_mus_norm, phys_mus_ab, phys_neuro_norm, phys_neuro_ab, phys_omm_norm, phys_omm_ab, 
        phys_other_norm, phys_other_ab) {
        const text = `
        UPDATE public."visit"
        SET phys_gen_norm = $1, phys_gen_ab = $2, phys_heart_norm = $3, phys_heart_ab = $4, phys_lungs_norm = $5,
            phys_lungs_ab = $6, phys_skin_norm = $7, phys_skin_ab = $8, phys_heent_norm = $9, phys_heent_ab = $10,
            phys_abdo_norm = $11, phys_abdo_ab = $12, phys_mus_norm = $13, phys_mus_ab = $14, phys_neuro_norm = $15,
            phys_neuro_ab = $16, phys_omm_norm = $17, phys_omm_ab = $18, phys_other_norm = $19,
            phys_other_ab = $20
        WHERE visit_id = $21
        `
        const values = [phys_gen_norm, phys_gen_ab,
            phys_heart_norm, phys_heart_ab, phys_lungs_norm, phys_lungs_ab, phys_skin_norm, phys_skin_ab, phys_heent_norm, phys_heent_ab,
            phys_abdo_norm, phys_abdo_ab, phys_mus_norm, phys_mus_ab, phys_neuro_norm, phys_neuro_ab, phys_omm_norm, phys_omm_ab, 
            phys_other_norm, phys_other_ab, this.visit_id];
        await pool
            .query(text, values)
            .then((res) => {
                this.phys_gen_norm = phys_gen_norm;
                this.phys_gen_ab = phys_gen_ab;
                this.phys_heart_norm = phys_heart_norm;
                this.phys_heart_ab = phys_heart_ab;
                this.phys_lungs_norm = phys_lungs_norm;
                this.phys_lungs_ab = phys_lungs_ab;
                this.phys_skin_norm = phys_skin_norm;
                this.phys_skin_ab = phys_skin_ab;
                this.phys_heent_norm = phys_heent_norm;
                this.phys_heent_ab = phys_heent_ab;
                this.phys_abdo_norm = phys_abdo_norm;
                this.phys_abdo_ab = phys_abdo_ab;
                this.phys_mus_norm = phys_mus_norm;
                this.phys_mus_ab = phys_mus_ab;
                this.phys_neuro_norm = phys_neuro_norm;
                this.phys_neuro_ab = phys_neuro_ab;
                this.phys_omm_norm = phys_omm_norm;
                this.phys_omm_ab = phys_omm_ab;
                this.phys_other_norm = phys_other_norm;
                this.phys_other_ab = phys_other_ab;
            })
        .catch((err) => console.error('Error executing query', err.stack));
    }   

    async addHPI(hpi) {
        const text = `
        UPDATE public."visit"
        SET hpi = $1
        WHERE visit_id = $2
        `
        const values = [hpi, this.visit_id];
        await pool
            .query(text, values)
            .then((res) => {
                console.log('yo')
                this.hpi = hpi;
            })
        .catch((err) => console.error('Error executing query', err.stack));
    }   

    async addMDM(phys_thoughts, phys_name, reff, patient_agreement, med_presc) {
        const text = `
        UPDATE public."visit"
        SET phys_thoughts = $1, phys_name = $2, refferals = $3, patient_agreement = $4, med_presc = $5
        WHERE visit_id = $6
        `
        const values = [phys_thoughts, phys_name, reff, patient_agreement, med_presc, this.visit_id];
        await pool
            .query(text, values)
            .then((res) => {
                this.phys_thoughts = phys_thoughts;
                this.phys_name = phys_name;
                this.reff = reff;
                this.patient_agreement = patient_agreement;
                this.med_presc = med_presc;
            })
        .catch((err) => console.error('Error executing query', err.stack));
    }  

    async addAssessment(health_issue, diff) {
        const text = `
        INSERT INTO public."Assessments"
        VALUES ($1, $2, $3)
        `
        const values = [diff, this.visit_id, health_issue];
        await pool
            .query(text, values)
            .then((res) => {
                this.health_iss.push(health_issue)
                this.diffs.push(diff);
            })
        .catch((err) => console.error('Error executing query', err.stack));
    }  

    async initializeData() {
        await (this.visit_id = this.getVisitId());
    }

}

module.exports = Visit;