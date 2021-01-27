import * as http from 'http';

import App from './app';
import Enviroment from './utils/environment';

App.set('port', Enviroment.port);

const server = http.createServer(App);

const onListening = (): void => {
  const addr = server.address();
  const bind = typeof addr === 'string' ? `pipe ${addr}` : `port ${addr!.port}`;
  console.info(`Listening on ${bind}`);
};

server.listen(Enviroment.port);
server.on('listening', onListening);
