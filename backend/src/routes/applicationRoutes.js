const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const ApplicationController = require('../controllers/applicationController');

const uploadDir = path.join(__dirname, '../../uploads/');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer configuration to save files directly into an 'uploads/' folder at the root of 'backend'
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        // Keep the original extension so the browser knows how to display it inline (e.g. .pdf, .jpg)
        const ext = path.extname(file.originalname);
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + (ext || '.pdf'));
    }
});

const upload = multer({ storage: storage });

router.post('/', upload.fields([
    { name: 'transcript', maxCount: 1 }, 
    { name: 'idDocument', maxCount: 1 }
]), ApplicationController.create);

module.exports = router;
