//Chamando APP
const app = require('../src/app');

//Importando modulos do servidor
const http = require('http');
const debug = require('debug')('nodestr:server');

//Criando aplicação e definindo porta
const port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

//Criando servidor
const server = http.createServer(app);

server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

console.log('API rodando na porta ' + port);

//Função para verificar a porta disponivel e normaliza-la
function normalizePort(val){
    const port = parseInt(val, 10);

    if(isNaN(port)){
        return val;
    }

    if(port >= 0){
        return port;
    }

    return false;
}

//Tratando erros de servidor
function onError(error){
    if(error.syscall !== 'listen'){
        throw error;
    }

    const bind = typeof port === 'string' ?
        'Pipe' + port :
        'Port' + port;

    switch(error.code){
        case  'EACCES':
            console.error(bind + 'requires elevated privileges');
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

//Tratando debug
function onListening(){
    const addr = server.address();
    const bind = typeof addr === 'string'
        ? 'pipe ' + addr
        : 'port ' + addr.port;
    debug('Listening on ' + bind);
}