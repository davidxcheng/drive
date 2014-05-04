var page = require('page'),
	start = require('./start-page'),
	drive = require('./drive');

	page('/', start(page));
	page('/karta', drive.init);

$(document).ready(function() {
	//drive.init();
	page.start();
});
