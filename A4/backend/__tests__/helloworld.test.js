const request = require('supertest');
const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.get('/api/hello', (req, res) => {
  res.json({ message: 'Hello World' });
});

describe('GET /api/hello', () => {
  it('should return Hello World message', async () => {
    const res = await request(app).get('/api/hello');
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ message: 'Hello World' });
  });

  it('should not return a 404 for the hello route', async () => {
    const res = await request(app).get('/api/hello');
    expect(res.statusCode).not.toBe(404);
  });
});