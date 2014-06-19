module.exports = (function() {

	var	elCloseSidebar = document.getElementsByClassName('close-sidebar')[0];
	elCloseSidebar.addEventListener('click', function() {
		sidebar.classList.remove('show-sidebar');
	});

	btnCall.addEventListener('click', function() {
		lblPhone.classList.remove('hide');
	});

	var startx, starty;
	sidebar.addEventListener('touchstart', function(e) {
		var to = e.changedTouches[0];
		startx = parseInt(to.clientX);
		starty = to.clientY;
		odo.innerText = 'start';
	});

	sidebar.addEventListener('touchmove', function(e) {
		var touchObject = e.changedTouches[0];
		odo.innerText = +touchObject.clientX - startx;
	});

	sidebar.addEventListener('touchend', function(e) {
		var touchObject = e.changedTouches[0];

		if ((+touchObject.clientX - startx) < -9) {
			sidebar.classList.remove('show-sidebar');
		}
	});

	return {
		details: function(station) {
			lblPhone.classList.add('hide');

			stationName.innerText = station.name;
			stationStreetAdr.innerText = station.adr.street;
			stationHours.innerHTML = station.hours.opened.reduce(function(concat, item) {
				return concat + '<li>' + item + '</li>';
			}, '');
			btnBook.href = station.booking.url;
			btnCall.href = 'tel:' + station.booking.phone.replace(/[^0-9]/g, '');
			lblPhone.innerText = station.booking.phone;

			if (!sidebar.classList.contains('show-sidebar'))
				sidebar.classList.add('show-sidebar');
		}
	};
})();