//import { dirname } from 'path';

var express = require('express');
var router = express.Router();
var multer = require('multer');
var cluster = require('cluster');
var path = require('path');
var csv = require("csv");
var Company = require('../models/Company.js');
var Stock = require('../models/Stock.js')
// loads the csv module referenced above.
var Portfolio = require('../models/Portfolio.js');
var obj = csv(); 

var DIR = './uploads';
dir = __dirname + '/uploads';
var fs = require('fs');

if (!fs.existsSync(DIR)) {
  fs.mkdirSync(DIR);
}

var storage = multer.diskStorage({
	destination: function (req, file, cb) {
	  cb(null, './uploads')
	},
	filename: function (req, file, cb) {
	  cb(null, file.originalname)
	}
  })
var upload = multer({ storage: storage })



router.post("/", upload.array("uploads[]", 20), function (req, res) {
  //console.log('files', req.files);
  let list = req.files;
  let companyfile;
  let stockFiles = [];
  for(let i=0;i<list.length; i++){
    //console.log(list[i].originalname);
    if(list[i].originalname === 'Description.csv'){
      //console.log("yes");
      companyfile = 'Description.csv';
    }
    else{
      stockFiles.push(list[i].originalname);
    }
    
  }
  if(companyfile!==undefined){
    //if compant already there
    Company.remove({}, function(err) {
      if(err) { return handleError(res, err); }});
    let companyList = [];
    obj = csv(); 
    obj.from.path('./uploads/Description.csv').to.array(function (data) {
        
      for (let index = 1; index < data.length; index++) {
          
          companyList.push({ticker: data[index][0], name: data[index][1],filename: data[index][0].split(' ')[0],description: data[index][2], sector:data[index][3], industry:data[index][4] , industry_grp:data[index][5] , sub_industry_grp: data[index][6]});
          Company.create({ticker: data[index][0], name: data[index][1],filename: data[index][0].split(' ')[0],description: data[index][2], sector:data[index][3], industry:data[index][4] , industry_grp:data[index][5] , sub_industry_grp: data[index][6] }, function (err, post) {
            if (err) return console.log(err);
            
          }); 
      }
    });
  }

if(stockFiles.length > 0 ){
  
      for (var i = 0; i < stockFiles.length; i++) {
        
        let filename= stockFiles[i].substring(0, stockFiles[i].length -4);
        console.log(filename);
        obj = csv(); 
        obj.from.path('./uploads/'+stockFiles[i]).to.array(function (data) {
        
          for (let index = 1; index < data.length; index++) {
              
              //companyList.push({ticker: data[index][0], name: data[index][1],filename: data[index][0].split(' ')[0],description: data[index][2], sector:data[index][3], industry:data[index][4] , industry_grp:data[index][5] , sub_industry_grp: data[index][6], stocks: [] });
              Stock.create({date: data[index][0], price: data[index][1],volume: data[index][2], name: filename}, function (err, post) {
                if (err) return console.log(err);
                
              }); 
          }
        }); //
      }
      }
  res.end('Ended!');
  

});




router.delete('/',function(req, res, next) { 
    
  fs.readdir(DIR, (err, files) => {
    if (err) throw err;
  
    for (const file of files) {
      fs.unlink(path.join(DIR, file), err => {
        if (err) throw err;
      });
    }
  });
  //delete company data
  Company.remove({}, function(err) {
    if(err) { return handleError(res, err); }
  });
  Stock.remove({},function(err) {
    if(err) { return handleError(res, err); }
  });
  Portfolio.remove({}, function(err) {
		if(err) { return handleError(res, err); }
	  });
    res.json({ message: 'Successfully deleted' });
});

router.get('/all', function(req, res, next) {
  Company.find(function (err, products) {
    if (err) return next(err);
    res.json(products);
  });
});

router.get('/allstock', function(req, res, next) {
  Stock.find(function (err, products) {
    if (err) return next(err);
    res.json(products);
  });
});

router.get('/allfilename', function(req, res, next) {
  Stock.find({}, 'name', function (err, products) {
    if (err) return next(err);
    res.json(products);
  });
});


module.exports = router;