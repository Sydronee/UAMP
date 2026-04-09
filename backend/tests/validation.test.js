const test = require('node:test');
const assert = require('node:assert/strict');
const { applicationSchema } = require('../src/utils/validation');

const validApplication = {
    firstName: 'Alice',
    lastName: 'Johnson',
    email: 'alice.johnson@example.com',
    phone: '9876543210',
    dateOfBirth: '2004-05-12',
    gender: 'Female',
    address: '221B Baker Street',
    city: 'London',
    state: 'Greater London',
    country: 'UK',
    postalCode: 'NW16XE',
    program: 'Computer Science',
    gpa: 8.7,
    entranceExamScore: 83,
    highSchoolName: 'Central High School',
    graduationYear: 2024,
    preferredIntake: 'Fall',
    statementOfPurpose: 'I am passionate about computing and want to build secure and useful software systems for society.'
};

test('applicationSchema accepts valid payload', () => {
    const parsed = applicationSchema.safeParse(validApplication);
    assert.equal(parsed.success, true);
});

test('applicationSchema rejects alphabetic characters in phone', () => {
    const parsed = applicationSchema.safeParse({
        ...validApplication,
        phone: '98AB543210'
    });

    assert.equal(parsed.success, false);
    assert.ok(parsed.error.flatten().fieldErrors.phone?.length);
});

test('applicationSchema rejects CGPA above 10', () => {
    const parsed = applicationSchema.safeParse({
        ...validApplication,
        gpa: 10.5
    });

    assert.equal(parsed.success, false);
    assert.ok(parsed.error.flatten().fieldErrors.gpa?.length);
});

test('applicationSchema rejects numeric characters in firstName', () => {
    const parsed = applicationSchema.safeParse({
        ...validApplication,
        firstName: 'R0han'
    });

    assert.equal(parsed.success, false);
    assert.ok(parsed.error.flatten().fieldErrors.firstName?.length);
});
