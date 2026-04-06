const ApplicationService = require('../services/applicationService');

class AdminController {
    static async getAllApplications(req, res) {
        try {
            const apps = await ApplicationService.getAllApplications();
            res.status(200).json(apps);
        } catch (error) {
            res.status(500).json({ error: 'Failed to fetch applications' });
        }
    }

    static async updateStatus(req, res) {
        try {
            const { id } = req.params;
            const { status } = req.body;
            
            if (!['Pending', 'Under Review', 'Interview', 'Accepted', 'Rejected'].includes(status)) {
                return res.status(400).json({ error: 'Invalid status' });
            }

            ApplicationService.updateApplicationStatus(id, status);
            res.status(200).json({ message: 'Status updated successfully' });
        } catch (error) {
            res.status(500).json({ error: 'Failed to update status' });
        }
    }

    static async bulkUpdateStatus(req, res) {
        try {
            const { ids, status } = req.body;
            
            if (!Array.isArray(ids) || ids.length === 0) {
                return res.status(400).json({ error: 'Please provide an array of application IDs' });
            }

            if (!['Pending', 'Under Review', 'Interview', 'Accepted', 'Rejected'].includes(status)) {
                return res.status(400).json({ error: 'Invalid status' });
            }

            const db = require('../config/db');
            const updateTx = db.transaction(() => {
                for (const id of ids) {
                    ApplicationService.updateApplicationStatus(id, status);
                }
            });
            updateTx();

            res.status(200).json({ message: 'Bulk update successful' });
        } catch (error) {
            res.status(500).json({ error: 'Failed to bulk update status' });
        }
    }
}

module.exports = AdminController;
