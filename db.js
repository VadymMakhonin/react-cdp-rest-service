const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');

const adapter = new FileSync('db.json');
const db = low(adapter);

db.defaults({
    users: [{
        login: 'user1',
        password: 'qwerty123'
    }],
    courses: [],
    authors: []
}).write();

module.exports = db;