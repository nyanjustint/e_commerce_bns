const mysql = require('mysql2');

// Connecting to workbench database (connection pool allows for connection reuse)
const db = mysql.createPool({
    host: 'csc648team07db.cflhctcduybl.us-west-1.rds.amazonaws.com',
    port: '3306',
    user: 'mysqldb',
    database: 'csc64807db',
    password: 'Ca65Xv2yME2whbmeUhUW',
    waitForConnections: true,
    connectionLimit: 50,
    queueLimit: 0
});

module.exports = db.promise();