const express = require('express');
const cors = require('cors');
const path = require('path');

const apiRoutes = require('./routes');
const { seedIfEmpty } = require('./seed');

// Ensure demo data exists on startup
seedIfEmpty();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '..', '..', 'frontend')));

app.use('/api', apiRoutes);

module.exports = app;
