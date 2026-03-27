const ApplicationService = require('../services/applicationService');

class ApplicationController {
    static async create(req, res) {
        try {
            const data = req.body;
            // Basic validation
            if (!data.firstName || !data.lastName || !data.email || !data.program) {
                return res.status(400).json({ error: 'All fields are required' });
            }
            
            const newApp = await ApplicationService.createApplication(data);
            res.status(201).json({ message: 'Application submitted successfully', data: newApp });
        } catch (error) {
            res.status(500).json({ error: 'Internal server error while creating application.' });
        }
    }
}

module.exports = ApplicationController;
