const ApplicationService = require('../services/applicationService');
const db = require('../config/db');

class ApplicationController {
    static async create(req, res) {
        try {
            const data = req.body;
            if (!data.firstName || !data.lastName || !data.email || !data.program) {
                return res.status(400).json({ error: 'All fields are required' });
            }
            
            // For testing/mock purposes where Auth is not fully wired on frontend yet.
            let userId;
            if (req.user && req.user.id) {
                userId = req.user.id;
            } else {
                // Ensure a mock user exists for selenium testing
                const email = 'selenium_test_' + Date.now() + '@example.com';
                const userStmt = db.prepare('INSERT INTO Users (email, password_hash) VALUES (?, ?)');
                const info = userStmt.run(email, 'test_hash');
                const profileStmt = db.prepare('INSERT INTO Profiles (user_id) VALUES (?)');
                profileStmt.run(info.lastInsertRowid);
                userId = info.lastInsertRowid;
            }
            
            const newAppId = await ApplicationService.createApplication(userId, data);
            res.status(201).json({ message: 'Application submitted successfully', data: { id: newAppId } });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal server error while creating application.' });
        }
    }
}

module.exports = ApplicationController;
