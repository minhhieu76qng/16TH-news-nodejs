var db = require('../utils/database');

module.exports = {
    isExistsEmail : email => {
        return db.load(`select * from user where email='${email}'`);
    },

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
    },

    pageSubscriber: (limit, offset)=>{
        return db.load(`SELECT user.id, user.name, user.dob, user.email, user.exp_date 
        from user, user_account_type, account_type where user.id = user_account_type.id_user 
        and user_account_type.id_account_type = account_type.id 
        and account_type.type = 'SUBSCRIBER'
        and user_account_type.is_deleted = 0 and user.is_deleted = 0 LIMIT ${limit} OFFSET ${offset}`)
    },

    pageWriter: (limit, offset)=>{
        return db.load(`SELECT user.id, user.name, user.pseudonym, user.dob, user.email, COUNT(post.id) as numPosts 
        from user LEFT JOIN post on user.id = post.id_writer and post.is_deleted = 0 
        LEFT JOIN post_status on post.id_status = post_status.id and post_status.status_name = N'Đã xuất bản', user_account_type, account_type 
        where user.id = user_account_type.id_user and user_account_type.id_account_type = account_type.id 
        and account_type.type = 'WRITER' and user_account_type.is_deleted = 0 and user.is_deleted = 0 
        GROUP BY user.id LIMIT ${limit} OFFSET ${offset}`);
    },

    countOfType:(type)=>{
        return db.load(`SELECT count(*) as total from user, user_account_type, account_type 
        where user.id = user_account_type.id_user and user_account_type.id_account_type = account_type.id 
        and account_type.type = '${type}' and user_account_type.is_deleted = 0 
        and user.is_deleted = 0`);
    },

    getExpDate:(id)=>{
        return db.load(`SELECT exp_date from user where id = ${id}`);
    },

    add: entity => {
        return db.add('user', entity);
    },

    update: entity => {
        return db.update('user', 'id', entity);
    },

    delete: id => {
        return db.delete('user', 'id', id);
    }
};
