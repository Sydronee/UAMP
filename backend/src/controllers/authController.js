const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../config/db');
const { registerSchema, loginSchema } = require('../utils/validation');

const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-key-for-dev';

class AuthController {
    static async register(req, res) {
        try {
            const parsed = registerSchema.parse(req.body);
            const { email, password, role = 'Student' } = parsed;

            // Check if user exists
            const existingUser = db.prepare('SELECT id FROM Users WHERE email = ?').get(email);
            if (existingUser) {
                return res.status(400).json({ error: 'Email already in use' });
            }

            // Hash password
            const salt = await bcrypt.genSalt(10);
            const hash = await bcrypt.hash(password, salt);

            // Transaction to insert user and empty profile safely
            const registerTx = db.transaction(() => {
                const stmt = db.prepare('INSERT INTO Users (email, password_hash, role) VALUES (?, ?, ?)');
                const info = stmt.run(email, hash, role);
                const userId = info.lastInsertRowid;

                const profileStmt = db.prepare('INSERT INTO Profiles (user_id) VALUES (?)');
                profileStmt.run(userId);

                return userId;
            });

            const userId = registerTx();

            const token = jwt.sign({ id: userId, role }, JWT_SECRET, { expiresIn: '1d' });

            res.status(201).json({ message: 'User registered successfully', token, role });
        } catch (err) {
            if (err.name === 'ZodError') {
                return res.status(400).json({ error: 'Validation Error', details: err.errors });
            }
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }

    static async login(req, res) {
        try {
            const parsed = loginSchema.parse(req.body);
            const { email, password } = parsed;

            const user = db.prepare('SELECT * FROM Users WHERE email = ?').get(email);
            if (!user) {
                return res.status(401).json({ error: 'Invalid Email or Password' });
            }

            const valid = await bcrypt.compare(password, user.password_hash);
            if (!valid) {
                return res.status(401).json({ error: 'Invalid Email or Password' });
            }

            const token = jwt.sign(
                { id: user.id, role: user.role },
                JWT_SECRET,
                { expiresIn: '1d' }
            );

            res.status(200).json({ message: 'Login successful', token, role: user.role });
        } catch (err) {
            if (err.name === 'ZodError') {
                return res.status(400).json({ error: 'Validation Error', details: err.errors });
            }
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
}

module.exports = AuthController;
