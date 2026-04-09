const ApplicationService = require('../services/applicationService');
const db = require('../config/db');
const { applicationSchema } = require('../utils/validation');

class ApplicationController {
    static async create(req, res) {
        try {
            const parsed = applicationSchema.safeParse(req.body);
            if (!parsed.success) {
                return res.status(400).json({
                    error: 'Validation Error',
                    details: parsed.error.flatten().fieldErrors
                });
            }

            if (!req.files || !req.files.transcript || !req.files.idDocument) {
                return res.status(400).json({
                    error: 'Validation Error',
                    details: {
                        transcript: !req.files || !req.files.transcript ? ['Transcript is required'] : undefined,
                        idDocument: !req.files || !req.files.idDocument ? ['ID document is required'] : undefined
                    }
                });
            }

            const data = parsed.data;
            
            // For testing/mock purposes where Auth is not fully wired on frontend yet.
            let userId;
            if (req.user && req.user.id) {
                userId = req.user.id;
            } else {
                // Ensure a deterministic test user exists for submissions without auth.
                const existingUser = db.prepare('SELECT id FROM Users WHERE email = ?').get(data.email);
                if (existingUser) {
                    userId = existingUser.id;
                } else {
                    const userStmt = db.prepare('INSERT INTO Users (email, password_hash) VALUES (?, ?)');
                    const info = userStmt.run(data.email, 'test_hash');
                    const profileStmt = db.prepare('INSERT INTO Profiles (user_id) VALUES (?)');
                    profileStmt.run(info.lastInsertRowid);
                    userId = info.lastInsertRowid;
                }
            }
            
            const newAppId = await ApplicationService.createApplication(userId, data, req.files);
            res.status(201).json({ message: 'Application submitted successfully', data: { id: newAppId } });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal server error while creating application.' });
        }
    }
}

module.exports = ApplicationController;
