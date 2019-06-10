var db = require('../utils/database');

module.exports = {
    getHotestTags : (numOfTag) => {
        if (numOfTag <= 0){
            return db.load(`select post_tag.id_tag, tags.tag_name, count(post_tag.id_post) as count 
                from  post_tag, tags where post_tag.id_tag = tags.id group by post_tag.id_tag`);
        }else{
            return db.load(`select post_tag.id_tag, tags.tag_name, count(post_tag.id_post) as count 
                from  post_tag, tags where post_tag.id_tag = tags.id group by post_tag.id_tag limit ${numOfTag}`);
        }
    }
};
