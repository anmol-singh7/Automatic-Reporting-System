const express = require('express');
const router = express.Router();
const mysql = require('mysql2/promise');
const { getConnection } = require('../db/connection');

router.post('/addCredential', async (req, res) => {
    try {
        const { clientid,clientname, hostofdatabase, userofdatabase, passwordofdatabase, databasename, waitForConnections, connectionLimit, queueLimit } = req.body;

        const connection = await getConnection();

        
        const query = "INSERT INTO CredentialMaster (clientid,clientname, hostofdatabase, userofdatabase, passwordofdatabase, databasename, waitForConnections, connectionLimit, queueLimit) VALUES (?, ?, ?, ?, ?, ?, ?, ?,?)";
        const [result] = await connection.query(query, [clientid,clientname, hostofdatabase, userofdatabase, passwordofdatabase, databasename, waitForConnections, connectionLimit, queueLimit]);
        connection.release();
        res.json({ message: "Credential added successfully!" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});



router.get('/clients', async (req, res) => {
    try {
        const connection = await getConnection();
        const [rows] = await connection.query(`
            SELECT 
                clientid, 
                clientname, 
                COUNT(*) AS databaseNum 
            FROM 
                CredentialMaster 
            GROUP BY 
                clientid
        `);
        connection.release();
        const clients = rows.map(row => ({
            clientid: row.clientid,
            clientname: row.clientname,
            databaseNum: row.databaseNum
        }));
        res.json(clients);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});


router.get('/client/databases', async (req, res) => {
    try {
        const connection = await getConnection();
        const [rows] = await connection.query(`SELECT clientid, databasename FROM CredentialMaster`);
        connection.release();
        const clients = rows.map(row => ({
            clientid: row.clientid,
            databasename: row.databasename
        }));
        res.json(clients);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});



router.post('/addsystems', async (req, res) => {
    const { systemid, systemname, logoid,logopath } = req.body;

    try {
        const connection = await getConnection();
        if (!systemid || !systemname || !logoid) {
            return res.status(400).json({ message: 'Invalid request' });
        }
        const result1 = await connection.query(
            'INSERT INTO SystemMaster (systemid, systemname, logoid) VALUES (?, ?, ?)',
            [systemid, systemname, logoid]
        );
        connection.release();

        const result = await connection.query(
            'INSERT INTO SystemLogos (logoid,logopath) VALUES (?, ?)',
            [logoid,logopath]
        );
        connection.release();
        res.json({ message: 'System added successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});

router.get('/systems', async (req, res) => {
    try {
        const connection = await getConnection();
        const [rows] = await connection.query('SELECT * FROM SystemMaster');
        connection.release();
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});

router.post('/addmanufacturer', async (req, res) => {
    const { manufacturerid, manufacturername, logoid ,logopath} = req.body;

    try {
        const connection = await getConnection();
        if (!manufacturerid || !manufacturername || !logoid ) {
            return res.status(400).json({ message: 'Invalid request' });
        }
        const result1 = await connection.query(
            'INSERT INTO ManufacturerMaster (manufacturerid, manufacturername, logoid) VALUES (?, ?, ?)',
            [manufacturerid, manufacturername, logoid]
        );
        connection.release();
         const result = await connection.query(
            'INSERT INTO ManufacturerLogos (logoid,logopath) VALUES (?, ?)',
            [logoid, logopath]
        );
        connection.release();
        res.json({ message: 'System added successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});

router.get('/manufacturers', async (req, res) => {
    try {
        const connection = await getConnection();
        const [rows] = await connection.query('SELECT * FROM ManufacturerMaster');
        connection.release();
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});

router.post('/addusers', async (req, res) => {
    const { userid, username, employid, department, usertype, phonenumber, email, password, userstatus } = req.body;

    try {
        const connection = await getConnection();
        if (!userid || !username || !employid || !department || !usertype || !phonenumber || !email || !password || !userstatus) {
            return res.status(400).json({ message: 'Invalid request' });
        }
        const result = await connection.query(
            'INSERT INTO UserMaster (userid, username, employid, department,usertype,phonenumber, email, passwor,userstatus ) VALUES (?, ?, ?, ?, ?, ?, ?, ?,?)',
            [userid, username, employid, department, usertype, phonenumber, email, password, userstatus]
        );
        connection.release();
        res.json({ message: 'User added successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});

router.get('/users', async (req, res) => {
    try {
        const connection = await getConnection();
        const [rows] = await connection.query('SELECT * FROM UserMaster');
        connection.release();
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});

router.post('/addRole', async (req, res) => {
    const { roleid, rolename } = req.body;

    try {
        const connection = await getConnection();
        const [existingRole] = await connection.query(
            'SELECT * FROM RoleMaster WHERE roleid = ? OR rolename = ?',
            [roleid, rolename]
        );

        if (existingRole.length > 0) {
            return res.status(409).json({ message: 'Role already exists' });
        }

        const result = await connection.query(
            'INSERT INTO RoleMaster (roleid, rolename) VALUES (?, ?)',
            [roleid, rolename]
        );

        connection.release();
        res.json({ message: 'Role added successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});

router.get('/roles', async (req, res) => {
    try {
        const connection = await getConnection();
        const [rows] = await connection.query('SELECT * FROM RoleMaster');
        connection.release();
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});


router.post('/description', async (req, res) => {
    const {
        userid,
        clientid,
        reporttype,
        systems,
        manufacturer,
        datebegin,
        timebegin,
        dateend,
        timeend,
        status,
        timetype,
    } = req.body;

    try {
        const connection = await getConnection();
        if (
            !userid ||
            !clientid ||
            !reporttype ||
            !systems ||
            !manufacturer ||
            !datebegin ||
            !timebegin ||
            !dateend ||
            !timeend ||
            !status ||
            !timetype
        ) {
            res.setHeader('Access-Control-Allow-Origin', '*');
            return res.status(400).json({ message: 'Invalid request' });
        }
        // Generate the codegeneratedVianumberrep
        const [countResult] = await connection.query(
            'SELECT COUNT(*) AS count FROM descriptiontable WHERE datebegin = ?',
            [datebegin]
        );
        const count = countResult[0].count + 1;
        const codegeneratedVianumberrep = count.toString().padStart(6, '0');
        // Generate the report ID
        const newdate = datebegin.slice(0, -16);
        const reportid = `${newdate}${codegeneratedVianumberrep}V_1`;

        // Generate the codegeneratedVianumberrep
        // const [countResult] = await connection.query(
        //     'SELECT COUNT(*) AS count FROM descriptiontable WHERE datebegin = ?',
        //     [datebegin]
        // );
        // const count = countResult[0].count + 1;
        // const codegeneratedVianumberrep = count.toString().padStart(6, '0');
        // Get current date
        // const date = new Date();
        // // Extract year, month, and day from the date
        // const year = date.getFullYear().toString().substr(-2);
        // const month = ('0' + (date.getMonth() + 1)).slice(-2);
        // const day = ('0' + date.getDate()).slice(-2);
        // // Generate a 4-digit random number
        // const randomNumber = Math.floor(1000 + Math.random() * 9000);
        // // Concatenate date and random number to form the ID
        // const id = year + month + day + randomNumber.toString();

        // const idstring=id.toString();

        // const reportid=idstring+"V_1";
        // Generate the report ID
        // const reportid = id;

        const result = await connection.query(
            'INSERT INTO descriptiontable (userid, clientid, reporttype, systems, manufacturer, datebegin, timebegin, dateend, timeend, status, timetype, reportid) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [
                userid,
                clientid,
                reporttype,
                systems,
                manufacturer,
                datebegin,
                timebegin,
                dateend,
                timeend,
                status,
                timetype,
                reportid,
            ]
        );
        connection.release();
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.json({ message: 'New row added successfully', reportid });
    } catch (error) {
        console.error(error);
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.status(500).json({ message: 'Server Error' });
    }
});

module.exports = router;