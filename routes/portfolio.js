var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var Company = require('../models/Company.js');
var Stock = require('../models/Stock.js');
var Portfolio = require('../models/Portfolio.js');



router.get('/api/:name',function(req, res, next) {
	
		Company.find({}, function (err, c) {
			if (err) return res.sendStatus(404);
			let tickers = [];
			
			c.forEach(function(company) {
			  tickers.push(company.ticker.split(' ')[0]);
			});
			Portfolio.findOne({username: req.params.name}, function (err, p) {
				if (err) p=[];
				console.log(p);
			res.send({tickers: tickers, portfolio: p});
		   });
		});
});

router.post('/api', function(req, res, next) {

	Portfolio.find({username: req.params.username}, function (err, p) {
		let uname = req.body.username;
		
		if (err) return res.sendStatus(404);
		
		let plist = [];
		req.body.portfolio.forEach(function(pp){
			//console.log(pp);
			plist.push([pp[0], pp[1]]);
		});
		console.log(p);
		//console.log(plist);
		if(p==null){
			Portfolio.create({username: uname, tickers: plist}, function (err, post) {
				if (err) console.log(err);
			});
		}
		else{
			Portfolio.remove({username: req.body.username}, function (err, post) {
				if (err) console.log(err);
				Portfolio.create({username: uname, tickers: plist}, function (err, post) {
					if (err) console.log(err);
				});
			});
			
		}
		console.log(req.body.username);
	res.json(plist);
	});
	
});


router.get('/stock/:name', function(req, res, next) { 
	let st1=[];
	Stock.find({name: req.params.name},function (err, s) {
		if (err) return res.sendStatus(404);
		s.forEach(function(st){
		  let n = st.date.split('/');
		  let utcn = Date.UTC(n[2], n[0], n[1]);
		  //console.log(Number.isInteger(utcn));
		  
			st1.push([utcn, st.price]);
		 
		});
		st1.sort(function(a, b){
			return a[0]-b[0];
		  });
		res.json(st1);
		
	});
});

router.get('/api/all/all', function(req, res, next) {
	Portfolio.find({}, function (err, p) {
		if (err) return res.sendStatus(404);
		res.json({portfolio:p});
	});
});

router.delete('/api/all', function(req, res, next) { 
	Portfolio.remove({}, function(err) {
		if(err) { return handleError(res, err); }
	  });
	  res.json("SucessFully deleted!");
});




module.exports = router;


