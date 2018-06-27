var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var bodyParser = require('body-parser');

var file = require('./routes/file');
var apidata = require('./routes/company');
var portfolio = require('./routes/portfolio');
var app = express();
var engines = require('consolidate');

var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
mongoose.connect('mongodb://localhost/myStock', { promiseLibrary: require('bluebird') })
  .then(() =>  console.log('connection succesful'))
  .catch((err) => console.error(err));


  //app.set('views', __dirname + '/dist');
  //app.engine('html', engines.mustache);
  //app.set('view engine', 'html');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({'extended':'false'}));
app.use(express.static(path.join(__dirname, 'dist')));

app.use('/api', express.static(path.join(__dirname, 'dist')));
app.use(function(req, res, next) {
	//set headers to allow cross origin request.
		res.header("Access-Control-Allow-Origin", "*");
		res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
		res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
		next();
});
app.use('/file', file);

app.use('/company', apidata);
app.use('/portfolio', portfolio);
// catch 404 and forward to error handler
app.use(function(req, res, next) {
	res.sendFile(path.join(__dirname, 'dist/index.html'));
});

module.exports = app;