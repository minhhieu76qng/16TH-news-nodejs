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
            return db.load(`select * from post where is_deleted=0 and id_category = ${CatId}`);
        } else {
            return db.load(`select * from post where is_deleted=0 and id_category = ${CatId} 
                limit ${limit} offset ${offset}`);
        }
    },

    countByCat : CatId => {
        return db.load(`select count(*) as total from post where is_deleted=0 and id_category = ${CatId}`);
    },

    byRootCat : (CatId, limit, offset) => {
        if (limit <= 0) {
            return db.load(`select p.* from post p, category c where c.parent_cat = ${CatId} and p.id_category = c.id`);
        } else {
            return db.load(`select p.* from post p, category c where c.parent_cat = ${CatId} 
                and p.id_category = c.id limit ${limit} offset ${offset}`);
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
    }

}