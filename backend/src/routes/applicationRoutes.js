const express = require('express');
const router = express.Router();
const ApplicationController = require('../controllers/applicationController');

router.post('/', ApplicationController.create);

module.exports = router;
