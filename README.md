# UAMP

Welcome to the UAMP repository. This project consists of a Node.js backend, a React (Vite) frontend, and an End-to-End (E2E) testing suite using Java, Maven, JUnit, and Selenium.

## Project Structure

- `backend/`: Express.js server providing the REST API. Contains controllers, routes, models, and services.
- `frontend/`: React frontend powered by Vite and Tailwind CSS. Contains user and admin UI components.
- `e2e-tests-java/`: End-to-end tests built with Java, JUnit 5, and Selenium WebDriver.
- `e2e-tests/`: Legacy Python tests.

## Prerequisites

Ensure you have the following installed on your system:
- **Node.js** (v18 or higher recommended) & **npm**
- **Java 17+** (for running the E2E tests)
- **Maven** (for managing Java dependencies and running tests)
- **Google Chrome** (for Selenium E2E tests)

## Setup & Running

### 1. Backend API

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up your `.env` file (you can copy a `.env.example` if available).
4. Start the backend server:
   ```bash
   npm start
   # or with nodemon: npm run dev
   ```

### 2. Frontend Development Server

1. Open a new terminal and navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server (runs on `http://localhost:5173` by default):
   ```bash
   npm run dev
   ```

### 3. End-to-End Tests (Java/Selenium)

Our E2E tests verify the application via browser automation. **Make sure your frontend and backend servers are running before executing the tests.**

1. Open a new terminal and navigate to the E2E test directory:
   ```bash
   cd e2e-tests-java
   ```
2. Run the test suite:
   ```bash
   mvn test
   ```
The tests will run headlessly via Selenium. Once complete, Maven will log the test success/failure summaries to the console.

## Initial Commit

Ensure you commit the recent updates:
```bash
git init
git add .
git commit -m "Initial commit: Setup backend, frontend, and Java/JUnit/Selenium E2E tests"
```
