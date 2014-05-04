module.exports = function(page) {
	var drive = require('./drive');

	var elStartPage	= document.getElementById('start-page'),
		elMap		= document.getElementById('map'),
		ctaButton	= document.getElementById('btnGoToMap');

	return function() {
		elStartPage.classList.remove('hide');

		ctaButton.addEventListener('click', function(e) {
			elStartPage.classList.add('hide');
			page('/karta');
		});
	};
}