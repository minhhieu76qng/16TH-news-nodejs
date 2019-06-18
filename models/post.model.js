var db = require('../utils/database');

module.exports = {
    all: () => {
        return db.load('select * from post where is_deleted=0 and id_status=1 and date_posted is not null and date_posted<=NOW()');
    },

    newest: (limit) => {
        if (limit <= 0) {
            return db.load(`select * from post 
                where is_deleted=0 and id_status=1 and date_posted is not null and date_posted<=NOW() 
                order by date_posted desc`);
        } else {
            return db.load(`select * from post 
                where is_deleted=0 and id_status=1 and date_posted is not null and date_posted<=NOW() 
                order by date_posted desc limit ${limit}`);
        }
    },

    newest_Thumbnail: (limit) => {
        if (limit <= 0) {
            return db.load(`select p.id, p.title, p.date_posted, p.cover_image, p.type_post, p.id_category, c.cat_name 
                from post p, category c where p.is_deleted=0 and p.id_status=1 and p.date_posted is not null and p.date_posted<=NOW()
                and c.is_deleted=0 and p.id_category = c.id 
                order by date_posted desc`);
        } else {
            return db.load(`select p.id, p.title, p.date_posted, p.cover_image, p.type_post, p.id_category, c.cat_name 
                from post p, category c where p.is_deleted=0 and p.id_status=1 and p.date_posted is not null and p.date_posted<=NOW()
                and c.is_deleted=0 and p.id_category = c.id 
                order by date_posted desc limit ${limit}`);
        }
    },

    byCat: (CatId, limit, offset) => {
        if (limit <= 0) {
            return db.load(`select p.id, p.title, p.abstract, p.date_posted, p.cover_image, p.type_post, p.id_category, c.cat_name 
                from post p, category c where p.is_deleted=0 and p.id_status=1 and p.date_posted is not null and p.date_posted<=NOW()
                and c.is_deleted=0 and p.id_category = c.id and p.id_category = ${CatId}
                order by p.type_post desc, p.date_posted desc`);
        } else {
            return db.load(`select p.id, p.title, p.abstract, p.date_posted, p.cover_image, p.type_post, p.id_category, c.cat_name 
                from post p, category c where p.is_deleted=0 and p.id_status=1 and p.date_posted is not null and p.date_posted<=NOW()
                and c.is_deleted=0 and p.id_category = c.id and p.id_category = ${CatId} 
                order by p.type_post desc, p.date_posted desc
                limit ${limit} offset ${offset}`);
        }
    },

    countByCat: CatId => {
        return db.load(`select count(*) as total from post where is_deleted=0 and id_status=1
            and date_posted is not null and date_posted<=NOW() and id_category = ${CatId}`);
    },

    byRootCat: (CatId, limit, offset) => {
        if (limit <= 0) {
            return db.load(`select p.id, p.title, p.abstract, p.date_posted, p.cover_image, p.type_post, p.id_category, c.cat_name 
                from post p, category c where p.is_deleted=0 and p.id_status=1 and p.date_posted is not null and p.date_posted<=NOW()
                and c.is_deleted=0 and p.id_category = c.id  and c.parent_cat = ${CatId}
                order by p.type_post desc, p.date_posted desc`);
        } else {
            return db.load(`select p.id, p.title, p.abstract, p.date_posted, p.cover_image, p.type_post, p.id_category, c.cat_name 
                from post p, category c where p.is_deleted=0 and p.id_status=1 and p.date_posted is not null and p.date_posted<=NOW()
                and c.is_deleted=0 and p.id_category = c.id  and c.parent_cat = ${CatId} 
                order by p.type_post desc, p.date_posted desc
                limit ${limit} offset ${offset}`);
        }
    },

    countByRootCat: (CatId) => {
        return db.load(`select count(*) as total from post p, category c 
            where p.is_deleted=0 and p.id_status=1 and p.date_posted is not null and p.date_posted<=NOW()
            and c.parent_cat = ${CatId} and p.id_category = c.id`);
    },

    newestByCat: (CatId, limit) => {
        if (limit <= 0) {
            return db.load(`select * from post 
                where is_deleted=0 and id_status=1 and date_posted is not null and date_posted<=NOW()
                and id_category = ${CatId} 
                order by date_posted desc`);
        } else {
            return db.load(`select * from post 
                where is_deleted=0 and id_status=1 and date_posted is not null and date_posted<=NOW()
                and id_category = ${CatId} order by date_posted desc limit ${limit}`);
        }
    },

    newestByCat_Thumbnail: (CatId, limit) => {
        if (limit <= 0) {
            return db.load(`select p.id, p.title, p.date_posted, p.cover_image, p.type_post, p.id_category, c.cat_name 
                from post p, category c where p.is_deleted=0 and p.id_status=1 and p.date_posted is not null and p.date_posted<=NOW()
                and c.is_deleted=0 and p.id_category = c.id 
                and p.id_category = ${CatId} order by date_posted desc`);
        } else {
            return db.load(`select p.id, p.title, p.date_posted, p.cover_image, p.type_post, p.id_category, c.cat_name 
                from post p, category c where p.is_deleted=0 and p.id_status=1 and p.date_posted is not null and p.date_posted<=NOW()
                and c.is_deleted=0 and p.id_category = c.id 
                and p.id_category = ${CatId} order by date_posted desc limit ${limit}`);
        }
    },

    mostView: (limit) => {
        if (limit <= 0) {
            return db.load(`select * from post 
                where is_deleted=0 and id_status=1 and date_posted is not null and date_posted<=NOW() 
                order by views desc`);
        } else {
            return db.load(`select * from post 
                where is_deleted=0 and id_status=1 and date_posted is not null and date_posted<=NOW() 
                order by views desc limit ${limit}`);
        }
    },

    mostView_Thumbnail: (limit) => {
        if (limit <= 0) {
            return db.load(`select p.id, p.title, p.date_posted, p.cover_image, p.type_post, p.id_category, c.cat_name 
                from post p, category c where p.is_deleted=0 and p.id_status=1 and p.date_posted is not null and p.date_posted<=NOW()
                and c.is_deleted=0 and p.id_category = c.id 
                order by views desc`);
        } else {
            return db.load(`select p.id, p.title, p.date_posted, p.cover_image, p.type_post, p.id_category, c.cat_name 
                from post p, category c where p.is_deleted=0 and p.id_status=1 and p.date_posted is not null and p.date_posted<=NOW()
                and c.is_deleted=0 and p.id_category = c.id
                order by views desc limit ${limit}`);
        }
    },

    // mostViewInTime: (time, limit) => {
    //     if (limit <= 0) {
    //         return db.load(`select * from post where is_deleted=0 and id_status=1 and date_posted between '${time.start}' and '${time.end}' order by views desc`);
    //     } else {
    //         return db.load(`select * from post where is_deleted=0 and id_status=1 and date_posted between '${time.start}' and '${time.end}' order by views desc limit ${limit}`);
    //     }
    // },

    impressedPost: (week, limit) => {
        return db.load(`select p.id, p.title, p.date_posted, p.cover_image, p.type_post, p.id_category, c.cat_name 
            from post p, category c, view_weeks vw 
            where p.is_deleted=0 and p.id_status=1 and p.date_posted is not null and p.date_posted<=NOW()
            and c.is_deleted=0 and p.id_category = c.id 
            and p.id=vw.id_post and vw.week='${week}' order by vw.views_in_week desc limit ${limit}`);
    },

    byTagId: (TagID, limit, offset) => {
        if (limit <= 0) {
            return db.load(`select p.*, p.id_category, c.cat_name 
                from post p, category c, post_tag pt where p.is_deleted=0 and p.id_status=1 and c.is_deleted=0 
                and p.date_posted is not null and p.date_posted<=NOW()
                and p.id_category = c.id and p.id=pt.id_post and pt.id_tag=${TagID}
                order by p.type_post desc, p.date_posted desc`);
        } else {
            return db.load(`select p.*, p.id_category, c.cat_name 
                from post p, category c, post_tag pt where p.is_deleted=0 and p.id_status=1 and c.is_deleted=0 
                and p.date_posted is not null and p.date_posted<=NOW()
                and p.id_category = c.id and p.id=pt.id_post and pt.id_tag=${TagID}
                order by p.type_post desc, p.date_posted desc
                limit ${limit} offset ${offset}`);
        }
    },

    countByTag: TagID => {
        return db.load(`select count(*) as total from post p, post_tag pt 
            where p.id=pt.id_post and p.is_deleted=0 and p.id_status=1 and p.date_posted is not null and p.date_posted<=NOW()
            and pt.id_tag=${TagID}`);
    },

    detailByPostId: PostID => {
        return db.load(`select p.*, c.cat_name from post p, category c 
            where p.is_deleted=0 and p.id_status=1 and p.date_posted is not null and p.date_posted<=NOW()
            and c.is_deleted=0 and p.id=${PostID} and p.id_category=c.id`);
    },

    // getCommentsByPost: PostID => {
    //     return db.load(`select c.id as comment_id, c.content, c.date_submit, u.id as user_id, u.name from comment c, user u 
    //         where c.id_user=u.id and c.id_post=${PostID} and c.is_deleted=0
    //         order by c.date_submit desc`);
    // },

    increaseViews: (entity) => {
        return db.update('post', 'id', entity);
    },

    // ---------------- writer --------------------
    postsWithAuthorID : (UserID, limit, offset) => {
        return db.load(`select p.*, c.cat_name from post p, category c
            where p.id_writer=${UserID} and p.is_deleted=0 and p.id_category=c.id 
            limit ${limit} offset ${offset}`);
    },

    publishedPostsWithUserID : (UserID, limit, offset) => {
        return db.load(`select p.*, c.cat_name from post p, category c 
            where p.id_writer=${UserID} and p.is_deleted=0 and p.id_category=c.id
            and p.id_status=1 and date_posted is not null and date_posted<=NOW()
            limit ${limit} offset ${offset}`);
    },

    waitingForPublicationPostsWithUserID : (UserID, limit, offset) => {
        return db.load(`select p.*, c.cat_name from post p, category c
            where p.id_writer=${UserID} and p.is_deleted=0 and p.id_category=c.id
            and p.id_status=1 and date_posted is not null and date_posted>=NOW()
            limit ${limit} offset ${offset}`);
    },

    createdPostsWithUserID : (UserID, limit, offset) => {
        return db.load(`select p.*, c.cat_name from post p, category c
            where p.id_writer=${UserID} and p.is_deleted=0 and p.id_category=c.id
            and p.id_status=4 limit ${limit} offset ${offset}`);
    },

    refusedPostsWithUserID : (UserID, limit, offset) => {
        return db.load(`select p.*, c.cat_name from post p, category c
            where p.id_writer=${UserID} and p.is_deleted=0 and p.id_category=c.id
            and p.id_status=3 limit ${limit} offset ${offset}`);
    },

    countAllPostWithUserID : UserID => {
        return db.load(`select count(*) as total from post p where p.id_writer=${UserID} and p.is_deleted=0`);
    },
    countPublishedPostWithUserID : UserID => {
        return db.load(`select count(*) as total from post p
            where p.id_writer=${UserID} and p.is_deleted=0 
            and p.id_status=1 and date_posted is not null and date_posted<=NOW()`);
    },
    countWaitingPostWithUserID : UserID => {
        return db.load(`select count(*) as total from post p where p.id_writer=${UserID} and p.is_deleted=0 
            and p.id_status=1 and date_posted is not null and date_posted>=NOW()`);
    },
    countCreatedPostWithUserID : UserID => {
        return db.load(`select count(*) as total from post p where p.id_writer=${UserID} and p.is_deleted=0 
            and p.id_status=4`);
    },
    countRefusedPostWithUserID : UserID => {
        return db.load(`select count(*) as total from post p where p.id_writer=${UserID} and p.is_deleted=0
            and p.id_status=3`);
    },

    // ---------------- full text search
    searchWithTitle: title => {
        return db.load(`select p.*, c.cat_name from post p, category c 
            where p.is_deleted=0 and p.id_status=1 and p.date_posted is not null and p.date_posted<=NOW()
            and c.is_deleted=0 and p.id_category=c.id
            and match(title) against('${title}') order by p.type_post desc, p.date_posted desc`);
    },

    searchWithAbstract: abstract => {
        return db.load(`select p.*, c.cat_name from post p, category c 
            where p.is_deleted=0 and p.id_status=1 and p.date_posted is not null and p.date_posted<=NOW()
            and c.is_deleted=0 and p.id_category=c.id
            and match(abstract) against('${abstract}') order by p.type_post desc, p.date_posted desc`);
    },

    searchWithContent: content => {
        return db.load(`select p.*, c.cat_name from post p, category c 
            where p.is_deleted=0 and p.id_status=1 and p.date_posted is not null and p.date_posted<=NOW()
            and c.is_deleted=0 and p.id_category=c.id 
            and match(content) against('${content}') order by p.type_post desc, p.date_posted desc`);
    },

    // quản lý bài viết admin

    //hàm này chỉ hoạt động với bài viết chưa duyệt hoặc bị từ chối
    getListByStatus: (id_status, limit, offset) => {
        return db.load(`SELECT post.id, category.cat_name, post.title, user.name as author, post.date_posted 
        FROM post, user, category WHERE post.id_writer = user.id and post.id_category = category.id 
        and post.is_deleted = 0 and post.id_status = ${id_status} ORDER by post.id DESC LIMIT ${limit} OFFSET ${offset}`);
    },

    //hàm này chỉ hoạt động với bài viết chưa duyệt hoặc bị từ chối
    countByStatus: (id_status) => {
        return db.load(`SELECT COUNT(*) as total FROM post WHERE post.is_deleted = 0 and post.id_status = ${id_status}`);
    },

    getAcceptPost: (currentDate, limit, offset) => {
        return db.load(`SELECT post.id, category.cat_name, post.title, user.name as author, post.date_posted 
        FROM post, user, category WHERE post.id_writer = user.id and post.id_category = category.id 
        and post.is_deleted = 0 and post.id_status = '1' and post.date_posted > '${currentDate}' 
        ORDER by post.id DESC LIMIT ${limit} OFFSET ${offset}`);
    },

    countAcceptPost: (currentDate) => {
        return db.load(`SELECT COUNT(*) as total FROM post 
        WHERE post.is_deleted = 0 and post.id_status = '1' and post.date_posted > '${currentDate}'`);
    },

    getPublishedPost: (currentDate, limit, offset) => {
        return db.load(`SELECT post.id, category.cat_name, post.title, user.name as author, post.date_posted 
        FROM post, user, category WHERE post.id_writer = user.id and post.id_category = category.id 
        and post.is_deleted = 0 and post.id_status = '1' and post.date_posted < '${currentDate}' 
        ORDER by post.id DESC LIMIT ${limit} OFFSET ${offset}`);
    },

    countPublishedPost: (currentDate) => {
        return db.load(`SELECT COUNT(*) as total FROM post 
        WHERE post.is_deleted = 0 and post.id_status = '1' and post.date_posted < '${currentDate}'`);
    },


    getDetailByID: PostID => {
        return db.load(`select p.*, c.cat_name from post p, category c 
            where p.is_deleted=0 and c.is_deleted=0 and p.id=${PostID} and p.id_category=c.id`);
    },

    add: entity => {
        return db.add('post', entity);
    },

    update: entity => {
        return db.update('post', 'id', entity);
    },

    delete: id => {
        return db.delete('post', 'id', id);
    }
}