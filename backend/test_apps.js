const db = require('./src/config/db');
const apps = db.prepare(`
    SELECT a.id, a.user_id, u.email, p.first_name, p.last_name, a.course, a.gpa, a.entrance_exam_score, a.status, a.submission_date 
    FROM Applications a
    JOIN Users u ON a.user_id = u.id
    JOIN Profiles p ON u.id = p.user_id
`).all();
const docStmt = db.prepare(`SELECT file_type, file_url FROM Documents WHERE application_id = ?`);
for (let app of apps) {
    app.documents = docStmt.all(app.id);
}
console.log(JSON.stringify(apps, null, 2));
