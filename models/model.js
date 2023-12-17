const db = require("../db/connection.js");
const bcrypt = require('bcrypt');


exports.fetchUsers = () => {
    return db.query("SELECT username FROM users;").then((result) => {
        return result.rows;
    })
}

exports.insertUser = ({username, password}) => {
    return bcrypt.hash(password, 10).then((hashedPassword) => {
        return db.query("INSERT INTO users (username, password) VALUES ($1, $2) RETURNING *;",[username, hashedPassword]).then((result) => {
            return result.rows[0];
        })
    })
}

exports.selectUser = ({username, password}) => {
    return db.query("SELECT * FROM users WHERE username = $1", [username]).then((result) => {
        if (result.rows.length > 0){
            const user = result.rows[0];
            return bcrypt.compare(password, user.password).then((isPasswordValid) => {
                if (isPasswordValid) {
                    return user;
                }
                else{
                    return Promise.reject({code: "Invalid password" });
                }
            })
        }
        else{
            return Promise.reject({code: 'User doesnt exist'})
        }
    })
}