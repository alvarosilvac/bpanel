/*eslint-env node*/

const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');

const app = express();

const logger = require('./logger');
const bcoinRouter = require('./bcoinRouter');
const bcoinSocket = require('./bcoinSocket');

app.set('port', process.env.PORT || 5000);
app.use(bodyParser.json());

/**
  ROUTES
**/
app.use(express.static(path.join(__dirname, '../dist')));
app.get('/', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../webapp/index.html'));
});

// route to get server info
app.get('/server', (req, res) =>
  res.status(200).send({ bcoinUri: process.env.BCOIN_URI })
);

// Path to route calls to bcoin node
app.use('/node', bcoinRouter);

/**
  START SERVERS
**/
app.listen(app.get('port'), () => {
  logger.info('Node app is running on port', app.get('port'));
});

// start up the socket server
bcoinSocket.listen(8000, () => {
  logger.info('Socket server connected');
});
