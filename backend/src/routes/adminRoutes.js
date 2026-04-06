const express = require('express');
const router = express.Router();
const AdminController = require('../controllers/adminController');
const { authenticateToken, requireRole } = require('../middlewares/authMiddleware');

// Protect all admin routes
router.use(authenticateToken, requireRole('Admin'));

router.get('/applications', AdminController.getAllApplications);
router.put('/applications/:id/status', AdminController.updateStatus);
router.post('/applications/bulk-status', AdminController.bulkUpdateStatus);

module.exports = router;
