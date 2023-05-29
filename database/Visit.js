const pool = require('/Users/saim_bhimji/repo/emr2/database/db.js');

class Visit {
    constructor(visit_id, patient_id, event, date, physician) {
        this.visit_id = visit_id;
        this.patient_id = patient_id;
        this.event = event;
        this.date = date;
        this.physician = physician;
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

    // async getById() {
        // const text = `
        //   SELECT * FROM public."visit"
        //   WHERE visit_id = $1
        // `;
        // const values = [this.visit_id];
        // await pool
        //   .query(text, values)
        //   .then((res) => {
        //     this.patient_id = res.rows[0].patient_id;
        //     this.event = res.rows[0].event;
        //     this.date = res.rows[0].date;
        //     this.physician = res.rows[0].physician;
        //   })
        //   .catch((err) => console.error('Error executing query', err.stack));
    // }
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
            })
        .catch((err) => console.error('Error executing query', err.stack));
    }

    // async initializeDataById() {
    //     await this.getById();
    // }

    async initializeData() {
        await (this.visit_id = this.getVisitId());
    }

}

module.exports = Visit;