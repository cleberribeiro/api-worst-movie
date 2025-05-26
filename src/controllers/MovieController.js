import { AppDataSource } from '../config/database.js';
import { Movie } from '../repositories/Movie.js';
import csvParser from 'csv-parser';
import fs from 'fs';
import Joi from 'joi';

const movieRepository = AppDataSource.getRepository(Movie);

const movieSchema = Joi.object({
  year: Joi.number().required(),
  title: Joi.string().max(255).required(),
  studios: Joi.string().max(255).required(),
  producers: Joi.string().max(255).required(),
  winner: Joi.string().max(3).allow('').optional(),
});

export const uploadMovies = async (req, res) => {
  const results = [];
  fs.createReadStream(req.file.path)
    .pipe(csvParser({ separator: ';' }))
    .on('data', (data) => {
      const { error } = movieSchema.validate(data);
      if (!error) results.push(data);
    })
    .on('end', async () => {
      await movieRepository.insert(results);
      res.status(201).json({ message: 'Movies uploaded successfully!' });
    });
};

export const listMovies = async (req, res) => {
  const movies = await movieRepository.find();
  res.json(movies);
};

export const editMovie = async (req, res) => {
  const movie = await movieRepository.findOneBy({ id: req.params.id });
  if (!movie) return res.status(404).json({ message: 'Movie not found' });

  Object.assign(movie, req.body);
  await movieRepository.save(movie);
  res.json(movie);
};

export const deleteMovie = async (req, res) => {
  const movie = await movieRepository.findOneBy({ id: req.params.id });
  if (!movie) return res.status(404).json({ message: 'Movie not found' });

  await movieRepository.remove(movie);
  res.status(204).send();
};

export const getAwardsInterval = async (req, res) => {
  const winnerMovies = await movieRepository.find({ where: { winner: 'yes' } });
   
  const producerWins = {};

  winnerMovies.forEach(movie => {
    const producers = movie.producers
      .split(',') // separa por vírgula e 'and'
      .map(p => p.trim());

    producers.forEach(producer => {
      if (!producerWins[producer]) {
        producerWins[producer] = [];
      }
      producerWins[producer].push(movie.year);
    });
  });

  const intervals = [];

  for (const producer in producerWins) {
    const years = producerWins[producer].sort((a, b) => a - b);

    if (years.length < 2) continue;

    for (let i = 1; i < years.length; i++) {
      intervals.push({
        producer,
        interval: years[i] - years[i - 1],
        previousWin: years[i - 1],
        followingWin: years[i]
      });
    }
  }

  const minInterval = Math.min(...intervals.map(i => i.interval));
  const maxInterval = Math.max(...intervals.map(i => i.interval));

  const result = {
    min: intervals.filter(i => i.interval === minInterval),
    max: intervals.filter(i => i.interval === maxInterval)
  };

  res.json(result);
};
