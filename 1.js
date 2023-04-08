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
