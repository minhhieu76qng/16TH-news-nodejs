var db = require('../utils/database');

module.exports = {
    withPostID: (PostID, limit, offset) => {
        return db.load(`select c.id as comment_id, c.content, c.date_submit, u.id as user_id, u.name from comment c, user u 
            where c.id_user=u.id and c.id_post=${PostID} and c.is_deleted=0
            order by c.date_submit desc limit ${limit} offset ${offset}`);
    },

    addNewComment : entity => {
        return db.add('comment', entity);
    },

    count : PostID => {
        return db.load(`select count(*) as totalComment from comment where id_post=${PostID} and is_deleted=0`);
    },
};
