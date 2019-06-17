var db = require('../utils/database');

module.exports = {

    byPostID: id_post =>{
        return db.load(`SELECT * FROM post_action where id_status = 3 and post_action.id_post = ${id_post} 
        ORDER BY post_action.date_modified DESC`);
    },

    add: entity => {
        return db.add('post_action', entity);
    },

    update: entity => {
        return db.update('post_action', 'id', entity);
    },

    delete: id => {
        return db.delete('post_action', 'id', id);
    }
};