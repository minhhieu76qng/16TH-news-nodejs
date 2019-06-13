var db = require('../utils/database');

module.exports = {
    byCat : (CatId) => {
        return db.load(`select * from post where is_deleted=0 and (id_status=4 or id_status=3) and id_category = ${CatId} order by date_posted desc`);   
    },


}