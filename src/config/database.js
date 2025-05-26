import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { Movie } from '../repositories/Movie.js';

export const AppDataSource = new DataSource({
  type: 'sqlite',
  database: '.data/database.sqlite',
  synchronize: true,
  logging: false,
  entities: [Movie],
  migrations: [],
  subscribers: [],
});

AppDataSource.initialize()
  .then(() => {
    console.log('Data Source has been initialized!');
  })
  .catch((err) => {
    console.error('Error during Data Source initialization:', err);
  });