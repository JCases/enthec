import bodyParser from 'body-parser';
import cors from 'cors';
import express from 'express';

import routes from './routes';

class App {
  public app: express.Application;

  constructor() {
    this.app = express();
    this.middlewares();
    this.routes();
  }

  private middlewares() {
    this.app.use(bodyParser.json({ limit: '5mb' }));
    this.app.use(bodyParser.urlencoded({ extended: false }));
    this.app.use(cors());
  }

  private routes() {
    this.app.use('/', routes);
    this.app.use('/', (req, res) => {
      res.json('Hello Enthec!');
    });
  }
}

const app = new App();
export default app.app;
