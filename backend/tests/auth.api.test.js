const test = require('node:test');
const assert = require('node:assert/strict');
const request = require('supertest');
const app = require('../src/index');

test('default admin can log in with admin/admin123', async () => {
    const response = await request(app)
        .post('/api/auth/login')
        .send({ email: 'admin', password: 'admin123' });

    assert.equal(response.status, 200);
    assert.equal(response.body.role, 'Admin');
    assert.ok(response.body.token);
});
