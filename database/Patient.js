const pool = require('/Users/saim_bhimji/repo/emr2/database/db.js');
const Visit = require('../database/Visit');

class Patient {
    constructor(fName, lName, sex, birth_year, birth_month, birth_day, age, insurance, pcp) {
        this.fName = fName;
        this.lName = lName;
        this.sex = sex;
        this.birth_year = birth_year;
        this.birth_month = birth_month;
        this.birth_day = birth_day;
        this.age = age;
        this.insurance = insurance;
        this.pcp = pcp;
        this.visits = [];
        this.patient_id = null;
    }
    async addPatient() {
        const text = `
        INSERT INTO public."patientGenInfo"(
        fname, lname, sex, birth_year, birth_month, birth_day, age, insurance, pcp)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9);
        `
        const values = [this.fName, this.lName, this.sex, this.birth_year, this.birth_month, this.birth_day, this.age, this.insurance, this.pcp];
        await pool
        .query(text, values)
        .then((res) => {console.log("Patient added")})
        .catch((err) => console.error('Error executing query', err.stack))
    }
    async getPatientId() {
        const text = `
            SELECT * FROM public."patientGenInfo"
            WHERE fname LIKE '%' || $1  || '%'
            AND lname LIKE '%' || $2 || '%' 
            AND sex LIKE '%' || $3 || '%' 
            AND CAST(birth_year AS VARCHAR(4)) LIKE '%' || $4 || '%' 
            AND birth_month LIKE '%' || $5 || '%' 
            AND CAST(birth_day AS VARCHAR(4)) LIKE '%' || $6 || '%'
            `;
        const values = [this.fName, this.lName, this.sex, this.birth_year, this.birth_month, this.birth_day];
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

    async addVisit(event, date, physician) {
        const visit = new Visit(null, this.patient_id, event, date, physician);
        

        const text = `
            INSERT INTO public."visit" (
                patient_id, event_name, visit_date, attending_physician
            )
            VALUES ($1, $2, $3, $4);
        `;

        const values = await [this.patient_id, event, date, physician];

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
    };
}

module.exports = Patient;


    


    




