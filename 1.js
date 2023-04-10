const sql = require('mssql');
router.post('/description', async (req, res) => {
      try {
                // const { manufacturer, datebegin, timebegin, dateend, timeend, timetype, databasename, table1, formtype, status1, prechandler, nexthandler, count, reportname } = req.body;
        const {
                userid,reportid,utilityid,version,clientid,systems,manufacturer,datebegin,timebegin,dateend,timeend,timetype,databasename,table1,formtype,status1,prechandler,nexthandler,count,reportname
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
// {
// activity:"active",
// attribute:"1",
// head1:"305.2",
// head2:"LT-01",
// inuse:"N",
// sensorname:"S1",
// unit:"LTRS",
// }


[
  [1, 3, 5,-,-,-],
  [6, 8, 10,-,-,-],
  [11, 13, 15,-,-,-],
  [16, 18, 20,-,-,-]
]












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
        // console.log("hiiiiiiiiiiiiiii", normalPointRows)
        var setList = []
        const setPointList = setPointRows.map(row => row.sensorname);
        if (setPointList.length > 0) {
            const setPointListValues = setPointList.map(() => '?').join(',');
            const [setListRows] = await main_connection.query(
                `SELECT sensorname,head1,head2,unit,inuse,activity,attribute FROM sensorlist WHERE formtype = ? AND sensorname IN (${setPointListValues})`,
                [formtype, ...setPointList]
            );
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
            // console.log("kkkkkkkk",normalPointList)
            normalList1 = normalPointList.map(sensorname => normalListRows.find(row => row.sensorname === sensorname));
            // Get attribute types from NormalList
            // console.log("ooooooooooo",normalList1);

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

        // const { hostofdatabase, userofdatabase, passwordofdatabase, databasename } = credential_rows[0];

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

        const TABLE_TO_USE = req.body.tablename;
        // const [rows] = await db_connection.query(`DESCRIBE ${TABLE_TO_USE}`);
        const columns = await pool.request()
            .query(`SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = '${tablename}'`);

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