var db = require('../utils/database');

module.exports = {
    all: () => {
        return db.load('select * from post where is_deleted = 1');
    },

    newest: (numOfRecord) => {
        if (numOfRecord <= 0) {
            return db.load(`select * from post where is_deleted = 1 order by date_posted desc`);
        } else {
            return db.load(`select * from post where is_deleted = 1 order by date_posted desc limit ${numOfRecord}`);
        }
    },

    newest_Thumbnail: (numOfRecord) => {
        if (numOfRecord <= 0) {
            return db.load(`select p.id, p.title, p.date_posted, p.cover_image, p.type_post, p.id_category, c.cat_name 
                from post p, category c where p.is_deleted=1 and c.status=1 and p.id_category = c.id 
                order by date_posted desc`);
        } else {
            return db.load(`select p.id, p.title, p.date_posted, p.cover_image, p.type_post, p.id_category, c.cat_name 
                from post p, category c where p.is_deleted=1 and c.status=1 and p.id_category = c.id 
                order by date_posted desc limit ${numOfRecord}`);
        }
    },

    byCat: (numOfRecord, CatId) => {
        if (numOfRecord <= 0) {
            return db.load(`select * from post where is_deleted = 1 and id_category = ${CatId}`);
        } else {
            return db.load(`select * from post where is_deleted = 1 and id_category = ${CatId} limit ${numOfRecord}`);
        }
    },

    newestByCat: (numOfRecord, CatId) => {
        if (numOfRecord <= 0) {
            return db.load(`select * from post where is_deleted = 1 and id_category = ${CatId} order by date_posted desc`);
        } else {
            return db.load(`select * from post where is_deleted = 1 and id_category = ${CatId} order by date_posted desc limit ${numOfRecord}`);
        }
    },

    newestByCat_Thumbnail: (numOfRecord, CatId) => {
        if (numOfRecord <= 0) {
            return db.load(`select p.id, p.title, p.date_posted, p.cover_image, p.type_post, p.id_category, c.cat_name 
                from post p, category c where p.is_deleted=1 and c.status=1 and p.id_category = c.id 
                and p.id_category = ${CatId} order by date_posted desc`);
        } else {
            return db.load(`select p.id, p.title, p.date_posted, p.cover_image, p.type_post, p.id_category, c.cat_name 
                from post p, category c where p.is_deleted=1 and c.status=1 and p.id_category = c.id 
                and p.id_category = ${CatId} order by date_posted desc limit ${numOfRecord}`);
        }
    },

    mostView: (numOfRecord) => {
        if (numOfRecord <= 0) {
            return db.load(`select * from post where is_deleted = 1 order by views desc`);
        } else {
            return db.load(`select * from post where is_deleted = 1 order by views desc limit ${numOfRecord}`);
        }
    },

    mostView_Thumbnail: (numOfRecord) => {
        if (numOfRecord <= 0) {
            return db.load(`select p.id, p.title, p.date_posted, p.cover_image, p.type_post, p.id_category, c.cat_name 
                from post p, category c where p.is_deleted=1 and c.status=1 and p.id_category = c.id 
                order by views desc`);
        } else {
            return db.load(`select p.id, p.title, p.date_posted, p.cover_image, p.type_post, p.id_category, c.cat_name 
                from post p, category c where p.is_deleted=1 and c.status=1 and p.id_category = c.id
                order by views desc limit ${numOfRecord}`);
        }
    },

    mostViewInTime: (numOfRecord, time) => {
        if (numOfRecord <= 0) {
            return db.load(`select * from post where is_deleted = 1 and date_posted between '${time.start}' and '${time.end}' order by views desc`);
        } else {
            return db.load(`select * from post where is_deleted = 1 and date_posted between '${time.start}' and '${time.end}' order by views desc limit ${numOfRecord}`);
        }
    },

    mostViewInTime_Thumbnail: (numOfRecord, time) => {
        if (numOfRecord <= 0) {
            return db.load(`select p.id, p.title, p.date_posted, p.cover_image, p.type_post, p.id_category, c.cat_name 
                from post p, category c where p.is_deleted=1 and c.status=1 and p.id_category = c.id and date_posted 
                between '${time.start}' and '${time.end}' order by views desc`);
        } else {
            return db.load(`select p.id, p.title, p.date_posted, p.cover_image, p.type_post, p.id_category, c.cat_name 
                from post p, category c where p.is_deleted=1 and c.status=1 and p.id_category = c.id and date_posted 
                between '${time.start}' and '${time.end}' order by views desc limit ${numOfRecord}`);
        }
    }

}