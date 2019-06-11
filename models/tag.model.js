var db = require('../utils/database');

module.exports = {
    getHotestTags: (limit) => {
        if (limit <= 0) {
            return db.load(`select post_tag.id_tag, tags.tag_name, count(post_tag.id_post) as count 
                from  post_tag, tags where post_tag.id_tag = tags.id group by post_tag.id_tag`);
        } else {
            return db.load(`select post_tag.id_tag, tags.tag_name, count(post_tag.id_post) as count 
                from  post_tag, tags where post_tag.id_tag = tags.id group by post_tag.id_tag limit ${limit}`);
        }
    },

    getRelatedTagsByCatID: (CatID, limit) => {
        if (limit <= 0) {
            return db.load(`select DISTINCT tags.id, tags.tag_name 
            from post_tag, tags, post , category
            where tags.id = post_tag.id_tag and post.id = post_tag.id_post and post.id_category = category.id 
            and category.id = ${CatID}`);
        } else {
            return db.load(`select DISTINCT tags.id, tags.tag_name 
            from post_tag, tags, post , category
            where tags.id = post_tag.id_tag and post.id = post_tag.id_post and post.id_category = category.id 
            and category.id = ${CatID} limit ${limit}`);
        }
    },

    getRelatedTagsByCatID_Root: (CatID, limit) => {
        if (limit <= 0) {
            return db.load(`select DISTINCT tags.id, tags.tag_name 
            from post_tag, tags, post , category
            where tags.id = post_tag.id_tag and post.id = post_tag.id_post and post.id_category = category.id 
            and category.parent_cat = ${CatID}`);
        } else {
            return db.load(`select DISTINCT tags.id, tags.tag_name 
            from post_tag, tags, post , category
            where tags.id = post_tag.id_tag and post.id = post_tag.id_post and post.id_category = category.id 
            and category.parent_cat = ${CatID} limit ${limit}`);
        }
    },

    getTagsByPostId : PostId => {
        return db.load(`select tags.id, tags.tag_name from post_tag, tags 
            where post_tag.id_tag = tags.id and post_tag.id_post=${PostId}`);
    }
};
