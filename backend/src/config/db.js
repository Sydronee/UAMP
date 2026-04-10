const Database = require('better-sqlite3');
const path = require('path');
const bcrypt = require('bcrypt');

const dbPath = path.resolve(__dirname, '../../database.sqlite');
const db = new Database(dbPath);

function addColumnIfMissing(tableName, columnName, columnDef) {
    const columns = db.prepare(`PRAGMA table_info(${tableName})`).all();
    const hasColumn = columns.some((column) => column.name === columnName);
    if (!hasColumn) {
        try {
            db.exec(`ALTER TABLE ${tableName} ADD COLUMN ${columnName} ${columnDef}`);
        } catch (error) {
            if (!String(error.message).includes('duplicate column name')) {
                throw error;
            }
        }
    }
}

function ensureDefaultAdmin() {
    // Ensure a deterministic default admin account exists for local development/testing.
    const existingAdmin = db.prepare('SELECT id FROM Users WHERE email = ?').get('admin');
    if (!existingAdmin) {
        const hashedPassword = bcrypt.hashSync('admin123', 10);

        const seedAdminTx = db.transaction(() => {
            const userStmt = db.prepare('INSERT INTO Users (email, password_hash, role) VALUES (?, ?, ?)');
            const userInfo = userStmt.run('admin', hashedPassword, 'Admin');

            const profileStmt = db.prepare('INSERT INTO Profiles (user_id) VALUES (?)');
            profileStmt.run(userInfo.lastInsertRowid);
        });

        seedAdminTx();
    }
}

function initDb() {
    // Enable strict foreign key enforcement
    db.pragma('foreign_keys = ON');

    db.exec(`
        CREATE TABLE IF NOT EXISTS Users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            email TEXT UNIQUE NOT NULL,
            password_hash TEXT NOT NULL,
            role TEXT CHECK(role IN ('Student', 'Admin')) NOT NULL DEFAULT 'Student',
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS Profiles (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL UNIQUE,
            first_name TEXT,
            last_name TEXT,
            phone TEXT,
            address TEXT,
            FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE
        );

        CREATE TABLE IF NOT EXISTS Applications (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            course TEXT NOT NULL,
            gpa REAL DEFAULT 0,
            entrance_exam_score REAL DEFAULT 0,
            status TEXT CHECK(status IN ('Pending', 'Under Review', 'Interview', 'Accepted', 'Rejected')) DEFAULT 'Pending',
            submission_date DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE
        );

        CREATE TABLE IF NOT EXISTS Documents (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            application_id INTEGER NOT NULL,
            file_type TEXT NOT NULL,
            file_url TEXT NOT NULL,
            FOREIGN KEY (application_id) REFERENCES Applications(id) ON DELETE CASCADE
        );
    `);

    // Lightweight migrations for evolving form requirements.
    addColumnIfMissing('Profiles', 'date_of_birth', 'TEXT');
    addColumnIfMissing('Profiles', 'gender', 'TEXT');
    addColumnIfMissing('Profiles', 'city', 'TEXT');
    addColumnIfMissing('Profiles', 'state', 'TEXT');
    addColumnIfMissing('Profiles', 'country', 'TEXT');
    addColumnIfMissing('Profiles', 'postal_code', 'TEXT');

    addColumnIfMissing('Applications', 'high_school_name', 'TEXT');
    addColumnIfMissing('Applications', 'graduation_year', 'INTEGER');
    addColumnIfMissing('Applications', 'preferred_intake', 'TEXT');
    addColumnIfMissing('Applications', 'statement_of_purpose', 'TEXT');

    ensureDefaultAdmin();
}

initDb();

db.ensureDefaultAdmin = ensureDefaultAdmin;

module.exports = db;
