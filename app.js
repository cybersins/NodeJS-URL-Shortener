var Datastore = require('nedb');
var express = require('express');
var app = express();
var rstr = require("randomstring");

app.get('/', function (req, res) {
  res.sendFile(__dirname + "/views/index.html");
});

app.get('/new/:url', function (req, res) {
  var id = rstr.generate(7);
  var url = req.params.url;
  mydb.insert({id: id, url: url}, function (err, newDoc) {
    if(err) return res.json({success: false, msg: "Failed to create URL!", error: err});

    return res.json({success: true, id: id});
  });
});
app.get('/:id', function (req, res) {
  var id = req.params.id;
  mydb.find({ id: id }, function (err, docs) {
    if(err) return res.json({success: false, msg: "Failed to locate URL!", error: err});
    if(docs.length < 1) return res.json({success: false, msg: "URL not found!"});

    return res.redirect(docs[0].url);
  });
});


var mydb = new Datastore({ filename: './db' });
mydb.loadDatabase(function (err) {
  if(err) throw err;
  mydb.persistence.setAutocompactionInterval(86400000);

  app.listen(3024, function () {
    console.log('Listening...');
  });
});
