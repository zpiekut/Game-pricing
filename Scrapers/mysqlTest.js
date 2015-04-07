var mysql = require('mysql');
 
var connection = mysql.createConnection(
    {
      host     : 'localhost',
      user     : 'root',
      database : 'game_collection',
    }
);
 
connection.connect();
 
var queryString = 'SELECT * FROM games';
 
connection.query(queryString, function(err, rows, fields) {
    if (err) throw err;
 
    for (var i in rows) {
        console.log('Post Titles: ', rows[i].loose_price);
    }
});
 
connection.end();