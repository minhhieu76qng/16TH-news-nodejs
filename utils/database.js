var mysql = require('mysql');

var createConnection = () => {
  return mysql.createConnection({
    host: 'localhost',
    port: '3306',
    user: 'root',
    password: '',
    database: 'vn_news'
  })
}

module.exports = {
  load: (sql) => {
    return new Promise((resolve, reject) => {
      var connection = createConnection();
      connection.connect();

      connection.query(sql, (error, results, fields) => {
        if (error) {
          reject(error);
        } else {
          resolve(results);
        }
        connection.end();
      })
    })
  }
};