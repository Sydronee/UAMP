const db = require('../config/db');

class ApplicationService {
    static async createApplication(userId, data) {
        const registerTx = db.transaction(() => {
            // Update Profile
            const profileStmt = db.prepare('UPDATE Profiles SET first_name = ?, last_name = ? WHERE user_id = ?');
            profileStmt.run(data.firstName, data.lastName, userId);

            // Insert Application
            const appStmt = db.prepare('INSERT INTO Applications (user_id, course, gpa) VALUES (?, ?, ?)');
            const info = appStmt.run(userId, data.program, data.gpa || 0);

            return info.lastInsertRowid;
        });

        return registerTx();
    }

    static async getAllApplications() {
        return db.prepare(`
            SELECT a.id, a.user_id, u.email, p.first_name, p.last_name, a.course, a.gpa, a.entrance_exam_score, a.status, a.submission_date 
            FROM Applications a
            JOIN Users u ON a.user_id = u.id
            JOIN Profiles p ON u.id = p.user_id
        `).all();
    }

    static updateApplicationStatus(id, status) {
        const stmt = db.prepare('UPDATE Applications SET status = ? WHERE id = ?');
        stmt.run(status, id);
    }
}

module.exports = ApplicationService;
