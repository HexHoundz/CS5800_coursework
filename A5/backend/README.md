# Hello World Web Service – Unit Testing (Assignment 4)

## Overview
This assignment adds **automated unit testing** to the backend of the Hello World Web Service using:
- **Jest**: JavaScript testing framework
- **Supertest**: HTTP assertion library for testing Express routes

The tests ensure that the backend `/api/hello` route behaves as expected.

## Before and After Running the Project

These tests simulate HTTP requests to verify that the backend is functioning correctly.

### Test Case 1: Successful Response
- **Test Description**: Sends a GET request to `/api/hello`.
- **Expected Behavior**:
  - HTTP status code: `200 OK`
  - Response body: `{ "message": "Hello World" }`

This confirms that the backend route is accessible and returns the correct JSON message.

### Test Case 2: Route Existence
- **Test Description**: Checks that the `/api/hello` route does not return a 404 error.
- **Expected Behavior**:
  - HTTP status code: **not 404**

This ensures that the route is properly defined and reachable in the Express app.

When the backend is running, a GET request to: http://localhost:4000/api/hello

Should return:

```json
{ "message": "Hello World" }
```
## Running the Project

### Backend
```bash
cd backend
npm install
npm start

### Tests
```bash
cd backend
npm install
npm test

## Full-stack deployment via Render

Front-end link: https://hexhoundz-frontend-helloworld.onrender.com
Back-end link: https://hexhoundz-backend.onrender.com/api/hello