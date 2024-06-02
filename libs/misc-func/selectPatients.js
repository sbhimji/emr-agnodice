const pool = require('../../database/db.js');


module.exports = function() {
    return new Promise((resolve, reject) => {
    const text = `
    SELECT * FROM public."patientGenInfo"
    LIMIT 100
    `
    pool
        .query(text)
        .then((res) => resolve(res.rows))
        .catch((err) => console.error('Error executing query', err.stack))
    })
}

