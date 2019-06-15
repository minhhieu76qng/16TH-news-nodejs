var db = require('../utils/database');

module.exports = {
    allWithPostID: PostID => {
        return db.load(`select c.id as comment_id, c.content, c.date_submit, c.id_parent, u.id as user_id, u.name from comment c, user u 
            where c.id_user=u.id and c.id_post=${PostID} and c.is_deleted=0
            order by c.date_submit desc`);
    },
};
