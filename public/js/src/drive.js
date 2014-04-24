function init() {
	var search = require('./search'),
		stations = null;

	$.getJSON('fake/service-stations.json', function(data) {
		stations = data;
	});

	var where = {
		lat: 0,
		lng: 0
	};

	if (!navigator.geolocation)
		return;

	navigator.geolocation.getCurrentPosition(
		function successCallback(pos) {
			where.lat = pos.coords.latitude;
			where.lng = pos.coords.longitude;

			if (stations)
				initMap(where, stations, 'map');
			else
				console.log('no stations loaded');
		},
		function errorCallback(error) { 
			switch(error.code) {
				case error.TIMEOUT:
					console.log('Timeout. Msg: ' + error.message);
					break;
				case error.PERMISSION_DENIED:
					console.log('Permission denied. Msg: ' + error.message);
					break;
				case error.POSITION_UNAVAILABLE:
					console.log('Position unavailable. Msg: ' + error.message);
					break;
			};
		},
		{
			enableHighAccuracy: true,
			maximumAge: 1000
		});

	function initMap(youAreHere, stations, selector) {
		var options = {
			center: new google.maps.LatLng(youAreHere.lat, youAreHere.lng),
			zoom: 14,
			mapTypeId: google.maps.MapTypeId.MAP // MAP | SATTELITE
		};
		
		var map = new google.maps.Map(document.getElementById(selector), options);
		new google.maps.Marker({
			position: new google.maps.LatLng(youAreHere.lat, youAreHere.lng),
			map: map
		});

		var markerIcon = 'img/trade-marker.png';

		stations.forEach(function(station) {
			var marker = new google.maps.Marker({
				title: station.title,
				icon: markerIcon,
				animation: google.maps.Animation.DROP,
				position: new google.maps.LatLng(station.coords.lat, station.coords.lng),
				map: map
			});

			google.maps.event.addListener(marker, 'click', function(e) {
				showStationDetails(station.id);
			});
		})
	};

	var	elSidebar = sidebar,
		elCloseSidebar = document.getElementsByClassName('close-sidebar')[0];

	function showStationDetails(stationId) {
		var station = search(stations).find(stationId);

		console.dir(station);

		sidebar.classList.add('show-sidebar');
	}

	elCloseSidebar.addEventListener('click', function(e) {
		sidebar.classList.remove('show-sidebar');
	});
}

module.exports = {
	init: init
};