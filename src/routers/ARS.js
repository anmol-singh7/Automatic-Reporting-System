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
        reportid,
        utilityid,
        version,
        clientid,
        systems,
        manufacturer,
        datebegin,
        timebegin,
        dateend,
        timeend,
        timetype,
        databasename ,
        table1,
        formtype,
        status1,
        prechandler,
        nexthandler,
        count
    } = req.body;

    try {
        const connection = await getConnection();
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
            !count
        ) {
            res.setHeader('Access-Control-Allow-Origin', '*');
            return res.status(400).json({ message: 'Invalid request' });
        }
        // Generate the codegeneratedVianumberrep
        const [countResult] = await connection.query(
            'SELECT COUNT(*) AS count FROM DescriptionMaster WHERE datebegin = ?',
            [datebegin]
        );
        var tempreportid=reportid;
        if(reportid===null){
        const cou = countResult[0].count + 1;
        const codegeneratedVianumberrep = cou.toString().padStart(6, '0');
        // Generate the report ID
        const newdate = datebegin.slice(0, -16);
           tempreportid = `${newdate}${clientid}${codegeneratedVianumberrep}`;
        }
        var tempreportid2=utilityid;
        if (utilityid === null) {
            const cou2 = countResult[0].count + 1;
            const codegeneratedVianumberrep2 = cou2.toString().padStart(6, '0');
            // Generate the report ID
            const newdate = datebegin.slice(0, -16);
            tempreportid2 = `${newdate}${clientid}${codegeneratedVianumberrep2}D_${databasename}T_${table1}F_${formtype}V_${version}_prev${prechandler}_C${count}_S${status1}`;
        }
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
            'INSERT INTO DescriptionMaster (    userid, reportid,utilityid,version,clientid,systems,manufacturer,datebegin,timebegin,dateend,timeend,timetype,databasename,table1,formtype,status1,prechandler,nexthandler,count) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?,?)',
            [
                userid,
                tempreportid,
                tempreportid2,
                version,
                clientid,
                systems,
                manufacturer,
                datebegin,
                timebegin,
                dateend,
                timeend,
                timetype,
                databasename,
                table1,
                formtype,
                status1,
                prechandler,
                nexthandler,
                count
            ]
        );
        connection.release();
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.json({ message: 'New row added successfully', reportid ,utilityid});
    } catch (error) {
        console.error(error);
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.status(500).json({ message: 'Server Error' });
    }
});

router.post('/tables', async (req, res) => {
    try {
        // Get the client ID from the request body
        const DB = req.body.databasename;
        // Connect to the main database and retrieve the credentials for the specified client ID
        const main_connection = await getConnection();
        const [credential_rows] = await main_connection.query(
            'SELECT * FROM CredentialMaster WHERE databasename = ?',
            [DB]
        );

        main_connection.release();

        if (credential_rows.length === 0) {
            // If no credentials were found, return a 404 error
            return res.status(404).json({ message: 'Credentials not found' });
        }

        // Extract the required database connection credentials from the retrieved row 
        const { hostofdatabase, userofdatabase, passwordofdatabase, databasename, waitForConnections, connectionLimit, queueLimit } = credential_rows[0];

        const db_connection = await mysql.createConnection({
            host: hostofdatabase, user: userofdatabase, password: passwordofdatabase, database: databasename, waitForConnections, connectionLimit, queueLimit
        });
        const tables = await db_connection.query(`SHOW TABLES FROM ${databasename}`) ;
        await db_connection.end();

        // Return the retrieved data
        const result = tables[0].map(obj => {
            const key = Object.values(obj)[0];
                return key;
        });
        res.json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});

router.post('/attributes', async (req, res) => {
    try {
        // Get the client ID from the request body
        const DB = req.body.databasename;
        const tablename=req.body.tablename;
        // Connect to the main database and retrieve the credentials for the specified client ID
        const main_connection = await getConnection();
        const [credential_rows] = await main_connection.query(
            'SELECT * FROM CredentialMaster WHERE databasename = ?',
            [DB]
        );

        main_connection.release();

        if (credential_rows.length === 0) {
            // If no credentials were found, return a 404 error
            return res.status(404).json({ message: 'Credentials not found' });
        }

        // Extract the required database connection credentials from the retrieved row 
        const { hostofdatabase, userofdatabase, passwordofdatabase, databasename, waitForConnections, connectionLimit, queueLimit } = credential_rows[0];

        const db_connection = await mysql.createConnection({
            host: hostofdatabase, user: userofdatabase, password: passwordofdatabase, database: databasename, waitForConnections, connectionLimit, queueLimit
        });
        // Return the retrieved data
        const [rows] = await db_connection.query(`DESCRIBE ${tablename}`);
        const columns = rows.map(row => row.Field);
        await db_connection.end();
        res.json(columns);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});

// router.get('/unique-form-types', async (req, res) => {
//   try {
//     const connection = await getConnection();
//     const [rows] = await connection.query('SELECT DISTINCT formtype FROM sensorlist');
//     connection.release();
//     const formTypes = rows.map((row) => row.formtype);
//     res.json(formTypes);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Server Error' });
//   }
// });

// router.post('/uniqueformtypes', async (req, res) => {
//     try {
//         const { databasename, tablename } = req.body;
//         const connection = await getConnection();
//         let [rows] = await connection.query(`SELECT * FROM sensorlist`);
//         connection.release();
//         if(rows.length===0){
//             res.json({formtype:[],nextFormType:"F1"})
//         }
//         else{
//             let [rows2] = await connection.query(`SELECT DISTINCT formtype FROM sensorlist WHERE databasename = ? AND tablename = ?`, [databasename, tablename]);
//         connection.release();
//         // if (rows2.length === 0) {
//         //     res.json();
//         // }
//         // else {
//             const formTypes = rows2.map((row) => row.formtype);
           
//             const [result] = await connection.query(`SELECT MAX(formtype) AS maxformtype FROM sensorlist`);
//             const maxform = result[0].maxformtype;

//             // Generate the next sensor name
//             var nextformtype = maxformtype ? parseInt(maxform.substring(1)) + 1 : 1;
//             nextformtype = 'F' + nextformtype;
//             res.json({ formTypes, nextformtype });
//         }
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: 'Server Error' });
//     }
// });


// router.post('/addsensor', async (req, res) => {
//     try {
//         const connection = await getConnection();
//         const { sensorname, databasename, tablename, formtype, head1, head2, unit, attribute }=req.body;


//         if (!sensorname||!databasename|| !tablename||!formtype||!head1||!head2||!unit||!attribute){
//             return res.status(400).json({ message: 'Invalid request' });
//         }
//         const activity="active"
//         const [result] = await connection.query(
//             "INSERT INTO sensorlist (sensorname, databasename, tablename, formtype, head1, head2, unit, attribute,activity) VALUES (?, ?, ?, ?, ?, ?, ?, ?,?)",
//             [sensorname, databasename, tablename, formtype, head1, head2, unit, attribute,activity]
//         );

//         connection.release();
//         res.json({ success: true });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: 'Server Error' });
//     }
// });

router.post('/uniqueformtypes', async (req, res) => {
    try {
        const { databasename, tablename } = req.body;
        const connection = await getConnection();
        let [rows] = await connection.query(`SELECT * FROM sensorlist`);
        connection.release();
        if (rows.length === 0) {
            res.json({ formtypes: [], nextformtype: "F1" })
        }
        else {
            let [rows2] = await connection.query(`SELECT DISTINCT formtype FROM sensorlist WHERE databasename = ? AND tablename = ?`, [databasename, tablename]);
            connection.release();
            const formtypes = rows2.map((row) => row.formtype);

            const [result] = await connection.query(`SELECT MAX(formtype) AS maxformtype FROM sensorlist`);
            const maxformtype = result[0].maxformtype;
            let nextformtype;
            if (maxformtype) {
                const num = parseInt(maxformtype.substring(1)) + 1;
                nextformtype = `F${num}`;
            } else {
                nextformtype = 'F1';
            }
            res.json({ formtypes, nextformtype });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});

router.post('/uniqueformtypes2', async (req, res) => {
    try {
        const {databasename, tablename } = req.body;
        const connection = await getConnection();
        let [rows] = await connection.query(`SELECT * FROM sensorlist`);
        connection.release();
        if (rows.length === 0) {
            res.json({ formtypes: [], nextformtype: "F1" })
        }
        else {
            let [rows2] = await connection.query(`SELECT DISTINCT formtype FROM sensorlist WHERE databasename = ? AND tablename = ?`, [databasename, tablename]);
            connection.release();
            const formtypes = rows2.map((row) => row.formtype);

            const [result] = await connection.query(`SELECT MAX(formtype) AS maxformtype FROM sensorlist`);
            const maxformtype = result[0].maxformtype;
            let nextformtype;
            if (maxformtype) {
                const num = parseInt(maxformtype.substring(1)) + 1;
                nextformtype = `F${num}`;
            } else {
                nextformtype = 'F1';
            }
            res.json({ formtypes, nextformtype });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});


router.post('/addsensors', async (req, res) => {
    try {
        const connection = await getConnection();
        const sensorData = req.body;

        if (!Array.isArray(sensorData) || sensorData.length === 0) {
            return res.status(400).json({ message: 'Invalid request' });
        }

        // Get the maximum sensor ID in the sensorlist table


        // const [maxSensor] = await connection.query('SELECT MAX(sensorid) AS max_sensor FROM sensorlist');
        // let nextSensorId = maxSensor[0].max_sensor ? maxSensor[0].max_sensor + 1 : 1;


        // Insert each sensor row into the sensorlist table

        for (const sensor of sensorData) {
            const { databasename, tablename, formtype, head1, head2, unit, attribute } = sensor;

            if (!databasename || !tablename || !formtype || !head1 || !head2 || !unit || !attribute) {
                return res.status(400).json({ message: 'Invalid request' });
            }

            const activity = "active";
            // const sensorname = `S${nextSensorId++}`;
            const [aaa] = await connection.query(`SELECT * FROM sensorlist`);
            connection.release();
            var nextSensorname=""
            if(aaa.length===0){
                nextSensorname="S1"
            }
            const [result] = await connection.query(`SELECT MAX(sensorname) AS maxSensorname FROM sensorlist`);
            const maxSensorname = result[0].maxSensorname;

            // Generate the next sensor name
            const nextSensorNumber = maxSensorname ? parseInt(maxSensorname.substring(1)) + 1 : 1;
            nextSensorname = 'S' + nextSensorNumber;

            await connection.query(
                'INSERT INTO sensorlist (sensorname, databasename, tablename, formtype, head1, head2, unit, attribute, activity) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
                [nextSensorname, databasename, tablename, formtype, head1, head2, unit, attribute, activity]
            );
        }

        connection.release();
        res.json({ success: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});


router.post('/sensors', async (req, res) => {
    try {
        const connection = await getConnection();
        const {databasename, tablename, formtype } = req.body;


        if (!databasename || !tablename || !formtype) {
            return res.status(400).json({ message: 'Invalid request' });
        }
        const activity = "active"
        const [result] = await connection.query(`SELECT head1,head2,unit,attribute FROM sensorlist WHERE databasename=? AND tablename=? AND formtype=?`,
            [databasename, tablename, formtype]
        );

        connection.release();
        res.json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});

router.post('/setpoints', async (req, res) => {
    const data = req.body;
    const connection = await getConnection();
    try {
        for (let i = 0; i < data.length; i++) {
            const reportid = data[i].reportid;
            const sensorname = data[i].sensorname;
            const order1 =data[i].order1;
            const [rows] = await connection.query('SELECT * FROM Set_Points WHERE reportid = ? AND sensorname = ?', [reportid, sensorname]);
            if (rows.length === 0) {
                await connection.query('INSERT INTO Set_Points (reportid, sensorname,order1) VALUES (?, ?, ?)', [reportid, sensorname,order1]);
            }
        }
        connection.release();
        res.json({ message: 'Data inserted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});

router.post('/normalpoints', async (req, res) => {
    const data = req.body;
    const connection = await getConnection();
    try {
        for (let i = 0; i < data.length; i++) {
            const reportid = data[i].reportid;
            const sensorname = data[i].sensorname;
            const order1 = data[i].order1;
            const [rows] = await connection.query('SELECT * FROM Normal_Points WHERE reportid = ? AND sensorname = ?', [reportid, sensorname]);
            if (rows.length === 0) {
                await connection.query('INSERT INTO Normal_Points (reportid, sensorname, order1) VALUES (?, ?,?)', [reportid, sensorname,order1]);
            }
        }
        connection.release();
        res.json({ message: 'Data inserted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});



module.exports = router;