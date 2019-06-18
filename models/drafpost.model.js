var db = require('../utils/database');

module.exports = {
    deny: (editorId) =>{
        return db.load(`SELECT DISTINCT p.id, p.title, p.date_posted, p.cover_image, p.abstract, p.content, u.pseudonym, c.cat_name, p.download_link, pa.note from post p, user_category uc, category c, post_action pa, user u WHERE uc.id_user = ${editorId} and uc.id_category = c.parent_cat and c.is_deleted = 0 and c.id = p.id_category and p.id_status = 3 and p.is_deleted = 0 and pa.id_post = p.id and u.id = p.id_writer`)
    },

    draft: (editorId, limit, offset) =>{
        return db.load(`SELECT p.id, p.title, p.cover_image, p.abstract, p.content, u.pseudonym, c.cat_name, p.download_link, p.date_created from post p, user_category uc, category c, user u WHERE uc.id_user = ${editorId} and uc.id_category = c.parent_cat and c.is_deleted = 0 and c.id = p.id_category and p.id_status = 4 and p.is_deleted = 0 and p.id_writer = u.id and u.is_deleted = 0 limit ${limit} offset ${offset}`)
    },
    countdraftpost: editorId =>{
        return db.load(`select count(*) as total from post p, user_category uc, category c, user u WHERE uc.id_user = ${editorId} and uc.id_category = c.parent_cat and c.is_deleted = 0 and c.id = p.id_category and p.id_status = 4 and p.is_deleted = 0 and p.id_writer = u.id and u.is_deleted = 0`)
    },

    waiting: (editorId, limit, offset) =>{
        return db.load(`select DISTINCT p.id, p.title, p.date_created, pa.date_modified, p.cover_image, p.abstract, p.content, u.pseudonym, c.cat_name, p.download_link from post p, category c, user_category uc, user u, post_action pa where uc.id_user = ${editorId} and uc.id_category =c.parent_cat and c.is_deleted =0 and c.id = p.id_category and p.is_deleted = 0 and p.id_writer = u.id and p.id = pa.id_post and pa.id_status =1 limit ${limit} offset ${offset}`)
    },
    countpostwaiting: editorId =>{
        return db.load(`select count(*) as total from post p, category c, user_category uc, user u, post_action pa where uc.id_user = ${editorId} and uc.id_category =c.parent_cat and c.is_deleted =0 and c.id = p.id_category and p.is_deleted = 0 and p.id_writer = u.id and p.id = pa.id_post and pa.id_status =1`)
    },
}