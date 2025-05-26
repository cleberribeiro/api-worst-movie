import express from 'express';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import swaggerUi from 'swagger-ui-express';

import movieRoutes from './routes/movieRoutes.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const swaggerFile = JSON.parse(readFileSync(join(__dirname, '../docs/swagger.json'), 'utf8'));

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/v1/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerFile));

app.use('/v1/movies', movieRoutes);

export default app;
