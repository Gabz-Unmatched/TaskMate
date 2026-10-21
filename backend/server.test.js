
const request = require('supertest');
const fs = require('fs');
const os = require('os');
const path = require('path');

const testDbPath = path.join(
  os.tmpdir(),
  `taskmate-test-${process.pid}.db`
);

process.env.DB_PATH = testDbPath;

const app = require('./server');

describe('TaskMate Assignments API', () => {
  afterAll(() => {
    app.closeDatabase();

    for (const suffix of ['', '-wal', '-shm', '-journal']) {
      const file = testDbPath + suffix;

      if (fs.existsSync(file)) {
        fs.unlinkSync(file);
      }
    }
  });

  test('GET /api/assignments returns a list', async () => {
    const response = await request(app).get('/api/assignments');

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  test('POST /api/assignments creates an assignment', async () => {
    const response = await request(app)
      .post('/api/assignments')
      .send({
        title: 'DA3 Testing',
        subject: 'Software Engineering',
        deadline: '2026-10-30',
        priority: 'High'
      });

    expect(response.status).toBe(201);
    expect(response.body.title).toBe('DA3 Testing');
    expect(response.body.subject).toBe('Software Engineering');
    expect(response.body.priority).toBe('High');
  });

  test('POST rejects an assignment without a title', async () => {
    const response = await request(app)
      .post('/api/assignments')
      .send({ subject: 'Software Engineering' });

    expect(response.status).toBe(400);
    expect(response.body.error).toBe('Title and subject are required');
  });

  
  test('PUT updates an existing assignment', async () => {
    const created = await request(app)
      .post('/api/assignments')
      .send({
        title: 'Original Title',
        subject: 'Software Engineering',
        deadline: '2026-10-30',
        priority: 'Medium'
      });

    const id = created.body.id;

    const response = await request(app)
      .put(`/api/assignments/${id}`)
      .send({
        title: 'Updated Title',
        subject: 'Software Engineering',
        deadline: '2026-11-05',
        priority: 'High'
      });

    expect(response.status).toBe(200);
    expect(response.body.title).toBe('Updated Title');
    expect(response.body.priority).toBe('High');
  });

  test('PUT returns 404 for a nonexistent assignment', async () => {
    const response = await request(app)
      .put('/api/assignments/999999')
      .send({
        title: 'Missing',
        subject: 'Software Engineering',
        deadline: '2026-11-05',
        priority: 'High'
      });

    expect(response.status).toBe(404);
    expect(response.body.error).toBe('Assignment not found');
  });

  test('DELETE removes an existing assignment', async () => {
    const created = await request(app)
      .post('/api/assignments')
      .send({
        title: 'Assignment to Delete',
        subject: 'Software Engineering',
        deadline: '2026-10-30',
        priority: 'Low'
      });

    const id = created.body.id;

    const response = await request(app)
      .delete(`/api/assignments/${id}`);

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);

    const check = await request(app)
      .get('/api/assignments');

    expect(check.body.some(item => item.id === id)).toBe(false);
  });

  test('DELETE returns 404 for a nonexistent assignment', async () => {
    const response = await request(app)
      .delete('/api/assignments/999999');

    expect(response.status).toBe(404);
    expect(response.body.error).toBe('Assignment not found');
  });

  
  test('POST trims whitespace from title and subject', async () => {
    const response = await request(app)
      .post('/api/assignments')
      .send({
        title: '  Networks Assignment  ',
        subject: '  Computer Networks  ',
        deadline: '2026-10-30',
        priority: 'Medium'
      });

    expect(response.status).toBe(201);
    expect(response.body.title).toBe('Networks Assignment');
    expect(response.body.subject).toBe('Computer Networks');
  });



  
});
