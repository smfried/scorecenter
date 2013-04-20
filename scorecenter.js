var express = require('express');
var app = express(express.logger());
app.use(express.bodyParser());
var mongo = require('mongodb');

var Server = mongo.Server,
    Db = mongo.Db,
    BSON = mongo.BSONPure;
 
var server = new Server('localhost', 27017, {auto_reconnect: true});
db = new Db('scores', server);
 

app.post('/submit.json', function(req, res) {
	res.header("Access-Control-Allow-Origin","*");
	res.header("Access-Control-Allow-Headers", "X-Requested-With");
	var game_title = req.body.game_title;
	var username = req.body.username;
	var score = parseInt(req.body.score);
	var created_at = Date();
	var toInsert = {"game_title":game_title,"username":username,"score":score,"created_at":created_at};
			
	db.collection('scores', function(err, collection) {
		collection.insert(toInsert, {safe:true}, function(err, result) {
			if (err) {
				res.send({'error': 'there was an error'});
			} 
		});
		});
		
});

app.get('/highscores.json', function(req, res) {
	var search = req.query.game_title;

    db.collection('scores', function(err, collection) {
        collection.find({game_title: search}).toArray(function(err, items) {
            res.send(items);
        });
    });
});

app.get('/', function(req, res) {
    db.collection('scores', function(err, collection) {
        collection.find().toArray(function(err, items) {
            res.send(items);
        });
    });
});
/*
app.get('/usersearch', function(req, res) {

});

 */
app.listen(3000);
console.log('Listening on port 3000...');