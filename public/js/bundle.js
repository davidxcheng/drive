(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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
},{"./search":3}],2:[function(require,module,exports){
var drive = require('./drive.js');

$(document).ready(function() {
	drive.init();
});

},{"./drive.js":1}],3:[function(require,module,exports){
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
},{}]},{},[2])