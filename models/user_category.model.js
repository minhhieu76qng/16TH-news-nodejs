var db = require('../utils/database');

module.exports = {
    getCatManagenment:(userID)=>{
        return db.load(`Select cat.id, cat.cat_name from user_category u_cat, category cat 
        where u_cat.id_user = ${userID} and cat.is_deleted = 0 and cat.id = u_cat.id_category`);
    },

    deleteByID:(id)=>{
        return db.load(`DELETE FROM user_category WHERE id_user = ${id}`);
    },

    add: entity => {
        return db.add('user_category', entity);
    },

    update: entity => {
        return db.update('user_category', 'id', entity);
    },

    delete: id => {
        return db.delete('user_category', 'id', id);
    }
};