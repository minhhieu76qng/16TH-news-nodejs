var db = require('../utils/database');

module.exports = {
    all : () => {
        return db.load('select * from post_status');
    }
};
