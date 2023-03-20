const express = require('express');
const router = express.Router();
const mysql = require('mysql2/promise');
const { getConnection } = require('../db/connection');

