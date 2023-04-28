const sql = require('mssql');

const config = {
    user: process.env.USER_NAME,
    password: process.env.PASSWORD,
    server: process.env.HOST,
    database: process.env.DATABASE_NAME,
    options: {
        encrypt: true, // set to true if you're using Azure
        trustServerCertificate: true // set to true if you're using self-signed certs
    },
    pool: {
        max: 10,
        min: 0,
        idleTimeoutMillis: 30000
    }
};

const pool = new sql.ConnectionPool(config);

const getConnection = async () => {
    try {
        await pool.connect();
        console.log('Connected to the database!');
        return pool;
    } catch (error) {
        console.error('Unable to connect to the database:', error);
        return null;
    }
};

module.exports = { getConnection };
