const { app } = require("../../app");
const http = require('http');
const { SERVER } = require("../config");
const dotenv = require('dotenv');

dotenv.config();

function normalizePort(val:any) {
    const portNumber = parseInt(val, 10);
    if (isNaN(portNumber)) {
        return val;  // named pipe
    }
    if (portNumber >= 0) {
        return portNumber;  // port number
    }
    return false;
}

const port = normalizePort(SERVER.PORT || '3000');
app.set('port', port);

const server = http.createServer(app);

server.listen(port, '0.0.0.0', () => {
    console.info(`Server is listening on port ${port}`);
});

server.on('error', onError);
server.on('listening', onListening);
server.setTimeout(3600 * 1000);

function onError(error:any) {
    if (error.syscall !== 'listen') {
        throw error;
    }

    const bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port;

    switch (error.code) {
        case 'EACCES':
            console.error(bind + ' requires elevated privileges');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(bind + ' is already in use');
            process.exit(1);
            break;
        default:
            throw error;
    }
}

function onListening() {
    const addr = server.address();
    const bind = typeof addr === 'string' ? 'pipe ' + addr : 'port ' + (addr?.port || '');
    console.info('Listening on ' + bind);
}
