const express = require('express');
const cors = require('cors');
const applicationRoutes = require('./routes/applicationRoutes');
const testRoutes = require('./routes/testRoutes');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/applications', applicationRoutes);
app.use('/api/test', testRoutes); // Endpoint to clear data between Selenium runs

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
