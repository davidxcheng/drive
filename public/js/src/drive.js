function init() {
	var search = require('./search'),
		show = require('./show'),
		stations = null;

	$.getJSON('fake/service-stations.json', function(data) {
		stations = data;
	});

	if (!navigator.geolocation)
		return;

	navigator.geolocation.getCurrentPosition(
		function successCallback(pos) {
			var center = {
				lat: pos.coords.latitude,
				lng: pos.coords.longitude
			};

			if (stations)
				initMap(center, stations, 'map');
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

	function initMap(center, stations, selector) {
		var options = {
			center: new google.maps.LatLng(center.lat, center.lng),
			zoom: 14,
			mapTypeId: google.maps.MapTypeId.ROADMAP // MAP | SATTELITE | ROADMAP
		};
		
		var map = new google.maps.Map(document.getElementById(selector), options);

		// Add search box
		map.controls[google.maps.ControlPosition.TOP_CENTER].push(mapSearch);
		var searchBox = new google.maps.places.SearchBox(mapSearch);
		google.maps.event.addListener(searchBox, 'places_changed', function() {
			var places = searchBox.getPlaces();
			if (places) {
				var coords = new google.maps.LatLng(
					places[0].geometry.location.k, 
					places[0].geometry.location.A);
				map.panTo(coords);
			}
		});

		// Add marker that shows where user is
		var youAreHere = new google.maps.Marker({
			position: new google.maps.LatLng(center.lat, center.lng),
			map: map
		});

		google.maps.event.addListener(youAreHere, 'click', function(e) {
			mapSearch.classList.remove('hide');
			mapSearch.focus();
		});

		// Add markers for stations
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

	function showStationDetails(stationId) {
		var station = search(stations).find(stationId)[0];
		show.details(station);
	}
}

module.exports = {
	init: init
};