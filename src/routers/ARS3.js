const express = require('express');
const router = express.Router();
const mysql = require('mysql2/promise');
const sql = require('mssql');
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
        const [rows] = await connection.query(`SELECT clientid, clientname, COUNT(*) AS databaseNum FROM CredentialMaster GROUP BY clientid    `);
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
        const [rows] = await connection.query('SELECT * FROM SystemMaster WHERE status="active" ');
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
        const [rows] = await connection.query('SELECT * FROM ManufacturerMaster WHERE status="active" ');
        connection.release();
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});

router.post('/addusers', async (req, res) => {
    const { username, employid, department, usertype, phonenumber, email, password, userstatus } = req.body;

    try {
        const connection = await getConnection();
        if (!username || !employid || !usertype || !email || !password || !userstatus) {
            return res.status(400).json({ message: 'Invalid request' });
        }
        const result = await connection.query(
            'INSERT INTO UserMaster ( username, employid, department,usertype,phonenumber, email, passwor,userstatus ) VALUES (?, ?, ?, ?, ?, ?, ?,?)',
            [username, employid, department, usertype, phonenumber, email, password, userstatus]
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
        const [rows] = await connection.query('SELECT * FROM UserMaster WHERE userstatus="active"');
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
        userid, reportid, utilityid, version, clientid, systems, manufacturer, datebegin, timebegin, dateend, timeend, timetype, databasename, table1, formtype, status1, prechandler, nexthandler, count, reportname } = req.body;

    try {
        const connection = await getConnection();
        if (
            !userid || !clientid || !databasename || !table1 || !formtype) {
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
        const { reportid } = req.body;


        if (!reportid) {
            return res.status(400).json({ message: 'Invalid request' });
        }
        const activity = "active"
        const [result] = await connection.query(`SELECT clientid,systems,manufacturer,datebegin,timebegin,dateend,timeend,databasename,table1,formtype,status1,prechandler,nexthandler,count,reportname FROM DescriptionMaster WHERE reportid = ?`, [reportid]);
        const clientid = result[0].clientid;
        const [result2] = await connection.query(`SELECT clientname FROM CredentialMaster WHERE clientid=?`, [clientid])
        const [rows] = await connection.query(`SELECT reportid FROM DescriptionMaster WHERE reportid = ?`, [reportid]);
        console.log(rows)
        const nextversion = rows.length;

        connection.release();
        res.json({ result, clientname: result2[0].clientname, nextversion });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});

// const sql = require('mssql');
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

        const config = {
            user: userofdatabase,
            password: passwordofdatabase,
            server: hostofdatabase,
            database: databasename,
            encrypt: true,
            trustServerCertificate: true
        };
        const sql_connection = await sql.connect(config);
        const tables = await sql_connection.query(`SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_TYPE='BASE TABLE'`);
        await sql_connection.close();

        // Return the retrieved data
        const result = tables.recordset.map(row => row.TABLE_NAME);
        res.json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});

router.post('/attributes', async (req, res) => {
    try {
        // Get the client ID and table name from the request body
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
        const { hostofdatabase, userofdatabase, passwordofdatabase, databasename } = credential_rows[0];

        // Connect to the SQL Server using the retrieved credentials
        const config = {
            user: userofdatabase,
            password: passwordofdatabase,
            server: hostofdatabase,
            database: databasename,
            encrypt: true, // Use encryption to secure the connection
            trustServerCertificate: true // Allow self-signed certificates
        };
        const pool = await sql.connect(config);

        // Get the list of columns in the specified table
        const result = await pool.request()
            .query(`SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = '${tablename}'`);

        // Close the connection pool
        pool.close();

        // Return the retrieved data
        const columns = result.recordset.map(row => row.COLUMN_NAME);
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

// const sql = require('mssql');

router.post('/uniqueformtypes', async (req, res) => {
    try {
        const tablename = req.body.tablename;
        const DB = req.body.databasename;
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
                // nextformtype = `F${num}`;
                // console.log(num)
                if(num!==NaN){
                    nextformtype="F1";
                }
                else{
                   nextformtype = `F${num}`;
                }
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
                return res.json({ formtypes, nextformtype, mindate: "1999-01-01 00:00:00.000000", maxdate: "2050-01-01 00:00:00.000000" });
            }
            // Extract the required database connection credentials from the retrieved row 
            const { hostofdatabase, userofdatabase, passwordofdatabase, databasename } = credential_rows[0];
            const config = {
                user: userofdatabase,
                password: passwordofdatabase,
                server: hostofdatabase,
                database: databasename,
                encrypt: true, // Use encryption to secure the connection
                trustServerCertificate: true // Allow self-signed certificates
            };
            const pool = await new sql.ConnectionPool(config).connect();

            const { recordset: rows3 } = await pool.request().query(`SELECT TOP 1 * FROM ${tablename} ORDER BY 1`);
            // console.log(rows3[0],typeof(rows3[0]));
            let arr = Object.getOwnPropertyNames(rows3[0]);
            // console.log('ttttttttt',arr)
            const { recordset: result1} = await pool.request().query(`SELECT MAX(${arr[0]}) AS max_value FROM ${tablename}`);
            const { recordset: result2} = await pool.request().query(`SELECT MIN(${arr[0]}) AS min_value FROM ${tablename}`);

            await pool.close();
            // console.log(result1,result2);
            // Get the maximum and minimum value of the first column
            const mindate = result2[0].min_value;
            const maxdate = result1[0].max_value;
            // console.log(minvalue,maxvalue)
            res.json({ formtypes, nextformtype, mindate, maxdate });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});

// const [result1] = await pool.request().query(`SELECT MAX(${rows3[0].columns[0]}) AS max_value FROM ${tablename}`);
// const [result2] = await pool.request().query(`SELECT MIN(${rows3[0].columns[0]}) AS min_value FROM ${tablename}`);


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

        if (!Array.isArray(sensorData)) {
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
                [nextSensorname, databasename, tablename, formtype, head1, head2, unit, attribute, "active", "N"]
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
            const attribute = data[i].attribute;
            if (!data[i].reportid || !data[i].sensorname) {
                return res.status(400).json({ message: 'Invalid request' });
            }
            const [rows] = await connection.query('SELECT * FROM Normal_Points WHERE reportid = ? AND sensorname = ?', [reportid, sensorname]);
            if (rows.length === 0) {
                await connection.query('INSERT INTO Normal_Points (reportid, sensorname, order1,attribute) VALUES (?, ?,?, ?)', [reportid, sensorname, order1, attribute]);
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
        // const DB = req.body.databasename;
        // Connect to the main database and retrieve the credentials for the specified client ID
        const main_connection = await getConnection();
        const reportid = req.body.reportid;
        if (reportid === undefined) {
            res.json({ message: 'reportid is undefined' });
        }
        // Get datebegin, dateend, and reporttype from Description table
        const [descriptionRows] = await main_connection.query(
            'SELECT databasename,table1,datebegin,timebegin, dateend,timeend, formtype FROM DescriptionMaster WHERE reportid = ?',
            [reportid]
        );
        main_connection.release();
        const [{ table1,datebegin,timebegin, dateend,timeend, formtype }] = descriptionRows;
        console.log(timebegin,timeend);
        console.log(table1, datebegin, dateend, formtype)
        console.log(descriptionRows)
        const DB=descriptionRows[0].databasename;
        const [credential_rows] = await main_connection.query(
            'SELECT * FROM CredentialMaster WHERE databasename = ?',
            [DB]
        );
        if (credential_rows.length === 0) {
            // If no credentials were found, return a 404 error
            main_connection.release();
            return res.status(404).json({ message: 'Credentials not found' });
        }
        const { hostofdatabase, userofdatabase, passwordofdatabase, databasename, waitForConnections, connectionLimit, queueLimit } = credential_rows[0];
        const [setPointRows] = await main_connection.query(
            'SELECT sensorname FROM Set_Points WHERE reportid = ? ORDER BY IF(order1 = 0, NULL, order1), sensorname ASC',
            [reportid]
        );
        main_connection.release();
        const [normalPointRows] = await main_connection.query(
            'SELECT sensorname,attribute FROM Normal_Points WHERE reportid = ? ORDER BY IF(order1 = 0, NULL, order1), sensorname ASC',
            [reportid]
        );
        main_connection.release();

        var setList = []
        const setPointList = setPointRows.map(row => row.sensorname);
        if (setPointList.length > 0) {
            const setPointListValues = setPointList.map(() => '?').join(',');
            const [setListRows] = await main_connection.query(
                `SELECT sensorname,head1,head2,unit,inuse,activity,attribute FROM sensorlist WHERE formtype = ? AND sensorname IN (${setPointListValues})`,
                [formtype, ...setPointList]
            );
            main_connection.release();
            setList = setPointList.map(sensorname => setListRows.find(row => row.sensorname === sensorname));
        }

        const normalPointList = normalPointRows.map(row => row.sensorname);
        var normalList1 = []
        var normalList = [];
        if (normalPointList.length > 0) {
            const normalPointListValues = normalPointList.map(() => '?').join(',');
            const [normalListRows] = await main_connection.query(
                `SELECT sensorname,head1,head2,unit,inuse,activity,attribute FROM sensorlist WHERE formtype = ? AND sensorname IN (${normalPointListValues})`,
                [formtype, ...normalPointList]
            );
            main_connection.release();
     
            normalList1 = normalPointList.map(sensorname => normalListRows.find(row => row.sensorname === sensorname));
             for (const obj1 of normalList1) {
                for (const obj2 of normalPointRows) {
                    if (obj1.sensorname === obj2.sensorname) {
                        obj1.attribute = obj2.attribute;
                    }
                }
                normalList.push(obj1);
            }
        }
        // console.log("wwwwwwwwwwwwwww",normalList)
        const attributes = normalPointRows.map(row => row.attribute);;
        main_connection.release();
        const config = {
            user: userofdatabase,
            password: passwordofdatabase,
            server: hostofdatabase,
            database: databasename,
            encrypt: true, // Use encryption to secure the connection
            trustServerCertificate: true // Allow self-signed certificates
        };
        const pool = await sql.connect(config);
        const TABLE_TO_USE = table1;
        // const [rows] = await db_connection.query(`DESCRIBE ${TABLE_TO_USE}`);
        const columns = await pool.request()
            .query(`SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = '${TABLE_TO_USE}'`);
        const firstcolname = columns.recordset[0].COLUMN_NAME;     
        const result = await pool.request()
            .input('datebegin', sql.VarChar, datebegin + 'T'+timebegin+':00.000Z')
            .input('dateend', sql.VarChar, dateend + 'T' +timeend+':59.999Z')
            .query(`SELECT * FROM ${TABLE_TO_USE} WHERE ${firstcolname} BETWEEN @datebegin AND @dateend`);

        const tableRows = result.recordset;
        // let tableRows = [];

        // const getColumnTypeQuery = `SELECT DATA_TYPE FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = '${TABLE_TO_USE}' AND COLUMN_NAME = '${firstcolname}'`;
        
        // const request = pool.request();
        // request.query(getColumnTypeQuery, (err, result) => {
        //     if (err) {
        //         console.error('Error retrieving column data type', err);
        //         tableRows = [];
        //     } else {
        //         const columnType = result.recordset[0].DATA_TYPE;
        //         console.log("eeeeeeeeeeeeeeeeeeeee", columnType);
        //         let dateBeginParam, dateEndParam;

        //         // Convert datebegin and dateend to the appropriate data type
        //         if (columnType === 'datetime') {
        //             dateBeginParam = new Date(datebegin).toISOString();

        //             const x = new Date(dateend);
        //                   x.setUTCHours(0, 0, 0, 0); // Set to the start of the day in UTC time
        //                   x.setUTCDate(x.getUTCDate() + 1); // Set to the start of the next day in UTC time
        //                   x.setUTCMilliseconds(x.getUTCMilliseconds() - 1); // Subtract one millisecond
        //                 //   console.log(x.toISOString());

        //             dateEndParam = x.toISOString();
        //         } else if (columnType === 'date') {
        //             dateBeginParam = new Date(datebegin).toISOString().substring(0, 10);
        //             dateEndParam = new Date(dateend).toISOString().substring(0, 10);
        //         } else {
        //             dateBeginParam = datebegin;
        //             dateEndParam = dateend;
        //         }
        //         console.log(dateBeginParam, dateEndParam);
        //         // Execute the query with the appropriate parameter types
        //         const query = `SELECT * FROM ${TABLE_TO_USE} WHERE ${firstcolname} BETWEEN ${dateBeginParam} AND ${dateEndParam}`;
        //         console.log("qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq",query);
        //         request.query(query, (err, result) => {
        //             if (err) {
        //                 console.error('Error executing query', err);
        //                 tableRows = [];
        //             } else {
        //                 console.log(result.recordset);
        //                 tableRows = result.recordset;
        //             }
        //         });
        //     }
        // });
       

        // The tableRows variable is now available for use outside of the request method
        const finalArray = tableRows.map(row => {
            const filteredRow = {};
            Object.keys(row).forEach(key => {
                if (key === `${firstcolname}` || attributes.includes(key)) {
                    filteredRow[key] = row[key];
                }
            });
            return filteredRow;
        });
        var attributelist = [];
        if (tableRows.length > 0) {
            attributelist = tableRows[0];
        }
        const response = { firstheader: setList, secondheader: normalList, body: finalArray, attributelist };
        res.json(response);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});

router.post('/advancesearch2', async (req, res) => {
    try {
        const main_connection = await getConnection();
        const reportid = req.body.reportid;
        if (reportid === undefined) {
            res.json({ message: 'reportid is undefined' });
        }
        const [descriptionRows] = await main_connection.query(
            'SELECT databasename,table1,datebegin, dateend, formtype FROM DescriptionMaster WHERE reportid = ?',
            [reportid]
        );
        main_connection.release();
        const [{ table1, datebegin, dateend, formtype }] = descriptionRows;
        console.log(table1, datebegin, dateend, formtype)
        console.log(descriptionRows)
        const DB = descriptionRows[0].databasename;
        const [credential_rows] = await main_connection.query(
            'SELECT * FROM CredentialMaster WHERE databasename = ?',
            [DB]
        );
        if (credential_rows.length === 0) {
            main_connection.release();
            return res.status(404).json({ message: 'Credentials not found' });
        }
        const { hostofdatabase, userofdatabase, passwordofdatabase, databasename, waitForConnections, connectionLimit, queueLimit } = credential_rows[0];

        const [setPointRows] = await main_connection.query(
            'SELECT sensorname FROM Set_Points WHERE reportid = ? ORDER BY IF(order1 = 0, NULL, order1), sensorname ASC',
            [reportid]
        );
        main_connection.release();

        const [normalPointRows] = await main_connection.query(
            'SELECT sensorname,attribute FROM Normal_Points WHERE reportid = ? ORDER BY IF(order1 = 0, NULL, order1), sensorname ASC',
            [reportid]
        );
        main_connection.release();

        var setList = []
        const setPointList = setPointRows.map(row => row.sensorname);
        if (setPointList.length > 0) {
            const setPointListValues = setPointList.map(() => '?').join(',');
            const [setListRows] = await main_connection.query(
                `SELECT sensorname,head1,head2,unit,inuse,activity,attribute FROM sensorlist WHERE formtype = ? AND sensorname IN (${setPointListValues})`,
                [formtype, ...setPointList]
            );
            main_connection.release();
            setList = setPointList.map(sensorname => setListRows.find(row => row.sensorname === sensorname));
        }

        const normalPointList = normalPointRows.map(row => row.sensorname);
        var normalList1 = []
        var normalList = [];
        if (normalPointList.length > 0) {
            const normalPointListValues = normalPointList.map(() => '?').join(',');
            const [normalListRows] = await main_connection.query(
                `SELECT sensorname,head1,head2,unit,inuse,activity,attribute FROM sensorlist WHERE formtype = ? AND sensorname IN (${normalPointListValues})`,
                [formtype, ...normalPointList]
            );
            main_connection.release();
            normalList1 = normalPointList.map(sensorname => normalListRows.find(row => row.sensorname === sensorname));
            for (const obj1 of normalList1) {
                for (const obj2 of normalPointRows) {
                    if (obj1.sensorname === obj2.sensorname) {
                        obj1.attribute = obj2.attribute;
                    }
                }
                normalList.push(obj1);
            }
        }

        // const attributes = normalPointRows.map(row => row.attribute);;
        main_connection.release();
        // Connect to the SQL Server using the retrieved credentials
        const config = {
            user: userofdatabase,
            password: passwordofdatabase,
            server: hostofdatabase,
            database: databasename,
            encrypt: true, // Use encryption to secure the connection
            trustServerCertificate: true // Allow self-signed certificates
        };
        const pool = await sql.connect(config);

        const TABLE_TO_USE = table1;
        // const [rows] = await db_connection.query(`DESCRIBE ${TABLE_TO_USE}`);
        const columns = await pool.request()
            .query(`SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = '${TABLE_TO_USE}'`);
        // console.log("ccccccccccccc", columns.recordset[0].COLUMN_NAME);

        const firstcolname = columns.recordset[0].COLUMN_NAME;
        // console.log("first", firstcolname);

        const result = await pool.request().query(`SELECT * FROM ${TABLE_TO_USE} ORDER BY ${firstcolname} ASC`);

        const tableRows = result.recordset;
        // console.log(tableRows);

        const finalArray = tableRows.map(row => {
            const filteredRow = {};
            Object.keys(row).forEach(key => {
                if (key === `${firstcolname}` || attributes.includes(key)) {
                    filteredRow[key] = row[key];}
            });

            return filteredRow;
        });

        var attributelist = [];
        if (tableRows.length > 0) {
            attributelist = tableRows[0];
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
            res.json({ setdata: [[]] });
            return;
        }

        res.json(rows);
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

        res.status(200).json({ message: "log added succesfully" });
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

router.patch('/deleteclient', async (req, res) => {
    try {
        const { clientid } = req.body;

        const connection = await getConnection();

        const query = "UPDATE CredentialMaster SET status = 'inactive' WHERE clientid = ?";
        const [result] = await connection.query(query, [clientid]);
        connection.release();

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: `Credential with clientid ${clientid} not found` });
        }

        res.json({ message: `Credential with clientid ${clientid} updated to status inactive` });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});

router.patch('/deletemanufacturer', async (req, res) => {
    try {
        const { manufacturerid } = req.body;

        const connection = await getConnection();

        const query = "UPDATE ManufacturerMaster SET status = 'inactive' WHERE manufacturerid = ?";
        const [result] = await connection.query(query, [manufacturerid]);
        connection.release();

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: `Manufacturer with manufacturerid ${manufacturerid} not found` });
        }

        res.json({ message: `Manufacturer with manufacturerid ${manufacturerid} updated to status inactive` });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});

router.patch('/deletesystem', async (req, res) => {
    try {
        const { systemid } = req.body;

        const connection = await getConnection();

        const query = "UPDATE SystemMaster SET status = 'inactive' WHERE systemid = ?";
        const [result] = await connection.query(query, [systemid]);
        connection.release();

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: `System with systemid ${systemid} not found` });
        }

        res.json({ message: `System with systemid ${systemid} updated to status inactive` });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});

router.patch('/deleteuser', async (req, res) => {
    try {
        const { userid } = req.body;

        const connection = await getConnection();

        const query = "UPDATE UserMaster SET userstatus = 'inactive' WHERE userid = ?";
        const [result] = await connection.query(query, [userid]);
        connection.release();

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: `User with userid ${userid} not found` });
        }

        res.status(200).json({ message: `User with userid ${userid} updated to status inactive` });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});

router.patch('/updateDescription', async (req, res) => {
    try {
        const { reportid, systems, manufacturer, datebegin, dateend, timebegin, timeend, status1, reportname } = req.body;
        const connection = await getConnection();
        if (
             !datebegin || !timebegin || !dateend || !timeend || !status1 || !reportname ) {
            return res.status(400).json({ message: 'Invalid request' });
        }
        const query = "UPDATE DescriptionMaster SET systems = ?, manufacturer = ?, datebegin = ?, dateend = ?, timebegin = ?, timeend = ?, status1 = ?, reportname = ? WHERE reportid = ?";
        const [result] = await connection.query(query, [systems, manufacturer, datebegin, dateend, timebegin, timeend, status1, reportname, reportid]);
        connection.release();
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: `Description with reportid ${reportid} not found` });
        }
        res.json({ message: `Description with reportid ${reportid} updated successfully` });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});

module.exports = router;