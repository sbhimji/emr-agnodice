const pool = require('../../database/db');

//user roles: admin, clinician
class User {
    constructor(username) {
        this.username = username;
        this.fname = null;
        this.lname = null;
        this.email = null;
        this.role = null;
    }

    async getByUsername() {
        const text = `
          SELECT * FROM public."Users"
          WHERE username = $1
        `;
        const values = [this.username];
        await pool
          .query(text, values)
          .then((res) => {
            this.fname = res.rows[0].first_name;
            this.lname = res.rows[0].last_name;
            this.email = res.rows[0].email;
            this.role = res.rows[0].role;
          })
          .catch((err) => console.error('Error executing query', err.stack));
    }
}

module.exports = User;