var db = require('../utils/database');

module.exports = {
    all : () => {
        return db.load('select * from tags where is_deleted=0');
    },

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
    },

    getTagsById : TagId => {
        return db.load(`select * from tags where id=${TagId} and is_deleted=0`);
    },

    pageTag: (limit, offset) =>{
        return db.load(`SELECT tags.id, tags.tag_name, COUNT(post_tag.id) as numPosts 
        from tags LEFT JOIN post_tag on tags.id = post_tag.id_tag LEFT JOIN post on post_tag.id_post = post.id and post.is_deleted = 0 
        where tags.is_deleted = 0 GROUP BY tags.id LIMIT ${limit} OFFSET ${offset}`);
    },

    getList:(limit, offset)=>{
        return db.load(`SELECT tags.id, tags.tag_name FROM tags WHERE tags.is_deleted = 0 LIMIT ${limit} OFFSET ${offset}`);
    },

    count:()=>{
        return db.load(`select count(*) as total from tags where is_deleted = 0`);
    },

    singleByTagName:(tag_name, id)=>{
        return db.load(`select * from tags where tags.tag_name = N'${tag_name}' and tags.id != '${id}' and tags.is_deleted = 0`);
    },

    add: entity => {
        return db.add('tags', entity);
    },

    update: entity => {
        return db.update('tags', 'id', entity);
    },

    delete: id => {
        return db.delete('tags', 'id', id);
    }
};
