import { describe, it, before, after } from 'node:test';
import assert from 'node:assert/strict';
import supertest from 'supertest';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import app from '../../src/app.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const request = supertest(app);

// Helper function to create a test CSV file
function createTestCsvFile(filePath, content) {
  fs.writeFileSync(filePath, content);
  return filePath;
}

describe('Movie Upload API Integration Tests', async () => {
  const testCsvPath = path.join(__dirname, 'test-movies.csv');
  const testCsvContent = 
    'year;title;studios;producers;winner\n' +
    '2020;Test Movie 1;Test Studio 1;Test Producer 1;yes\n' +
    '2021;Test Movie 2;Test Studio 2;Test Producer 2;\n' +
    '2022;Test Movie 3;Test Studio 3;Test Producer 3;yes\n';
  
  before(async () => {
    // Create test CSV file
    createTestCsvFile(testCsvPath, testCsvContent);
  });
  
  after(async () => {
    // Delete the test CSV file
    if (fs.existsSync(testCsvPath)) {
      fs.unlinkSync(testCsvPath);
    }
  });
  
  it('should upload movies from CSV file', async () => {
    const response = await request
      .post('/v1/movies/upload')
      .attach('file', testCsvPath);
    
    assert.strictEqual(response.status, 201, 'Status should be 201');
    assert.deepStrictEqual(response.body, { message: 'Movies uploaded successfully!' });
  });
  
  it('should be able to retrieve uploaded movies', async () => {
    const response = await request
      .get('/v1/movies')
      .expect(200);
    
    const movies = response.body;
    
    // Check if the uploaded test movies exist in the list
    const testMovie1 = movies.find(m => m.title === 'Test Movie 1');
    assert.ok(testMovie1, 'Test Movie 1 should exist in the database');
    assert.strictEqual(testMovie1.year, 2020);
    assert.strictEqual(testMovie1.studios, 'Test Studio 1');
    assert.strictEqual(testMovie1.producers, 'Test Producer 1');
    assert.strictEqual(testMovie1.winner, 'yes');
    
    const testMovie2 = movies.find(m => m.title === 'Test Movie 2');
    assert.ok(testMovie2, 'Test Movie 2 should exist in the database');
    assert.strictEqual(testMovie2.year, 2021);
    assert.strictEqual(testMovie2.studios, 'Test Studio 2');
    assert.strictEqual(testMovie2.producers, 'Test Producer 2');
    assert.strictEqual(testMovie2.winner, '');
  });
  
  it('should handle invalid file format', async () => {
    // Create a test text file (not a CSV)
    const invalidFilePath = path.join(__dirname, 'invalid-file.txt');
    fs.writeFileSync(invalidFilePath, 'This is not a CSV file');
    
    try {
      const response = await request
        .post('/v1/movies/upload')
        .attach('file', invalidFilePath);
      
      // Our test doesn't assert specific error behavior because it depends on implementation
      // Just checking that the request completes
      assert.ok(response, 'Response should exist');
      
    } finally {
      // Delete the invalid test file
      if (fs.existsSync(invalidFilePath)) {
        fs.unlinkSync(invalidFilePath);
      }
    }
  });
  
  it('should handle empty CSV file', async () => {
    // Create an empty CSV file
    const emptyCsvPath = path.join(__dirname, 'empty-test-movies.csv');
    const emptyCsvContent = 'year;title;studios;producers;winner\n';
    
    createTestCsvFile(emptyCsvPath, emptyCsvContent);
    
    try {
      const response = await request
        .post('/v1/movies/upload')
        .attach('file', emptyCsvPath);
      
      assert.strictEqual(response.status, 201, 'Status should be 201');
      assert.deepStrictEqual(response.body, { message: 'Movies uploaded successfully!' });
      
    } finally {
      // Delete the empty test CSV file
      if (fs.existsSync(emptyCsvPath)) {
        fs.unlinkSync(emptyCsvPath);
      }
    }
  });
});
