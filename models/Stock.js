var mongoose = require('mongoose');


var StockSchema = new mongoose.Schema({
	date: String,
	price: Number,
	volume: String,
	name: String,
});

module.exports = mongoose.model('Stock', StockSchema);