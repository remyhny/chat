var conf = require('../conf.json');
var logger = exports;
logger.debugLevel = 'warn';
logger.log = function(level, message) {
    if (conf.debug)
    {
    var levels = ['error', 'warn', 'info'];
    if (levels.indexOf(level) >= levels.indexOf(logger.debugLevel) ) {
	if (typeof message !== 'string') {
	    message = JSON.stringify(message);
	};
	console.log(level+': '+message);
    }
    }
}
