const express = require('express');
const router = express.Router();
const mysql = require('mysql2/promise');
const { getConnection } = require('../db/connection');

router.post('/addCredential', async (req, res) => {
    try {
        const { clientid, clientname, hostofdatabase, userofdatabase, passwordofdatabase, databasename, waitForConnections, connectionLimit, queueLimit } = req.body;

        const connection = await getConnection();


        const query = "INSERT INTO CredentialMaster (clientid,clientname, hostofdatabase, userofdatabase, passwordofdatabase, databasename, waitForConnections, connectionLimit, queueLimit) VALUES (?, ?, ?, ?, ?, ?, ?, ?,?)";
        const [result] = await connection.query(query, [clientid, clientname, hostofdatabase, userofdatabase, passwordofdatabase, databasename, waitForConnections, connectionLimit, queueLimit]);
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
    const { systemid, systemname, logoid, logopath } = req.body;

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
            [logoid, logopath]
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
    const { manufacturerid, manufacturername, logoid, logopath } = req.body;

    try {
        const connection = await getConnection();
        if (!manufacturerid || !manufacturername || !logoid) {
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
        databasename,
        table1,
        formtype,
        status1,
        prechandler,
        nexthandler,
        count,
        reportname
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
            !count||
            !reportname
        ) {
    
            return res.status(400).json({ message: 'Invalid request' });
        }
        // Generate the codegeneratedVianumberrep
        const [countResult] = await connection.query(
            'SELECT COUNT(*) AS count FROM DescriptionMaster WHERE datebegin = ?',
            [datebegin]
        );
        const [couttt] = await connection.query(`SELECT COUNT(*) AS count FROM DescriptionMaster`);
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
            'INSERT INTO DescriptionMaster (userid, reportid,utilityid,version,clientid,systems,manufacturer,datebegin,timebegin,dateend,timeend,timetype,databasename,table1,formtype,status1,prechandler,nexthandler,count,reportname) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?,?,?,?,?,?,?,?)',
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
                count,
                reportname
            ]
        );
        connection.release();

        res.json({ message: 'New row added successfully', reportid: tempreportid, utilityid: tempreportid2 });
    } catch (error) {
        console.error(error);

        res.status(500).json({ message: 'Server Error' });
    }
});

router.post('/description/reportid', async (req, res) => {
    try {
        const connection = await getConnection();
        const { reportid  } = req.body;


        if (!reportid) {
            return res.status(400).json({ message: 'Invalid request' });
        }
        const activity = "active"
        const [result] = await connection.query(`SELECT clientid,systems,manufacturer,datebegin,timebegin,dateend,timeend,databasename,table1,formtype,status1,prechandler,nexthandler,count,reportname FROM DescriptionMaster WHERE reportid = ?`,[reportid]);
        const clientid=result[0].clientid;
        const [result2]=await connection.query(`SELECT clientname FROM CredentialMaster WHERE clientid=?`,[clientid])
        const [rows] = await connection.query(`SELECT reportid FROM DescriptionMaster WHERE reportid = ?`, [reportid]);
         console.log(rows)
        const  nextversion= rows.length;

        connection.release();
        res.json({result,clientname:result2[0].clientname,nextversion});
    } catch (error) {
        console.error(error);
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
        const tables = await db_connection.query(`SHOW TABLES FROM ${databasename}`);
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
        const tablename = req.body.tablename;
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

// router.post('/uniqueformtypes', async (req, res) => {
//     try {
//         const { databasename, tablename } = req.body;
//         const connection = await getConnection();
//         let [rows] = await connection.query(`SELECT * FROM sensorlist`);
//         connection.release();
//         if (rows.length === 0) {
//             res.json({ formtypes: [], nextformtype: "F1" })
//         }
//         else {
//             let [rows2] = await connection.query(`SELECT DISTINCT formtype FROM sensorlist WHERE databasename = ? AND tablename = ?`, [databasename, tablename]);
//             connection.release();
//             const formtypes = rows2.map((row) => row.formtype);

//             const [result] = await connection.query(`SELECT MAX(formtype) AS maxformtype FROM sensorlist`);
//             const maxformtype = result[0].maxformtype;
//             let nextformtype;
//             if (maxformtype) {
//                 const num = parseInt(maxformtype.substring(1)) + 1;
//                 nextformtype = `F${num}`;
//             } else {
//                 nextformtype = 'F1';
//             }

//             res.json({ formtypes, nextformtype });
//         }
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: 'Server Error' });
//     }
// });

router.post('/uniqueformtypes', async (req, res) => {
    try {
        const  tablename  = req.body.tablename;
        const DB=req.body.databasename;
        const connection = await getConnection();
        // Get all rows from the table
        let [rows] = await connection.query(`SELECT * FROM sensorlist`);
        connection.release();
        if (rows.length === 0) {
            res.json({ formtypes: [], nextformtype: "F1", minvalue: null, maxvalue: null });
        } else {
            // Get the distinct form types
            let [rows2] = await connection.query(`SELECT DISTINCT formtype FROM sensorlist WHERE databasename = ? AND tablename = ?`, [DB, tablename]);    
            // Connect to the main database and retrieve the credentials for the specified client ID
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
            const [credential_rows] = await connection.query(
                'SELECT * FROM CredentialMaster WHERE databasename = ?',
                [DB]
            );
            connection.release();

            if (credential_rows.length === 0) {
                // If no credentials were found, return a 404 error
                return res.json({formtypes,nextformtype,mindate:"1999-01-01 00:00:00.000000",maxdate:"2050-01-01 00:00:00.000000"});
            }
            // Extract the required database connection credentials from the retrieved row 
            const { hostofdatabase, userofdatabase, passwordofdatabase, databasename, waitForConnections, connectionLimit, queueLimit } = credential_rows[0];
            const db_connection = await mysql.createConnection({
                host: hostofdatabase, user: userofdatabase, password: passwordofdatabase, database: databasename, waitForConnections, connectionLimit, queueLimit
            });
            let [rows3] = await db_connection.query(`SHOW COLUMNS FROM ${tablename}`);
            // console.log(rows3[0].Field,typeof(rows3[0].Field))
            const [result1] = await db_connection.query(`SELECT MAX(${rows3[0].Field}) AS max_value FROM ${tablename}`);
            const [result2] = await db_connection.query(`SELECT MIN(${rows3[0].Field}) AS min_value FROM ${tablename}`);
            await db_connection.end();
            // Get the maximum and minimum value of the first column
            const mindate = result2[0].min_value;
            const maxdate=result1[0].max_value;
            // console.log(minvalue,maxvalue)
           res.json({ formtypes, nextformtype,mindate,maxdate});
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});

// router.post('/uniqueformtypes2', async (req, res) => {
//     try {
//         const { databasename, tablename } = req.body;
//         const connection = await getConnection();
//         let [rows] = await connection.query(`SELECT * FROM sensorlist`);
//         connection.release();
//         if (rows.length === 0) {
//             res.json({ formtypes: [], nextformtype: "F1" })
//         }
//         else {
//             let [rows2] = await connection.query(`SELECT DISTINCT formtype FROM sensorlist WHERE databasename = ? AND tablename = ?`, [databasename, tablename]);
//             connection.release();
//             const formtypes = rows2.map((row) => row.formtype);

//             const [result] = await connection.query(`SELECT MAX(formtype) AS maxformtype FROM sensorlist`);
//             const maxformtype = result[0].maxformtype;
//             let nextformtype;
//             if (maxformtype) {
//                 const num = parseInt(maxformtype.substring(1)) + 1;
//                 nextformtype = `F${num}`;
//             } else {
//                 nextformtype = 'F1';
//             }
//             res.json({ formtypes, nextformtype });
//         }
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: 'Server Error' });
//     }
// });

router.post('/addsensors', async (req, res) => {
    try {
        const connection = await getConnection();
        const sensorData = req.body;

        if (!Array.isArray(sensorData) || sensorData.length === 0) {
            return res.status(400).json({ message: 'Invalid request' });
        }

        // Get the max sensor name from the sensorlist table
        const [result] = await connection.query(`SELECT MAX(sensorname) AS maxSensorname FROM sensorlist`);
        var maxSensorname = result[0].maxSensorname;

        for (const sensor of sensorData) {
            const { databasename, tablename, formtype, head1, head2, unit, attribute } = sensor;

            if (!databasename || !tablename || !formtype || !head1 || !head2 || !unit || !attribute) {
                return res.status(400).json({ message: 'Invalid request' });
            }

            let nextSensorname = '';
            let sensorExists = true;

            // Generate the next sensor name
            while (sensorExists) {
                const nextSensorNumber = maxSensorname ? parseInt(maxSensorname.substring(1)) + 1 : 1;
                nextSensorname = 'S' + nextSensorNumber;

                const [result] = await connection.query(`SELECT * FROM sensorlist WHERE sensorname = ?`, [nextSensorname]);
                if (result.length === 0) {
                    // The sensor name is available
                    sensorExists = false;
                } else {
                    // The sensor name is already taken, try the next number
                    maxSensorname = nextSensorname;
                }
            }

            await connection.query(
                'INSERT INTO sensorlist (sensorname, databasename, tablename, formtype, head1, head2, unit, attribute, activity,inuse) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?,?)',
                [nextSensorname, databasename, tablename, formtype, head1, head2, unit, attribute, "active","N"]
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
        const { databasename, tablename, formtype } = req.body;


        if (!databasename || !tablename || !formtype) {
            return res.status(400).json({ message: 'Invalid request' });
        }
        const activity = "active"
        const [result] = await connection.query(`SELECT sensorname,head1,head2,unit,attribute,activity,inuse FROM sensorlist WHERE databasename=? AND tablename=? AND formtype=?`,
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
            const order1 = data[i].order1;
            if (!data[i].reportid || !data[i].sensorname) {
                return res.status(400).json({ message: 'Invalid request' });
            }
            const [rows] = await connection.query('SELECT * FROM Set_Points WHERE reportid = ? AND sensorname = ?', [reportid, sensorname]);
            if (rows.length === 0) {
                await connection.query('INSERT INTO Set_Points (reportid, sensorname,order1) VALUES (?, ?, ?)', [reportid, sensorname, order1]);
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
            const attribute=data[i].attribute;
            if (!data[i].reportid || !data[i].sensorname) {
                return res.status(400).json({ message: 'Invalid request' });
            }
            const [rows] = await connection.query('SELECT * FROM Normal_Points WHERE reportid = ? AND sensorname = ?', [reportid, sensorname]);
            if (rows.length === 0) {
                await connection.query('INSERT INTO Normal_Points (reportid, sensorname, order1,attribute) VALUES (?, ?,?, ?)', [reportid, sensorname, order1,attribute]);
            }
        }
        connection.release();
        res.json({ message: 'Data inserted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});

router.post('/advancesearch', async (req, res) => {
    try {
        const DB = req.body.databasename;
        // Connect to the main database and retrieve the credentials for the specified client ID
        const main_connection = await getConnection();
        const [credential_rows] = await main_connection.query(
            'SELECT * FROM CredentialMaster WHERE databasename = ?',
            [DB]
        );
        if (credential_rows.length === 0) {
            // If no credentials were found, return a 404 error
            main_connection.release();
            return res.status(404).json({ message: 'Credentials not found' });
        }

        // Extract the required database connection credentials from the retrieved row 
        const { hostofdatabase, userofdatabase, passwordofdatabase, databasename, waitForConnections, connectionLimit, queueLimit } = credential_rows[0];

        const reportid = req.body.reportid;
        if (reportid === undefined) {
            res.json({ message: 'reportid is undefinedg' });
        }
        // Get datebegin, dateend, and reporttype from Description table
        const [descriptionRows] = await main_connection.query(
            'SELECT datebegin, dateend, formtype FROM DescriptionMaster WHERE reportid = ?',
            [reportid]
        );
        const [{ datebegin, dateend, formtype }] = descriptionRows;
        // Get SetPointList and NormalPointList from Set_Points and Normal_Points tables
        const [setPointRows] = await main_connection.query(
            'SELECT sensorname FROM Set_Points WHERE reportid = ? ORDER BY IF(order1 = 0, NULL, order1), sensorname ASC',
            [reportid]
        );


        const [normalPointRows] = await main_connection.query(
            'SELECT sensorname,attribute FROM Normal_Points WHERE reportid = ? ORDER BY IF(order1 = 0, NULL, order1), sensorname ASC',
            [reportid]
        );
        var setList=[]
        const setPointList = setPointRows.map(row => row.sensorname);
        if(setPointList.length>0){
        const setPointListValues = setPointList.map(() => '?').join(',');
        const [setListRows] = await main_connection.query(
            `SELECT * FROM sensorlist WHERE formtype = ? AND sensorname IN (${setPointListValues})`,
            [formtype, ...setPointList]
        );
         setList = setPointList.map(sensorname => setListRows.find(row => row.sensorname === sensorname));
        }   

        const normalPointList = normalPointRows.map(row => row.sensorname);
        var normalList=[]
        if(normalPointList.length>0){
        const normalPointListValues = normalPointList.map(() => '?').join(',');
        const [normalListRows] = await main_connection.query(
            `SELECT * FROM sensorlist WHERE formtype = ? AND sensorname IN (${normalPointListValues})`,
            [formtype, ...normalPointList]
        );
         normalList = normalPointList.map(sensorname => normalListRows.find(row => row.sensorname === sensorname));
        // Get attribute types from NormalList
        }
        const attributes = normalPointRows.map(row => row.attribute);;
        main_connection.release();

        const db_connection = await mysql.createConnection({
            host: hostofdatabase, user: userofdatabase, password: passwordofdatabase, database: databasename, waitForConnections, connectionLimit, queueLimit
        });

        const TABLE_TO_USE = req.body.tablename;
        const [rows] = await db_connection.query(`DESCRIBE ${TABLE_TO_USE}`);
        const columns = rows.map(row => row.Field);

        const [tableRows] = await db_connection.query(
            `SELECT * FROM ${TABLE_TO_USE} WHERE ${columns[0]} BETWEEN ? AND ? `,
            [datebegin, dateend]
        );
        const finalArray = tableRows.map(row => {
            const filteredRow = {};
            Object.keys(row).forEach(key => {
                if (key === `${columns[0]}` || attributes.includes(key)) {
                    filteredRow[key] = row[key];
                }
            });

            return filteredRow;
        });
        var attributelist=[];
        if(tableRows.length>0){
            attributelist=tableRows[0];
        }

        const response = { firstheader: setList, secondheader: normalList, body: finalArray, attributelist };
        res.json(response);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});

router.post('/updateSetPoints', async (req, res) => {
    try {
        const connection = await pool.getConnection();
        const updates = req.body;

        if (!Array.isArray(updates) || updates.length === 0) {
            return res.status(400).json({ message: 'Invalid request' });
        }

        // Update the rows in the Set_Points table
        for (const update of updates) {
            const { reportid, sensorname, order1 } = update;

            if (!reportid || !sensorname || isNaN(parseInt(order1))) {
                return res.status(400).json({ message: 'Invalid request' });
            }

            const [results] = await connection.query(
                'UPDATE Set_Points SET order1 = ? WHERE reportid = ? AND sensorname = ?',
                [parseInt(order1), reportid, sensorname]
            );
        }

        connection.release();
        res.json({ success: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});

router.post('/updatenormalpoints', async (req, res) => {
    try {
        const connection = await getConnection();
        const normalPointsData = req.body;

        if (!Array.isArray(normalPointsData) || normalPointsData.length === 0) {
            return res.status(400).json({ message: 'Invalid request' });
        }

        for (const normalPoint of normalPointsData) {
            const { reportid, sensorname, order1 } = normalPoint;

            if (!reportid || !sensorname || isNaN(parseInt(order1))) {
                return res.status(400).json({ message: 'Invalid request' });
            }

            await connection.query(
                'UPDATE Normal_Points SET order1 = ? WHERE reportid = ? AND sensorname = ?',
                [parseInt(order1), reportid, sensorname]
            );
        }

        connection.release();
        res.json({ success: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});

router.post('/setPointData', async (req, res) => {
    try {
        const { reportid, setdata } = req.body;

        // Get a database connection from the pool
        const connection = await getConnection();

        // Insert the data into the SetPointData table
        const query = 'INSERT INTO SetPointData (reportid, setdata) VALUES (?, ?)';
        await connection.query(query, [reportid, JSON.stringify(setdata)]);

        // Update the status1 column in the DescriptionMaster table
        const updateQuery = 'UPDATE DescriptionMaster SET status1 = ? WHERE reportid = ?';
        await connection.query(updateQuery, ['Created', reportid]);

        // Release the connection back to the pool
        connection.release();

        res.json({ message: 'Data added successfully!' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});

router.post('/getsetdata/reportid', async (req, res) => {
    try {
        const reportid = req.body.reportid;
        const connection = await getConnection();

        const query = "SELECT setdata FROM SetPointData WHERE reportid = ?";
        const [rows] = await connection.query(query, [reportid]);
        connection.release();
        if (rows.length === 0) {
            res.json({setdata:[[]]});
             return;
        }

        res.json({ setdata: rows[0].setdata });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});

router.get('/reports', async (req, res) => {
    try {
        const connection = await getConnection();
        const [rows] = await connection.query('SELECT reportid,version, reportname, datebegin,databasename,table1, status1 FROM DescriptionMaster');
        connection.release();
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});

router.post('/sensors/inuse', async (req, res) => {
    try {
        const { sensornames } = req.body;
        const connection = await getConnection();
        const query = `SELECT * FROM sensorlist WHERE sensorname IN (?)`;
        const [rows] = await connection.query(query, [sensornames]);
        if (rows.length === 0) {
            res.status(404).json({ message: 'No sensors found' });
        } else {
            const updateQuery = `UPDATE sensorlist SET inuse = 'Y' WHERE sensorname IN (?)`;
            await connection.query(updateQuery, [sensornames]);
            res.json({ message: `Inuse status updated for sensors: ${sensornames}` });
        }
        connection.release();
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});

router.post('/removesensors', async (req, res) => {
    try {
        const connection = await getConnection();
        const sensorNames = req.body;
        console.log(sensorNames)

        if (!Array.isArray(sensorNames) || sensorNames.length === 0) {
            return res.status(400).json({ message: 'Invalid request' });
        }

        const [results] = await connection.query(`SELECT * FROM sensorlist WHERE sensorname IN (?)`, [sensorNames]);

        if (results.length === 0) {
            return res.status(404).json({ message: 'No matching sensors found' });
        }

        for (const sensor of results) {
            const { sensorname, inuse } = sensor;

            if (inuse === 'N') {
                // Delete the row from the table
                await connection.query(`DELETE FROM sensorlist WHERE sensorname = ?`, [sensorname]);
            } else if (inuse === 'Y') {
                // Update the activity column to 'inactive'
                await connection.query(`UPDATE sensorlist SET activity = 'inactive' WHERE sensorname = ?`, [sensorname]);
            }
        }

        connection.release();
        res.json({ success: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});

router.post('/addAttributes', async (req, res) => {
    const attributes = req.body;

    try {
        const connection = await getConnection();

        // Loop through the array of attributes
        for (let i = 0; i < attributes.length; i++) {
            const { reportid, sensorname, attributename } = attributes[i];

            // Check if the attribute already exists
            const [existingAttribute] = await connection.query(
                'SELECT * FROM AttributeMaster WHERE reportid = ? AND sensorname = ? AND attributename = ?',
                [reportid, sensorname, attributename]
            );

            if (existingAttribute.length > 0) {
                console.log(`Skipping attribute: ${JSON.stringify(attributes[i])}`);
                continue; // Skip to the next iteration of the loop
            }

            // Insert the attribute if it doesn't already exist
            const result = await connection.query(
                'INSERT INTO AttributeMaster (reportid, sensorname, attributename) VALUES (?, ?, ?)',
                [reportid, sensorname, attributename]
            );

            console.log(`Inserted attribute: ${JSON.stringify(attributes[i])}`);
        }

        connection.release();
        res.json({ message: 'Attributes added successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});

router.post('/historylog', async (req, res) => {
  const { reportid, version, log } = req.body;

  try {
    // Get a connection from the pool
    const connection = await getConnection();

    // Get the current date and time
   const dateObj = new Date();
    const ISTOffset = 330;   // IST is UTC+5:30
    const ISTTime = new Date(dateObj.getTime() + (ISTOffset * 60000));
    const dateandtimestamp = ISTTime.toISOString().slice(0, 19).replace('T', ' ');

    console.log(dateandtimestamp)
    // Insert a new row into the historylog table
    const query = 'INSERT INTO historylog (reportid, version, dateandtimestamp, log) VALUES (?, ?, ?, ?)';
    await connection.query(query, [reportid, version, dateandtimestamp, log]);
    
    // Release the connection back to the pool
    connection.release();

    res.status(200).json({message:"log added succesfully"});
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

router.post('/getReportLogs', async (req, res) => {
  try {
    const { reportid } = req.body;

    const connection = await getConnection();
    const query = 'SELECT version,dateandtimestamp, log FROM historylog WHERE reportid = ?';
    const rows = await connection.query(query, [reportid]);

    connection.release();
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});



module.exports = router;