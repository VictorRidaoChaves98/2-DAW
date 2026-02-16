const mysql = require("mysql2");

const pool = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "guerragalaxias",       // tu contraseña
    database: "chatapp",
    charset: "utf8mb4_unicode_ci",
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

module.exports = pool.promise();
