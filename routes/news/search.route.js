var express = require('express');
var router = express.Router();

var moment = require('moment');

var post_model = require('../../models/post.model');
var tag_model = require('../../models/tag.model');

router.post('/', (req, res, next) => {
    res.locals.pageTitle = 'Tìm kiếm';
    // search tìm kiếm mặc định là theo tên

    const search_text = req.body.search_text;

    post_model.searchWithTitle(search_text)
        .then(rows => {

            let posts = rows;
            if (posts.length > 0) {
                posts = posts.map((val, idx) => {
                    val.date_posted = moment(val.date_posted).format('DD/MM/YYYY HH:mm');
                    return val;
                })

                Promise
                    .all(
                        posts.map((val, idx) => {
                            return tag_model.getTagsByPostId(val.id)
                        })
                    )
                    .then(tags => {
                        for (let i = 0; i < posts.length; i++) {
                            posts[i].tags = tags[i];
                        }

                        return res.render('news/search', {
                            search_text : search_text,
                            posts: posts,
                            isAdvancedSearch: false
                        })
                    })
                    .catch(next)
            } else {
                return res.render('news/search', {
                    search_text : search_text,
                    posts: posts,
                    isAdvancedSearch: false
                })
            }
        })
        .catch(next)
})


router.post('/advanced', (req, res, next) => {
    res.locals.pageTitle = 'Tìm kiếm';

    const { search_title, search_abstract, search_content } = req.body;

    Promise
        .all([
            typeof search_title !== 'undefined' ? post_model.searchWithTitle(search_title) : Promise.resolve(),
            typeof search_abstract !== 'undefined' ? post_model.searchWithAbstract(search_abstract) : Promise.resolve(),
            typeof search_content !== 'undefined' ? post_model.searchWithContent(search_content) : Promise.resolve(),
        ])
        .then(([post_with_title, post_with_abstract, post_with_content]) => {
            let posts = [];
            if (typeof post_with_title !== 'undefined'){
                posts = posts.concat(post_with_title);
            }
            if (typeof post_with_abstract !== 'undefined'){
                posts = posts.concat(post_with_abstract);
            }
            if (typeof post_with_content !== 'undefined'){
                posts = posts.concat(post_with_content);
            }

            let uniquePosts = Array.from(new Set(posts.map(val => val.id)))
                                .map(id => posts.find(post => post.id === id));

            uniquePosts = uniquePosts.map(val => {
                val.date_posted = moment(val.date_posted).format('DD/MM/YYYY HH:mm');
                return val;
            })

            Promise
                .all(
                    uniquePosts.map(val => tag_model.getTagsByPostId(val.id))
                )
                .then(tags => {
                    for (let i = 0; i < tags.length; i++){
                        uniquePosts[i].tags = tags[i];
                    }

                    return res.render('news/search', {
                        search_values : {
                            search_title : search_title,
                            search_abstract : search_abstract, 
                            search_content : search_content
                        },
                        posts: uniquePosts,
                        isAdvancedSearch: true
                    })
                })
                .catch(next)
        })
        .catch(next);
})

module.exports = router;
