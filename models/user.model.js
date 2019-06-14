var db = require('../utils/database');

module.exports = {
    singleByEmail : email => {
        return db.load(`select * from user where email='${email}' and is_deleted=0`);
    },

    addNewUser : user => {
        return db.add('user', user);
    }
};
