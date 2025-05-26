# Awesome Project Build with TypeORM

# Worst Movie API

## Description
This API allows users to manage a database of movies, including uploading data from a CSV file, performing CRUD operations, and calculating awards intervals for producers.

## Requirements
- Node.js
- SQLite3

## Installation
1. Clone the repository:
   ```bash
   git clone <repository-url>
   ```
2. Navigate to the project directory:
   ```bash
   cd api-worst-movie
   ```
3. Install dependencies:
   ```bash
   npm install
   ```

## Running the Application
1. Start the server:
   ```bash
   npm start
   ```
2. Access the API at `http://localhost:3000`.
3. View the Swagger documentation at `http://localhost:3000/v1/api-docs`.

## Endpoints
- `POST /v1/movies/upload`: Upload a CSV file.
- `GET /v1/movies`: List all movies.
- `PUT /v1/movies/:id`: Edit a movie by ID.
- `DELETE /v1/movies/:id`: Delete a movie by ID.
- `GET /v1/movies/awards`: Get awards intervals.

## Testing
This project includes both unit tests and end-to-end (e2e) tests using Node.js built-in test runner.

### Running Unit Tests
Unit tests verify individual components of the application in isolation:

```bash
npm test
```

This command runs all unit tests located in the `tests/unit` directory.

### Running End-to-End Tests
E2E tests verify the application's behavior by simulating real user scenarios and interacting with the API:

```bash
npm run test:e2e
```

This command runs all end-to-end tests located in the `tests/e2e` directory.

### Test Coverage
To run tests with coverage reporting:

```bash
npm run test:coverage
```

This will generate a coverage report showing:
- Line coverage
- Branch coverage
- Function coverage
- Statement coverage

The coverage report will be available in the console output and as HTML files in the `coverage` directory.

### Test Structure
- **Unit tests**: Located in `tests/unit/`
  - Test individual controllers, services, and repositories
  - Use mocks to isolate components
  - Fast execution, focused scope

- **E2E tests**: Located in `tests/e2e/`
  - Test complete API endpoints
  - Interact with the application through HTTP requests
  - Validate full request-response cycles
  - Test file uploads and data processing

### Writing New Tests
- Follow the existing patterns in the test files
- Use the Node.js built-in `test`, `describe`, and `it` functions
- Use `assert` from Node.js for assertions

## Notes
- The database is configured to use SQLite3 in memory mode for development and testing.
- Tests use the Node.js built-in test runner, available in Node.js 18+.
- End-to-end tests use Supertest to simulate HTTP requests.
- Test data is automatically cleaned up after test execution.

Steps to run this project:

1. Run `npm i` command
2. Setup database settings inside `data-source.ts` file
3. Run `npm start` command
