



var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var Company = require('../models/Company.js');
var Stock = require('../models/Stock.js');
var ss = require('simple-statistics');


/* GET ALL Company */
router.get('/api', function(req, res, next) {
  Company.find({}, function (err, c) {
    if (err) return res.sendStatus(404);
    let companies = [];
    
    c.forEach(function(company) {
      companies.push(company.name);
    });

    res.json(companies);
  });
});

router.get('/api/:name', function(req, res, next){
  Company.findOne({name: req.params.name}, function(err, c){
    if (err) return res.sendStatus(404);
    //console.log(req.params.name);
    //console.log(c.filename+'.csv');
    let temp = [];
    let vol = [];
    Stock.find({name: c.filename}, function(err2, s){
      if (err2) return res.sendStatus(404);
      s.forEach(function(st){
        let n = st.date.split('/');
        //console.log(n[2]+"," +n[1] +"," +n[0]);
        //console.log(st.price);
        temp.push([Date.UTC(n[2], n[0], n[1]), st.price]);
        vol.push([Date.UTC(n[2], n[0], n[1]), st.volume/1000000]);
      });
      temp.sort(function(a, b){
        return a[0]-b[0];
      });
      vol.sort(function(a, b){
        return a[0]-b[0];
      });
      res.send({c:c, s:temp, v:vol});
    });
    
  });
  
});


router.get('/ticker', function(req, res, next){
   Company.find({}, function (err, c) {
    if (err) return res.sendStatus(404);
    let tickers = [];
    
    c.forEach(function(company) {
      tickers.push(company.ticker.split(' ')[0]);
    });

    res.json(tickers);
   });
});

router.get('/ticker/:t1/:t2/:t3/:t4', function(req, res, next){
   let st1=[], st2=[];
    
    let from = req.params.t3.split('-');
    let to = req.params.t4.split('-');
    let todate = Date.UTC(to[0], to[1], to[2]);
    let fromdate = Date.UTC(from[0], from[1], from[2]);
   Stock.find({name: (req.params.t1).split(' ')[0]},function (err, s) {
    if (err) return res.sendStatus(404);
    s.forEach(function(st){
      let n = st.date.split('/');
      let utcn = Date.UTC(n[2], n[0], n[1]);
      //console.log(Number.isInteger(utcn));
      if(utcn<=todate && utcn>=fromdate){
        st1.push([utcn, st.price]);
      }
    });
    st1.sort(function(a, b){
      return a[0]-b[0];
    });
    console.log(st1);
    Stock.find({name: (req.params.t2).split(' ')[0]},function (err, s) {
      if (err) return res.sendStatus(404);
      s.forEach(function(st){
        let n = st.date.split('/');
        let utcn = Date.UTC(n[2], n[0], n[1]);
        //console.log(Number.isInteger(utcn));
        if(utcn<=todate && utcn>=fromdate){
          st2.push([utcn, st.price]);
        }   
      });
      st2.sort(function(a, b){
        return a[0]-b[0];
      });
      console.log(st2);
      let stock2 =[], stock1=[];
      st2.forEach(function(s){
        stock2.push(s[1]);
      });
      st1.forEach(function(s){
        stock1.push(s[1]);
      });
      console.log(stock1);
      console.log(stock2);
      let correlation = ss.sampleCorrelation(stock1, stock2).toFixed(2);
      console.log("correlation->"+correlation);
      let covar = ss.sampleCovariance(stock1, stock2).toFixed(2);
      console.log("Covar ->"+ covar);
      let variant = ss.sampleVariance(stock2).toFixed(2);
      console.log("variance->"+variant);
      var beta = (covar/variant).toFixed(2);
      console.log("Beta->"+beta);
      res.json({beta: beta, correlation: correlation});
     });
   });
   
   
   
   
});


module.exports = router;