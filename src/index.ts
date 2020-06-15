import cors from 'cors';
import express from 'express';
import morgan from 'morgan';

import { accessControlAllowHeaders, authorizationToken } from './utils/helpers';

const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const routes = require('./routes/index');

const dev = process.env.NODE_ENV !== 'production';
const app = express();

dotenv.config({
  path: '.env.' + (process.env.API || process.env.NODE_ENV)
});

app.use(accessControlAllowHeaders);
app.all('*', authorizationToken);

app.options('*', cors());

if (dev) {
  app.use(morgan('dev'));
}

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use('/api', routes);

app.listen(4000);
