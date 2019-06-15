var db = require('../utils/database');

module.exports = {
    withPostIDAndWeek : (PostID, beginOfWeek) => {
        return db.load(`select * from view_weeks where id_post=${PostID} and week='${beginOfWeek}'`);
    },

    createViewInWeek : (entity) => {
        return db.add('view_weeks', entity);
    },

    increaseViews : (entity) => {
        return db.update('view_weeks', 'id', entity);
    }
};
