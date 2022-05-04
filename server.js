const http = require('http');
const { v4: uuidv4 } = require('uuid');
const headers = require('./conf/headers');
const successHandler = require('./handlers/sucessHandlers');
const errorHandler = require('./handlers/errorHandlers');
const todos = [];

const requestListener = (req, res) => {};

const server = http.createServer(requestListener);
server.listen(process.env.PORT || 3005);
