const express = require('express');
const router = express.Router();
const sql = require('mssql');
const { body, validationResult } = require('express-validator');
const { getConnection } = require('../db/connection');

router.post('/addCredential', async (req, res) => {
    try {
        const { clientid, clientname, hostofdatabase, userofdatabase, passwordofdatabase, databasename, waitForConnections, connectionLimit, queueLimit } = req.body;

        const connection = await getConnection();

        const query = "INSERT INTO CredentialMaster (clientid,clientname, hostofdatabase, userofdatabase, passwordofdatabase, databasename, waitForConnections, connectionLimit, queueLimit) VALUES (@clientid, @clientname, @hostofdatabase, @userofdatabase, @passwordofdatabase, @databasename, @waitForConnections, @connectionLimit, @queueLimit)";
        const request = new sql.Request(connection);
        request.input('clientid', sql.Int, clientid);
        request.input('clientname', sql.VarChar(50), clientname);
        request.input('hostofdatabase', sql.VarChar(50), hostofdatabase);
        request.input('userofdatabase', sql.VarChar(50), userofdatabase);
        request.input('passwordofdatabase', sql.VarChar(50), passwordofdatabase);
        request.input('databasename', sql.VarChar(50), databasename);
        request.input('waitForConnections', sql.Int, waitForConnections);
        request.input('connectionLimit', sql.Int, connectionLimit);
        request.input('queueLimit', sql.Int, queueLimit);

        const result = await request.query(query);
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
        const query = 'SELECT clientid, clientname, COUNT(*) AS databaseNum FROM CredentialMaster GROUP BY clientid';
        const result = await connection.query(query);

        connection.release();

        const clients = result.recordset.map(row => ({
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
        const query = 'SELECT clientid, databasename FROM CredentialMaster';
        const result = await connection.query(query);

        connection.release();

        const clients = result.recordset.map(row => ({
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
    const { systemid, systemname, logoid, logopath } = req.body;

    if (!systemid || !systemname || !logoid) {
        return res.status(400).json({ message: 'Invalid request' });
    }

    try {
        const connection = await getConnection();
        const query1 = 'INSERT INTO SystemMaster (systemid, systemname, logoid) VALUES (@systemid, @systemname, @logoid)';
        const request1 = connection.request();
        request1.input('systemid', sql.VarChar(50), systemid);
        request1.input('systemname', sql.VarChar(50), systemname);
        request1.input('logoid', sql.Int, logoid);
        await request1.query(query1);

        const query2 = 'INSERT INTO SystemLogos (logoid,logopath) VALUES (@logoid, @logopath)';
        const request2 = connection.request();
        request2.input('logoid', sql.Int, logoid);
        request2.input('logopath', sql.VarChar(255), logopath);
        await request2.query(query2);

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
        const query = 'SELECT * FROM SystemMaster WHERE status=@status';
        const request = connection.request();
        request.input('status', sql.VarChar(50), 'active');
        const result = await request.query(query);

        connection.release();

        res.json(result.recordset);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});

router.post('/addmanufacturer', async (req, res) => {
    const { manufacturerid, manufacturername, logoid, logopath } = req.body;

    try {
        const connection = await getConnection();
        if (!manufacturerid || !manufacturername || !logoid) {
            return res.status(400).json({ message: 'Invalid request' });
        }
        const request1 = new sql.Request(connection);
        const result1 = await request1.query(
            'INSERT INTO ManufacturerMaster (manufacturerid, manufacturername, logoid) VALUES (@manufacturerid, @manufacturername, @logoid)',
            sql.NVARCHAR(50), manufacturerid,
            sql.NVARCHAR(50), manufacturername,
            sql.INT, logoid
        );
        const request2 = new sql.Request(connection);
        const result2 = await request2.query(
            'INSERT INTO ManufacturerLogos (logoid,logopath) VALUES (@logoid, @logopath)',
            sql.INT, logoid,
            sql.NVARCHAR(200), logopath
        );
        connection.release();
        res.json({ message: 'Manufacturer added successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});

router.get('/manufacturers', async (req, res) => {
    try {
        const connection = await getConnection();
        const request = new sql.Request(connection);
        const result = await request.query('SELECT * FROM ManufacturerMaster WHERE status = @status', sql.NVARCHAR(50), 'active');
        connection.release();
        res.json(result.recordset);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});


// Define validation rule

// Apply validation rules to POST /addusers API
router.post('/addusers', [
    body('username').trim().escape(),
    body('employid').toInt(),
    body('department').trim().escape(),
    body('usertype').trim().escape(),
    body('phonenumber').trim().escape(),
    body('email').trim().isEmail().normalizeEmail(),
    body('password').trim().escape(),
    body('userstatus').trim().escape()
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { username, employid, department, usertype, phonenumber, email, password, userstatus } = req.body;

    try {
        const connection = await getConnection();
        const result = await connection.query(
            'INSERT INTO UserMaster (username, employid, department, usertype, phonenumber, email, password, userstatus) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [username, employid, department, usertype, phonenumber, email, password, userstatus]
        );
        connection.release();
        res.json({ message: 'User added successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});


router.post('/addRole', [
    body('roleid').trim().escape(),
    body('rolename').trim().escape()
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

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
    try {
        // const { manufacturer, datebegin, timebegin, dateend, timeend, timetype, databasename, table1, formtype, status1, prechandler, nexthandler, count, reportname } = req.body;
        const {
            userid, reportid, utilityid, version, clientid, systems, manufacturer, datebegin, timebegin, dateend, timeend, timetype, databasename, table1, formtype, status1, prechandler, nexthandler, count, reportname
        } = req.body;


        if (
            !userid ||
            !version ||
            !clientid ||
            !systems ||
            !manufacturer ||
            !datebegin ||
            !timebegin ||
            !dateend ||
            !timeend ||
            !timetype ||
            !databasename ||
            !table1 ||
            !formtype ||
            !status1 ||
            !prechandler ||
            !nexthandler ||
            !count ||
            !reportname
        ) {
            return res.status(400).json({ message: 'Invalid request' });
        }

        const connection = await getConnection();

        //   const query = "INSERT INTO CredentialMaster (clientid,clientname, hostofdatabase, userofdatabase, passwordofdatabase, databasename, waitForConnections, connectionLimit, queueLimit) VALUES (@clientid, @clientname, @hostofdatabase, @userofdatabase, @passwordofdatabase, @databasename, @waitForConnections, @connectionLimit, @queueLimit)";
        const request = new sql.Request(connection);

        // Generate the codegeneratedVianumberrep
        const { recordset: countResult } = await request.input('datebegin', sql.VarChar(50), datebegin).query(
            'SELECT COUNT(*) AS count FROM DescriptionMaster WHERE datebegin = @datebegin'
        );
        const { recordset: couttt } = await request.query('SELECT COUNT(*) AS count FROM DescriptionMaster');
        const inc = couttt[0].count;
        var tempreportid = reportid;
        if (reportid === null) {
            const cou = countResult[0].count + 1;
            const codegeneratedVianumberrep = cou.toString().padStart(6, '0');
            // Generate the report ID
            const newdate = datebegin.slice(0, -16);
            tempreportid = `${newdate}${clientid}${codegeneratedVianumberrep}I_${inc}`;
        }
        var tempreportid2 = utilityid;
        if (utilityid === null) {
            const cou2 = countResult[0].count + 1;
            const codegeneratedVianumberrep2 = cou2.toString().padStart(6, '0');
            // Generate the report ID
            const newdate = datebegin.slice(0, -16);
            tempreportid2 = `${newdate}${clientid}${codegeneratedVianumberrep2}D_${databasename}T_${table1}F_${formtype}V_${version}_prev${prechandler}_C${count}_S${status1}`;
        }

        // Sanitize user inputs to prevent SQL injection attacks
        const useridSanitized = sanitize(userid);
        const versionSanitized = sanitize(version);
        const clientidSanitized = sanitize(clientid);
        const systemsSanitized = sanitize(systems);
        const manufacturerSanitized = sanitize(manufacturer);
        const datebeginSanitized = sanitize(datebegin);
        const timebeginSanitized = sanitize(timebegin);
        const dateendSanitized = sanitize(dateend);
        const timeendSanitized = sanitize(timeend);
        const timetypeSanitized = sanitize(timetype);
        const databasenameSanitized = sanitize(databasename);
        const table1Sanitized = sanitize(table1);
        const formtypeSanitized = sanitize(formtype);
        const status1Sanitized = sanitize(status1);
        const prechandlerSanitized = sanitize(prechandler);
        const nexthandlerSanitized = sanitize(nexthandler);
        const countSanitized = sanitize(count);
        const reportnameSanitized = sanitize(reportname);

        // const connection = await getConnection();

        const query = "INSERT INTO DescriptionMaster (userid, reportid, utilityid, version, clientid, systems,manufacturer, datebegin, timebegin, dateend, timeend, timetype, databasename, table1, formtype, status1, prechandler, nexthandler, count, reportname) VALUES (@userid, @reportid, @utilityid, @version, @clientid, @systems,@manufacturer, @datebegin, @timebegin, @dateend, @timeend, @timetype, @databasename, @table1, @formtype, @status1, @prechandler, @nexthandler, @count, @reportname)";
        // const request = new sql.Request(connection);
        request.input('userid', sql.Int, useridSanitized);
        request.input('reportid', sql.VarChar(50), tempreportid);
        request.input('utilityid', sql.VarChar(50), tempreportid2);
        request.input('version', sql.VarChar, versionSanitized);
        request.input('clientid', sql.VarChar, clientidSanitized);
        request.input('systems', sql.VarChar, systemsSanitized);
        request.input('manufacturer', sql.VarChar(50), manufacturerSanitized);
        request.input('datebegin', sql.VarChar(50), datebeginSanitized);
        request.input('timebegin', sql.VarChar(50), timebeginSanitized);
        request.input('dateend', sql.VarChar(50), dateendSanitized);
        request.input('timeend', sql.VarChar(50), timeendSanitized);
        request.input('timetype', sql.VarChar(50), timetypeSanitized);
        request.input('databasename', sql.VarChar(50), databasenameSanitized);
        request.input('table1', sql.VarChar(50), table1Sanitized);
        request.input('formtype', sql.VarChar(50), formtypeSanitized);
        request.input('status1', sql.VarChar(50), status1Sanitized);
        request.input('prechandler', sql.VarChar(50), prechandlerSanitized);
        request.input('nexthandler', sql.VarChar(50), nexthandlerSanitized);
        request.input('count', sql.VarChar(50), countSanitized);
        request.input('reportname', sql.VarChar(50), reportnameSanitized);

        const result = await request.query(query);
        connection.release();
        res.json({ message: "New row added successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});
