module.exports = (function() {

	var	elCloseSidebar = document.getElementsByClassName('close-sidebar')[0];
	elCloseSidebar.addEventListener('click', function() {
		sidebar.classList.remove('show-sidebar');
	});

	return {
		details: function(station) {
			stationName.innerText = station.name;
			stationStreetAdr.innerText = station.adr.street;
			stationPhone.innerText = station.booking.phone;
			stationHours.innerHTML = station.hours.reduce(function(concat, item) {
				return concat + '<li>' + item + '</li>';
			}, '');

			if (!sidebar.classList.contains('show-sidebar'))
				sidebar.classList.add('show-sidebar');
		}
	};
})();