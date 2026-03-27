const express = require('express');
const router = express.Router();
const ApplicationService = require('../services/applicationService');

// Essential for E2E Testing resets to maintain clean state
router.post('/reset', async (req, res) => {
    try {
        await ApplicationService.resetApplications();
        res.status(200).json({ message: 'Database reset successful' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to reset database' });
    }
});

module.exports = router;
