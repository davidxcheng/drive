(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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

				map.panTo(coords);
				showNearestStations(map);
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
},{"./search":3,"./show":4}],2:[function(require,module,exports){
var drive = require('./drive');

$(document).ready(function() {
	drive.init();
});

},{"./drive":1}],3:[function(require,module,exports){
module.exports = function(collection) {

	var findById = function(id) {
		var result = null;

		collection.some(function(item) {
			if (item.id == id)
				result = item;
			
			return item.id == id;
		});

		return result;
	};

	var findNearest = function(currentPosition, maxResultSize) {
		var result = [],
			maxDistanceInMeters = 2.5 * 10 * 1000;

		// Compute distance to each item
		collection.forEach(function(item) {
			item.distance = google.maps.geometry.spherical.computeDistanceBetween(
				currentPosition, 
				new google.maps.LatLng(item.coords.lat, item.coords.lng))
		});

		// Sort by distance
		result = collection.sort(function(a, b) {
			if (a.distance < b.distance)
				return -1;
			if (a.distance > b.distance)
				return 1;
			return 0;
		});

		if (result.length > maxResultSize)
			result = result.slice(0, maxResultSize);

		result = result.filter(function(item, index) {
			// Don't risk to empty the whole result
			if (index == 0) 
				return true;

			return item.distance < maxDistanceInMeters;
		});

		return result;
	}

	return {
		findById: findById,
		findNearest: findNearest
	};
};
},{}],4:[function(require,module,exports){
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
			stationHours.innerHTML = station.hours.reduce(function(concat, item) {
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
},{}]},{},[2])