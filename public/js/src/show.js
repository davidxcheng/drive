module.exports = (function() {

	var	elCloseSidebar = document.getElementsByClassName('close-sidebar')[0];
	elCloseSidebar.addEventListener('click', function() {
		sidebar.classList.remove('show-sidebar');
	});

	btnCall.addEventListener('click', function() {
		lblPhone.classList.remove('hide');
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