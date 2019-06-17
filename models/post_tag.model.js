var db = require('../utils/database');

module.exports = {

    deleteByID:(id)=>{
        return db.load(`DELETE FROM post_tag WHERE id_post = ${id}`);
    },

    add: entity => {
        return db.add('post_tag', entity);
    },

    update: entity => {
        return db.update('post_tag', 'id', entity);
    },

    delete: id => {
        return db.delete('post_tag', 'id', id);
    }
};