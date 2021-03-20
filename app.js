require('dotenv-safe').config();
const createError = require('http-errors'),
      http = require('http'),
      express = require('express'),
      path = require('path'),
      cookieParser = require('cookie-parser'),
      logger = require('morgan'),
      bodyParser = require('body-parser'),
      router = require('./routes/router'),
      httpErrorMiddleware = require('./api/interfaces/HttpErrorMiddleware'),
      app = express();

app
  .use(express.json())
  // .use(logger('dev'))
  // .use(bodyParser.json())
  // .use(bodyParser.urlencoded({ extended: false }))
  .use(cookieParser())
  .use('/api', router)
  .use(httpErrorMiddleware)



function onError(error) {
  if (error.syscall !== 'listen') { throw error; }

  var bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port;

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
      console.log('*************************', error)
      throw error;
  }
}

function onListening() {
  var addr = server.address();
  var bind = typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr.port;
}

const server = http.createServer(app);
server.listen(process.env.PORT, () => { console.log('Running on port: ', process.env.PORT) });
server.on('error', onError);
server.on('listening', onListening);
