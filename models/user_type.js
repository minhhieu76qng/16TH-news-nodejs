var db = require('../utils/database');

module.exports = {
    accountTypeByType : type => {
        return db.load(`select * from account_type where type='${type}'`);
    }
};
