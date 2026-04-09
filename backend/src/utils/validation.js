const { z } = require('zod');

const nameRegex = /^[A-Za-z][A-Za-z\s'-]{1,49}$/;
const phoneRegex = /^\d{10,15}$/;
const postalCodeRegex = /^[A-Za-z0-9\s-]{4,10}$/;

const registerSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters long'),
    role: z.enum(['Student', 'Admin']).optional()
});

const loginSchema = z.object({
    email: z.string().min(1, 'Username or email is required'),
    password: z.string().min(1, 'Password is required')
});

const applicationSchema = z.object({
    firstName: z.string().trim().regex(nameRegex, 'First name must contain only letters and valid separators'),
    lastName: z.string().trim().regex(nameRegex, 'Last name must contain only letters and valid separators'),
    email: z.string().trim().email('Invalid email address'),
    phone: z.string().trim().regex(phoneRegex, 'Phone must contain 10 to 15 digits only'),
    dateOfBirth: z.string().trim().min(1, 'Date of birth is required'),
    gender: z.enum(['Male', 'Female', 'Other', 'Prefer not to say']),
    address: z.string().trim().min(5, 'Address must be at least 5 characters'),
    city: z.string().trim().min(2, 'City is required'),
    state: z.string().trim().min(2, 'State is required'),
    country: z.string().trim().min(2, 'Country is required'),
    postalCode: z.string().trim().regex(postalCodeRegex, 'Postal code format is invalid'),
    program: z.enum(['Computer Science', 'Business Administration', 'Engineering']),
    gpa: z.coerce.number().min(0, 'CGPA must be 0 or more').max(10, 'CGPA must not exceed 10'),
    entranceExamScore: z.coerce.number().min(0, 'Entrance exam score must be between 0 and 100').max(100, 'Entrance exam score must be between 0 and 100').optional(),
    highSchoolName: z.string().trim().min(2, 'High school name is required'),
    graduationYear: z.coerce.number().int('Graduation year must be a whole number').min(1990, 'Graduation year seems too old').max(new Date().getFullYear() + 1, 'Graduation year is invalid'),
    preferredIntake: z.enum(['Spring', 'Summer', 'Fall', 'Winter']),
    statementOfPurpose: z.string().trim().min(50, 'Statement of purpose must be at least 50 characters').max(1500, 'Statement of purpose must be less than 1500 characters')
});

module.exports = { registerSchema, loginSchema, applicationSchema };
