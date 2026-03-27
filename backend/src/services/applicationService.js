// Mock "SQL" table (in-memory for demo, structured for ease of swapping to real DB later)
let applicationsTable = [];

class ApplicationService {
    static async createApplication(data) {
        const newApp = {
            id: applicationsTable.length + 1,
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email,
            program: data.program,
            status: 'PENDING',
            createdAt: new Date()
        };
        // Simulated INSERT query
        applicationsTable.push(newApp);
        return newApp;
    }

    static async resetApplications() {
        // Simulated TRUNCATE TABLE query
        applicationsTable = [];
    }

    static async getAllApplications() {
        // Simulated SELECT * query
        return applicationsTable;
    }
}

module.exports = ApplicationService;
