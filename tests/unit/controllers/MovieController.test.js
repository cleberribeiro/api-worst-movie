import { describe, it, before, beforeEach, after, mock } from 'node:test';
import assert from 'node:assert/strict';
import { uploadMovies, listMovies, editMovie, deleteMovie, getAwardsInterval } from '../../../src/controllers/MovieController.js';
import fs from 'fs';

// Mock dependencies
const mockMovieRepository = {
  find: mock.fn(),
  findOneBy: mock.fn(),
  save: mock.fn(),
  remove: mock.fn(),
  insert: mock.fn()
};

// Mock AppDataSource
mock.method(
  { getRepository: () => mockMovieRepository },
  'getRepository',
  () => mockMovieRepository
);

// Mock the database import with our mocked version
mock.module('../../../src/config/database.js', () => ({
  AppDataSource: {
    getRepository: () => mockMovieRepository
  }
}));

describe('MovieController Tests', () => {
  let req, res;

  beforeEach(() => {
    // Reset mock calls
    mockMovieRepository.find.mock.resetCalls();
    mockMovieRepository.findOneBy.mock.resetCalls();
    mockMovieRepository.save.mock.resetCalls();
    mockMovieRepository.remove.mock.resetCalls();
    mockMovieRepository.insert.mock.resetCalls();

    // Setup req and res objects for each test
    req = {
      params: {},
      body: {},
      file: { path: 'test-file-path.csv' }
    };
    
    res = {
      status: mock.fn(() => res),
      json: mock.fn(),
      send: mock.fn()
    };
  });

  describe('listMovies', () => {
    it('should return all movies', async () => {
      const mockMovies = [
        { id: 1, title: 'Movie 1', year: 2020, studios: 'Studio A', producers: 'Producer X', winner: 'yes' },
        { id: 2, title: 'Movie 2', year: 2021, studios: 'Studio B', producers: 'Producer Y', winner: 'no' }
      ];
      
      mockMovieRepository.find.mock.mockImplementation(() => Promise.resolve(mockMovies));
      
      await listMovies(req, res);
      
      assert.strictEqual(mockMovieRepository.find.mock.calls.length, 1, 'find should be called once');
      assert.strictEqual(res.json.mock.calls.length, 1, 'res.json should be called once');
      assert.deepStrictEqual(res.json.mock.calls[0].arguments[0], mockMovies, 'should return the movies');
    });
  });

  describe('editMovie', () => {
    it('should update a movie and return it', async () => {
      const mockMovie = { 
        id: 1, 
        title: 'Old Title', 
        year: 2020, 
        studios: 'Studio A', 
        producers: 'Producer X', 
        winner: 'yes' 
      };
      
      const updateData = { 
        title: 'New Title', 
        year: 2021 
      };
      
      req.params.id = 1;
      req.body = updateData;
      
      mockMovieRepository.findOneBy.mock.mockImplementation(() => Promise.resolve(mockMovie));
      mockMovieRepository.save.mock.mockImplementation((movie) => Promise.resolve(movie));
      
      await editMovie(req, res);
      
      assert.strictEqual(mockMovieRepository.findOneBy.mock.calls.length, 1, 'findOneBy should be called once');
      assert.deepStrictEqual(mockMovieRepository.findOneBy.mock.calls[0].arguments[0], { id: '1' }, 'should search by provided id');
      
      assert.strictEqual(mockMovieRepository.save.mock.calls.length, 1, 'save should be called once');
      
      const expectedUpdatedMovie = { 
        ...mockMovie, 
        ...updateData 
      };
      
      assert.strictEqual(res.json.mock.calls.length, 1, 'res.json should be called once');
      assert.deepStrictEqual(res.json.mock.calls[0].arguments[0], expectedUpdatedMovie, 'should return the updated movie');
    });
    
    it('should return 404 if movie not found', async () => {
      req.params.id = 99;
      
      mockMovieRepository.findOneBy.mock.mockImplementation(() => Promise.resolve(null));
      
      await editMovie(req, res);
      
      assert.strictEqual(mockMovieRepository.findOneBy.mock.calls.length, 1, 'findOneBy should be called once');
      assert.strictEqual(res.status.mock.calls.length, 1, 'res.status should be called once');
      assert.strictEqual(res.status.mock.calls[0].arguments[0], 404, 'status should be 404');
      assert.strictEqual(res.json.mock.calls.length, 1, 'res.json should be called once');
      assert.deepStrictEqual(res.json.mock.calls[0].arguments[0], { message: 'Movie not found' }, 'should return error message');
    });
  });

  describe('deleteMovie', () => {
    it('should delete a movie and return 204', async () => {
      const mockMovie = { 
        id: 1, 
        title: 'Movie to Delete', 
        year: 2020, 
        studios: 'Studio A', 
        producers: 'Producer X', 
        winner: 'yes' 
      };
      
      req.params.id = 1;
      
      mockMovieRepository.findOneBy.mock.mockImplementation(() => Promise.resolve(mockMovie));
      mockMovieRepository.remove.mock.mockImplementation(() => Promise.resolve());
      
      await deleteMovie(req, res);
      
      assert.strictEqual(mockMovieRepository.findOneBy.mock.calls.length, 1, 'findOneBy should be called once');
      assert.strictEqual(mockMovieRepository.remove.mock.calls.length, 1, 'remove should be called once');
      assert.deepStrictEqual(mockMovieRepository.remove.mock.calls[0].arguments[0], mockMovie, 'should remove the found movie');
      assert.strictEqual(res.status.mock.calls.length, 1, 'res.status should be called once');
      assert.strictEqual(res.status.mock.calls[0].arguments[0], 204, 'status should be 204');
      assert.strictEqual(res.send.mock.calls.length, 1, 'res.send should be called once');
    });
    
    it('should return 404 if movie not found', async () => {
      req.params.id = 99;
      
      mockMovieRepository.findOneBy.mock.mockImplementation(() => Promise.resolve(null));
      
      await deleteMovie(req, res);
      
      assert.strictEqual(mockMovieRepository.findOneBy.mock.calls.length, 1, 'findOneBy should be called once');
      assert.strictEqual(res.status.mock.calls.length, 1, 'res.status should be called once');
      assert.strictEqual(res.status.mock.calls[0].arguments[0], 404, 'status should be 404');
      assert.strictEqual(res.json.mock.calls.length, 1, 'res.json should be called once');
      assert.deepStrictEqual(res.json.mock.calls[0].arguments[0], { message: 'Movie not found' }, 'should return error message');
    });
  });

  describe('uploadMovies', () => {
    it('should process CSV and insert movies', async () => {
      // Create a mock for the CSV parser stream
      const mockCsvStream = {
        pipe: mock.fn().mockReturnThis(),
        on: mock.fn().mockImplementation(function(event, callback) {
          if (event === 'data') {
            // Simulate CSV data
            callback({ year: 2022, title: 'Test Movie', studios: 'Test Studio', producers: 'Test Producer', winner: 'yes' });
            callback({ year: 2023, title: 'Test Movie 2', studios: 'Test Studio 2', producers: 'Test Producer 2', winner: '' });
          } else if (event === 'end') {
            // Simulate end of stream
            callback();
          }
          return this;
        })
      };
      
      // Mock fs.createReadStream
      mock.method(
        fs,
        'createReadStream',
        () => mockCsvStream
      );
      
      mockMovieRepository.insert.mock.mockImplementation(() => Promise.resolve());
      
      await uploadMovies(req, res);
      
      assert.strictEqual(fs.createReadStream.mock.calls.length, 1, 'createReadStream should be called once');
      assert.strictEqual(mockCsvStream.pipe.mock.calls.length, 1, 'pipe should be called once');
      assert.strictEqual(mockMovieRepository.insert.mock.calls.length, 1, 'insert should be called once');
      
      // Check that 2 movies were inserted
      assert.strictEqual(mockMovieRepository.insert.mock.calls[0].arguments[0].length, 2, 'should insert 2 movies');
      
      assert.strictEqual(res.status.mock.calls.length, 1, 'res.status should be called once');
      assert.strictEqual(res.status.mock.calls[0].arguments[0], 201, 'status should be 201');
      assert.strictEqual(res.json.mock.calls.length, 1, 'res.json should be called once');
      assert.deepStrictEqual(res.json.mock.calls[0].arguments[0], { message: 'Movies uploaded successfully!' }, 'should return success message');
    });
  });

  describe('getAwardsInterval', () => {
    it('should calculate min and max award intervals', async () => {
      const mockWinnerMovies = [
        { id: 1, title: 'Movie 1', year: 2000, studios: 'Studio A', producers: 'Producer X', winner: 'yes' },
        { id: 2, title: 'Movie 2', year: 2002, studios: 'Studio B', producers: 'Producer X', winner: 'yes' },
        { id: 3, title: 'Movie 3', year: 2015, studios: 'Studio C', producers: 'Producer X', winner: 'yes' },
        { id: 4, title: 'Movie 4', year: 2010, studios: 'Studio D', producers: 'Producer Y', winner: 'yes' },
        { id: 5, title: 'Movie 5', year: 2020, studios: 'Studio E', producers: 'Producer Y', winner: 'yes' }
      ];
      
      mockMovieRepository.find.mock.mockImplementation(() => Promise.resolve(mockWinnerMovies));
      
      await getAwardsInterval(req, res);
      
      assert.strictEqual(mockMovieRepository.find.mock.calls.length, 1, 'find should be called once');
      assert.deepStrictEqual(mockMovieRepository.find.mock.calls[0].arguments[0], { where: { winner: 'yes' } }, 'should search for winner movies');
      
      assert.strictEqual(res.json.mock.calls.length, 1, 'res.json should be called once');
      
      const result = res.json.mock.calls[0].arguments[0];
      
      // Verify the structure of the result
      assert.ok(result.min, 'should have min property');
      assert.ok(result.max, 'should have max property');
      assert.ok(Array.isArray(result.min), 'min should be an array');
      assert.ok(Array.isArray(result.max), 'max should be an array');
      
      // Producer X has intervals of 2 years (2000-2002) and 13 years (2002-2015)
      // Producer Y has interval of 10 years (2010-2020)
      // So min should be 2 and max should be 13
      
      const minInterval = result.min[0].interval;
      const maxInterval = result.max[0].interval;
      
      assert.strictEqual(minInterval, 2, 'min interval should be 2');
      assert.strictEqual(maxInterval, 13, 'max interval should be 13');
    });
    
    it('should handle when there are no winner movies', async () => {
      mockMovieRepository.find.mock.mockImplementation(() => Promise.resolve([]));
      
      await getAwardsInterval(req, res);
      
      assert.strictEqual(res.json.mock.calls.length, 1, 'res.json should be called once');
      
      const result = res.json.mock.calls[0].arguments[0];
      
      // Should have empty arrays for min and max since there are no intervals
      assert.deepStrictEqual(result, { min: [], max: [] }, 'should return empty min and max arrays');
    });
  });
});
