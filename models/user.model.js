var db = require('../utils/database');

module.exports = {
    singleByEmail : email => {
        return db.load(`select * from user where email='${email}' and is_deleted=0`);
    },

    detailUserByEmail : email => {
        return db.load(`select u.*, at.display_name, at.type from user u, user_account_type uct, account_type at 
            where u.id=uct.id_user and uct.id_account_type=at.id and u.email='${email}'`)
    },

    detailUserByID : UserID => {
        return db.load(`select u.*, at.display_name, at.type from user u, user_account_type uct, account_type at 
            where u.id=uct.id_user and uct.id_account_type=at.id and u.id='${UserID}'`)
    },

    addNewUser : user => {
        return db.add('user', user);
    }
};
