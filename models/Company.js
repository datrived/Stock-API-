var mongoose = require('mongoose');
//var Stock = require('./Stock.js');



//mongoose.model('Stock', StockSchema);
var CompanySchema = new mongoose.Schema({
	ticker: String,
	name: String,
	filename: String,
	description: String,
	sector: String,
	industry: String,
	industry_grp: String,
	sub_industry_grp: String,
});

module.exports = mongoose.model('Company', CompanySchema);