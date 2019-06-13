var db = require('../utils/database');

module.exports = {
    all: () => {
        return db.load('select * from post where is_deleted=0');
    },

    newest: (limit) => {
        if (limit <= 0) {
            return db.load(`select * from post where is_deleted=0 order by date_posted desc`);
        } else {
            return db.load(`select * from post where is_deleted=0 order by date_posted desc limit ${limit}`);
        }
    },

    newest_Thumbnail: (limit) => {
        if (limit <= 0) {
            return db.load(`select p.id, p.title, p.date_posted, p.cover_image, p.type_post, p.id_category, c.cat_name 
                from post p, category c where p.is_deleted=0 and c.is_deleted=0 and p.id_category = c.id 
                order by date_posted desc`);
        } else {
            return db.load(`select p.id, p.title, p.date_posted, p.cover_image, p.type_post, p.id_category, c.cat_name 
                from post p, category c where p.is_deleted=0 and c.is_deleted=0 and p.id_category = c.id 
                order by date_posted desc limit ${limit}`);
        }
    },

    byCat: (CatId, limit, offset) => {
        if (limit <= 0) {
            return db.load(`select p.id, p.title, p.abstract, p.date_posted, p.cover_image, p.type_post, p.id_category, c.cat_name 
                from post p, category c where p.is_deleted=0 and c.is_deleted=0 
                and p.id_category = c.id and p.id_category = ${CatId}`);
        } else {
            return db.load(`select p.id, p.title, p.abstract, p.date_posted, p.cover_image, p.type_post, p.id_category, c.cat_name 
                from post p, category c where p.is_deleted=0 and c.is_deleted=0 
                and p.id_category = c.id and p.id_category = ${CatId} 
                limit ${limit} offset ${offset}`);
        }
    },

    countByCat : CatId => {
        return db.load(`select count(*) as total from post where is_deleted=0 and id_category = ${CatId}`);
    },

    byRootCat : (CatId, limit, offset) => {
        if (limit <= 0) {
            return db.load(`select p.id, p.title, p.abstract, p.date_posted, p.cover_image, p.type_post, p.id_category, c.cat_name 
                from post p, category c where p.is_deleted=0 and c.is_deleted=0 
                and p.id_category = c.id  and c.parent_cat = ${CatId}`);
        } else {
            return db.load(`select p.id, p.title, p.abstract, p.date_posted, p.cover_image, p.type_post, p.id_category, c.cat_name 
                from post p, category c where p.is_deleted=0 and c.is_deleted=0 
                and p.id_category = c.id  and c.parent_cat = ${CatId} limit ${limit} offset ${offset}`);
        }
    },

    countByRootCat : (CatId) => {
        return db.load(`select count(*) as total from post p, category c where c.parent_cat = ${CatId} and p.id_category = c.id`);
    },

    newestByCat: (CatId, limit) => {
        if (limit <= 0) {
            return db.load(`select * from post where is_deleted=0 and id_category = ${CatId} order by date_posted desc`);
        } else {
            return db.load(`select * from post where is_deleted=0 and id_category = ${CatId} order by date_posted desc limit ${limit}`);
        }
    },

    newestByCat_Thumbnail: (CatId, limit) => {
        if (limit <= 0) {
            return db.load(`select p.id, p.title, p.date_posted, p.cover_image, p.type_post, p.id_category, c.cat_name 
                from post p, category c where p.is_deleted=0 and c.is_deleted=0 and p.id_category = c.id 
                and p.id_category = ${CatId} order by date_posted desc`);
        } else {
            return db.load(`select p.id, p.title, p.date_posted, p.cover_image, p.type_post, p.id_category, c.cat_name 
                from post p, category c where p.is_deleted=0 and c.is_deleted=0 and p.id_category = c.id 
                and p.id_category = ${CatId} order by date_posted desc limit ${limit}`);
        }
    },

    mostView: (limit) => {
        if (limit <= 0) {
            return db.load(`select * from post where is_deleted=0 order by views desc`);
        } else {
            return db.load(`select * from post where is_deleted=0 order by views desc limit ${limit}`);
        }
    },

    mostView_Thumbnail: (limit) => {
        if (limit <= 0) {
            return db.load(`select p.id, p.title, p.date_posted, p.cover_image, p.type_post, p.id_category, c.cat_name 
                from post p, category c where p.is_deleted=0 and c.is_deleted=0 and p.id_category = c.id 
                order by views desc`);
        } else {
            return db.load(`select p.id, p.title, p.date_posted, p.cover_image, p.type_post, p.id_category, c.cat_name 
                from post p, category c where p.is_deleted=0 and c.is_deleted=0 and p.id_category = c.id
                order by views desc limit ${limit}`);
        }
    },

    mostViewInTime: (time, limit) => {
        if (limit <= 0) {
            return db.load(`select * from post where is_deleted=0 and date_posted between '${time.start}' and '${time.end}' order by views desc`);
        } else {
            return db.load(`select * from post where is_deleted=0 and date_posted between '${time.start}' and '${time.end}' order by views desc limit ${limit}`);
        }
    },

    mostViewInTime_Thumbnail: (time, limit) => {
        if (limit <= 0) {
            return db.load(`select p.id, p.title, p.date_posted, p.cover_image, p.type_post, p.id_category, c.cat_name 
                from post p, category c where p.is_deleted=0 and c.is_deleted=0 and p.id_category = c.id and date_posted 
                between '${time.start}' and '${time.end}' order by views desc`);
        } else {
            return db.load(`select p.id, p.title, p.date_posted, p.cover_image, p.type_post, p.id_category, c.cat_name 
                from post p, category c where p.is_deleted=0 and c.is_deleted=0 and p.id_category = c.id and date_posted 
                between '${time.start}' and '${time.end}' order by views desc limit ${limit}`);
        }
    },

    byTagId : (TagID, limit, offset) => {
        if (limit <= 0){
            return db.load(`select p.*, p.id_category, c.cat_name 
                from post p, category c, post_tag pt where p.is_deleted=0 and c.is_deleted=0 
                and p.id_category = c.id and p.id=pt.id_post and pt.id_tag=${TagID} order by p.date_posted desc`);
        }else{
            return db.load(`select p.*, p.id_category, c.cat_name 
                from post p, category c, post_tag pt where p.is_deleted=0 and c.is_deleted=0 
                and p.id_category = c.id and p.id=pt.id_post and pt.id_tag=${TagID} order by p.date_posted desc
                limit ${limit} offset ${offset}`);
        }
    },

    countByTag : TagID => {
        return db.load(`select count(*) as total from post p, post_tag pt where p.id=pt.id_post and p.is_deleted=0 
            and pt.id_tag=${TagID}`);
    },
    
    detailByPostId : PostID => {
        return db.load(`select p.*, c.cat_name from post p, category c 
            where p.is_deleted=0 and c.is_deleted=0 and p.id=${PostID} and p.id_category=c.id`);
    },

    getCommentsByPost : PostID => {
        return db.load(`select c.id as comment_id, c.content, c.date_submit, c.id_parent, u.id as user_id, u.name from comment c, user u 
            where c.id_user=u.id and c.id_post=${PostID} and c.is_deleted=0
            order by c.date_submit desc`);
    }
}