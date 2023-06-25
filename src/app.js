
const dotenv = require("dotenv")
dotenv.config({ path: ".env" });
const express = require("express");
const cors = require('cors');
const bodyParser = require("body-parser");
require("./db/Mysqlconnection");
PORT = process.env.PORT || 3000;

// const ARS = require("./routers/ARS2");
const ARS3 = require("./routers/ARS3");

const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true, parameterLimit: 100000, limit: "50mb" }));

app.use(express.json({ limit: '50mb' }));

app.use('/api', ARS3);

app.listen(PORT, () => {
    console.log(`connection is setup at ${PORT}`);
});
