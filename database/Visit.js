const pool = require('/Users/saim_bhimji/repo/emr2/database/db.js');

class Visit {
    constructor(visit_id, patient_id, event, date, physician, pulse, bp, temp, resp_rate, ht, wt, blood_sug, hrs_meal,
        ros_general, ros_cardio, ros_resp, ros_skin, ros_heent, ros_gi, ros_gu, ros_mus, ros_endo, phys_gen_norm, phys_gen_ab,
        phys_heart_norm, phys_heart_ab, phys_lungs_norm, phys_lungs_ab, phys_skin_norm, phys_skin_ab, phys_heent_norm, phys_heent_ab,
        phys_abdo_norm, phys_abdo_ab, phys_mus_norm, phys_mus_ab, phys_neuro_norm, phys_neuro_ab, phys_omm_norm, phys_omm_ab, 
        phys_other_norm, phys_other_ab, hpi, phys_thoughts, phys_name, reff, patient_agreement, med_presc, health_iss = [], diffs = []) {
        this.visit_id = visit_id;
        this.patient_id = patient_id;
        this.event = event;
        this.date = date;
        this.physician = physician;
        this.pulse = pulse;
        this.bp = bp;
        this.temp = temp;
        this.resp_rate = resp_rate;
        this.ht = ht;
        this.wt = wt;
        this.blood_sug = blood_sug;
        this.hrs_meal = hrs_meal;
        this.ros_general = ros_general;
        this.ros_cardio = ros_cardio;
        this.ros_resp = ros_resp;
        this.ros_skin = ros_skin;
        this.ros_heent = ros_heent;
        this.ros_gi = ros_gi;
        this.ros_gu = ros_gu;
        this.ros_mus = ros_mus;
        this.ros_endo = ros_endo;
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
        this.hpi = hpi;
        this.phys_thoughts = phys_thoughts;
        this.phys_name = phys_name;
        this.reff = reff;
        this.patient_agreement = patient_agreement;
        this.med_presc = med_presc;
        this.health_iss = health_iss;
        this.diffs = diffs;
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
                this.phys_thoughts = res.rows[0].phys_thought;
                this.phys_name = res.rows[0].phys_name;
                this.reff = res.rows[0].refferals;
                this.patient_agreement = res.rows[0].patient_agreement;
                this.med_presc = res.rows[0].med_presc;
            })
        .catch((err) => console.error('Error executing query', err.stack));

        const text2 = `
        SELECT * FROM public."vitals"
        WHERE visit_id = $1
        `;
        await pool
            .query(text2, values)
            .then((res) => {
                if (res.rowCount > 0) {
                    this.pulse = res.rows[0].pulse_bpm;
                    this.bp = res.rows[0].blood_pressure;
                    this.temp = res.rows[0].temperature;
                    this.resp_rate = res.rows[0].resp_rate;
                    this.ht = res.rows[0].height;
                    this.wt = res.rows[0].weight;
                    this.blood_sug = res.rows[0].blood_sugar;
                    this.hrs_meal = res.rows[0].hours_last_meal;
                }
            })
            .catch((err) => console.error('Error executing query'));
        //.catch((err) => console.error('Error executing query', err.stack));

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
            .catch((err) => console.error('Error executing query'));
    }

    async addVitals(pulse, bp, temp, resp_rate, ht, wt, blood_sug, hrs_meal) {
        const text = `
        INSERT INTO public."vitals"(
        patient_id, visit_id, pulse_bpm, blood_pressure, temperature, resp_rate, height, weight, blood_sugar, hours_last_meal)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10);
        `
        const values = [this.patient_id, this.visit_id, pulse, bp, temp, resp_rate, ht, wt, blood_sug, hrs_meal];
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