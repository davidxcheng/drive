function init() {
	var search = require('./search'),
		show = require('./show'),
		currentPositionMarker = null,
		stations = null;

	$.getJSON('fake/service-stations.json', function(data) {
		stations = data;
	});

	if (!navigator.geolocation)
		return;

	navigator.geolocation.getCurrentPosition(
		function successCallback(pos) {
			mapSearch.placeholder = 'Inte där du vill vara?';

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
			mapTypeId: google.maps.MapTypeId.ROADMAP // MAP | SATTELITE | ROADMAP
		};
		var map = new google.maps.Map(document.getElementById(selector), options);

		// Add marker that shows where user is
		currentPositionMarker = new google.maps.Marker({
			position: new google.maps.LatLng(center.lat, center.lng),
			map: map
		});

		initSearchBox(map);

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

			station.position = marker.position;

			google.maps.event.addListener(marker, 'click', function(e) {
				showStationDetails(station.id);
			});
		});

		showNearestStations(map);
	}

	function initSearchBox(map) {
		// Add search box
		map.controls[google.maps.ControlPosition.TOP_LEFT].push(mapSearch);
		var searchBox = new google.maps.places.SearchBox(mapSearch);

		// Bias the search box results to places in Sweden.
		var malmo = new google.maps.LatLng(55.491660, 13.464124),
			uppsala = new google.maps.LatLng(59.900274, 17.990491);
		searchBox.setBounds(new google.maps.LatLngBounds(malmo,	uppsala));

		google.maps.event.addListener(searchBox, 'places_changed', function() {
			var places = searchBox.getPlaces();
			if (places) {
				var coords = places[0].geometry.location;

				currentPositionMarker.setMap(null);
				currentPositionMarker.position = coords;
				currentPositionMarker.setMap(map);

				showNearestStations(map);

				map.panTo(coords);
			}
		});
	}

	function showNearestStations(map) {
		var nearestStations = search(stations).findNearest(currentPositionMarker.position, 3),
			bounds = new google.maps.LatLngBounds();

		// Set map boundries
		bounds.extend(currentPositionMarker.position);
		nearestStations.forEach(function(nearbyStation) {
			bounds.extend(nearbyStation.position);
		});

		console.log('fit bounds');
		console.dir(bounds);
		map.fitBounds(bounds);
	}

	function showStationDetails(stationId) {
		var station = search(stations).findById(stationId);
		show.details(station);
	}
}

module.exports = {
	init: init
};