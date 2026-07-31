const server = require('./server.bundle.cjs');
const app = server.default || server;
module.exports = app;
