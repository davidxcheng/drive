(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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
				console.dir(places[0]);
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
},{"./search":3,"./show":4}],2:[function(require,module,exports){
var drive = require('./drive');

$(document).ready(function() {
	drive.init();
});

},{"./drive":1}],3:[function(require,module,exports){
module.exports = function(collection) {

	var find = function(searchPhrase) {
		var result = [];

		if (isNaN(searchPhrase) == false) {
			// search by ID
			var id = searchPhrase;

			this.some(function(item) {
				if (item.id == id)
					result.push(item);
				
				return item.id == id;
			});
		}

		return result;
	};

	return {
		find: find.bind(collection)
	};
};
},{}],4:[function(require,module,exports){
module.exports = (function() {

	var	elCloseSidebar = document.getElementsByClassName('close-sidebar')[0];
	elCloseSidebar.addEventListener('click', function() {
		sidebar.classList.remove('show-sidebar');
	});

	return {
		details: function(station) {
			stationName.innerText = station.name;
			stationStreetAdr.innerText = station.adr.street;
			stationPhone.innerText = station.phone[0];
			stationHours.innerHTML = station.hours.reduce(function(concat, item) {
				return concat + '<li>' + item + '</li>';
			}, '');

			if (!sidebar.classList.contains('show-sidebar'))
				sidebar.classList.add('show-sidebar');
		}
	};
})();
},{}]},{},[2])