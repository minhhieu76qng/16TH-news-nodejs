var db = require('../utils/database');

module.exports = {
    addNewUserAccountType : (user) => {
        return db.add('user_account_type', user);
    }
};
