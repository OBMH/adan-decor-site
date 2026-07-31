const server = require('./server.bundle.js');
const app = server.default || server;
module.exports = app;
