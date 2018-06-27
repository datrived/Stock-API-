

var mongoose = require('mongoose');


var PortfolioSchema = new mongoose.Schema({
	username: String,
	tickers: [mongoose.Schema.Types.Mixed]
});

module.exports = mongoose.model('Portfolio', PortfolioSchema);