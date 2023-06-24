const pool = require('../../database/db.js');


module.exports = function(username, action, patient_id, visit_id, change_made) {
    const text = `
    INSERT INTO public."audit"
    VALUES($1, $2, $3, $4, $5)
    `
    const values = [username, action, patient_id, visit_id, change_made]
    pool
        .query(text, values)
        .then((res) => console.log(change_made))
        .catch((err) => console.error('Error executing query', err.stack))
}