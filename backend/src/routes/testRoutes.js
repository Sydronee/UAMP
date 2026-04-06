const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Essential for E2E Testing resets to maintain clean state
router.post('/reset', async (req, res) => {
    try {
        db.exec(`
            DELETE FROM Documents;
            DELETE FROM Applications;
            DELETE FROM Profiles;
            DELETE FROM Users;
            -- Reset Auto-Increment Counters
            DELETE FROM sqlite_sequence WHERE name IN ('Documents', 'Applications', 'Profiles', 'Users');
        `);
        res.status(200).json({ message: 'Database reset successful' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to reset database' });
    }
});

module.exports = router;
