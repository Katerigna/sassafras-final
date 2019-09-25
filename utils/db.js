const spicedPg = require("spiced-pg");

let db;
if (process.env.DATABASE_URL) {
    db = spicedPg(process.env.DATABASE_URL);
} else {
    const { dbuser, dbpass } = require("../secrets.json");
    db = spicedPg(`postgres:${dbuser}:${dbpass}@localhost:5432/final_project`);
}

exports.addUser = function(first, last, email, password) {
    return db.query(
        `INSERT INTO users (first, last, email, password) VALUES ($1, $2, $3, $4)
            RETURNING id, first, last`,
        [first, last, email, password]
    );
};

exports.getPassword = function(email) {
    return db
        .query(
            `SELECT users.password AS password, users.id AS id
            FROM users
            WHERE email=$1`,
            [email]
        )
        .then(({ rows }) => {
            return rows;
        });
};

exports.addEmail = function(user_id, owners_email) {
    return db
        .query(
            `INSERT INTO cards (user_id, owners_email) VALUES ($1, $2) RETURNING id, owners_email`,
            [user_id, owners_email]
        )
        .then(({ rows }) => {
            return rows;
        });
};
