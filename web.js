var express = require('express');
var app = express(express.logger());
app.use(express.bodyParser());
var mongo = require('mongodb');

var Server = mongo.Server,
    Db = mongo.Db,
    BSON = mongo.BSONPure;
 
var server = new Server('localhost', 27017, {auto_reconnect: true});
db = new Db('scores', server);
var port = process.env.PORT || 3000;
app.set('port', process.env.PORT || 3000);

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
	res.header("Access-Control-Allow-Origin","*");
	res.header("Access-Control-Allow-Headers", "X-Requested-With");
	var search = req.query.game_title;

    db.collection('scores', function(err, collection) {
        collection.find({game_title: search}).sort({score: -1}).limit(10).toArray(function(err, items) {
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

app.get('/usersearch', function(req, res) {
	res.set('Content-Type', 'text/html');
	res.send('<head><title>UserSearch</title></head><body><form name="input" action="searchresults" method="get">Search: <input type="text" name="username" id="input"><input type="submit" id="submit" value="Submit"></form></body>');
});

app.get('/searchresults', function(req, res) {
	var search = req.query.username;
	
    db.collection('scores', function(err, collection) {
        collection.find({username: search}).sort({score: -1}).toArray(function(err, items) {
            res.send(items);
        });
    });	
});

app.listen(port);
listen(app.get('port'));