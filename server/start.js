const db = require('./db/database');
const app = require('./index');
const port = process.env.PORT || 3000;

db.sync().then(() => app.listen(port));
