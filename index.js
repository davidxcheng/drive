var express = require('express'),
	http 	= require('http');

var app = express();

app.set('views', __dirname + '/views')
app.set('view engine', 'jade');

// setup stylus with custom compile
var stylus = require('stylus');
function compile(str, path) {
	return stylus(str).define('url', stylus.url({ limit: 1000000 }));	
}

app.use(stylus.middleware({ 
	src: 		__dirname + '/public',
	compile: 	compile
}));

app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res){
	res.render('index', { title: 'drive' });
});

http.createServer(app).listen(4500, function(){
	console.log('Listening on port 45000');
});