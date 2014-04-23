(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
function init() {
	var where = {
		lat: 0,
		lng: 0
	};

	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(
			function successCallback(pos) {
				where.lat = pos.coords.latitude;
				where.lng = pos.coords.longitude;

				$.getJSON('fake/service-stations.json', function(stations) {
					initMap(where, stations, 'map');
				});
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
	}

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
				position: new google.maps.LatLng(station.lat, station.lng),
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
		sidebar.classList.add('show-sidebar');
	}

	elCloseSidebar.addEventListener('click', function(e) {
		sidebar.classList.remove('show-sidebar');
	});
}

module.exports = {
	init: init
};
},{}],2:[function(require,module,exports){
var drive = require('./drive.js');

$(document).ready(function() {
	drive.init();
});

},{"./drive.js":1}]},{},[2])