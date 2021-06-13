const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const dbManager = require('./util/DBManager');
const mailManager = require('./util/MailManager')
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}))

app.use(express.static(path.join(__dirname, '../client/dist')))
app.use(express.static(path.join(__dirname, '../public')))

app.use(require('./router'))

global.db = new dbManager();
global.db.init();

global.mail = new mailManager();

module.exports = app;