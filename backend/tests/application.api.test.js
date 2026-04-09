const test = require('node:test');
const assert = require('node:assert/strict');
const request = require('supertest');
const app = require('../src/index');
const db = require('../src/config/db');

const validPayload = {
    firstName: 'Aarav',
    lastName: 'Mehta',
    email: 'aarav.mehta@example.com',
    phone: '9988776655',
    dateOfBirth: '2005-01-20',
    gender: 'Male',
    address: '44 MG Road',
    city: 'Bengaluru',
    state: 'Karnataka',
    country: 'India',
    postalCode: '560001',
    program: 'Engineering',
    gpa: '8.9',
    entranceExamScore: '91',
    highSchoolName: 'National Public School',
    graduationYear: '2024',
    preferredIntake: 'Fall',
    statementOfPurpose: 'I want to pursue engineering to build practical, reliable systems that solve real world problems.'
};

function resetDb() {
    db.exec(`
        DELETE FROM Documents;
        DELETE FROM Applications;
        DELETE FROM Profiles;
        DELETE FROM Users;
        DELETE FROM sqlite_sequence WHERE name IN ('Documents', 'Applications', 'Profiles', 'Users');
    `);
    if (typeof db.ensureDefaultAdmin === 'function') {
        db.ensureDefaultAdmin();
    }
}

test.beforeEach(() => {
    resetDb();
});

test('POST /api/applications returns 400 for invalid phone', async () => {
    const response = await request(app)
        .post('/api/applications')
        .field({ ...validPayload, phone: '98ab765432' })
        .attach('transcript', Buffer.from('sample transcript'), 'transcript.pdf')
        .attach('idDocument', Buffer.from('sample id'), 'id.pdf');

    assert.equal(response.status, 400);
    assert.equal(response.body.error, 'Validation Error');
    assert.ok(response.body.details.phone?.length);
});

test('POST /api/applications returns 400 when required documents are missing', async () => {
    const response = await request(app)
        .post('/api/applications')
        .field(validPayload);

    assert.equal(response.status, 400);
    assert.equal(response.body.error, 'Validation Error');
    assert.ok(response.body.details.transcript?.length);
    assert.ok(response.body.details.idDocument?.length);
});

test('POST /api/applications creates application for valid payload', async () => {
    const response = await request(app)
        .post('/api/applications')
        .field(validPayload)
        .attach('transcript', Buffer.from('sample transcript'), 'transcript.pdf')
        .attach('idDocument', Buffer.from('sample id'), 'id.pdf');

    assert.equal(response.status, 201);
    assert.equal(response.body.message, 'Application submitted successfully');
    assert.ok(response.body.data?.id);
});
