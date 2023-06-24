const LocalStrategy = require("passport-local");
const pool = require('../database/db');
const bcrypt = require('bcrypt')
const User = require('../libs/classes/User.js')
module.exports = (passport) => {
    passport.use(
      "local-login",
      new LocalStrategy(
        {
          usernameField: "username",
          passwordField: "password",
        },
        async (username, password, done) => {
            const text = `
            SELECT * FROM public."Users"
            WHERE username = $1
            `;
            const values = [username];
            await pool            
                .query(text, values)
                .then(async (res) => {
                    if (res.rowCount === 0) {
                        return done(null, false);
                    } else {
                        const match = await bcrypt.compare(password, res.rows[0].password);
                        if (match) {
                            const user = new User(username);
                            await user.getByUsername();
                            return done(null, user);
                            //response.redirect('/home');
                        } else {
                            return done(null, false);
                        }   
                    }
                })
        }
    )
    );
    passport.serializeUser(function(user, done) {
        done(null, user);
    });
    passport.deserializeUser(function(user, done) {
        done(null, user);
    });
  };