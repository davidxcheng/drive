$(document).ready(function() {
	$('#when').datepicker({ format: 'yyyy-mm-dd', todayHighlight: true });

	var coords = {
		lat: 0,
		lng: 0
	};

	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(
			function successCallback(pos) {
				coords.lat = pos.coords.latitude;
				coords.lng = pos.coords.longitude;

				initMap(coords, 'map');
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

	function initMap(coords, selector) {
		var options = {
			center: new google.maps.LatLng(coords.lat, coords.lng),
			zoom: 14,
			mapTypeId: google.maps.MapTypeId.MAP // MAP | SATTELITE
		};
		
		var map = new google.maps.Map(document.getElementById(selector), options);
		new google.maps.Marker({
			position: new google.maps.LatLng(coords.lat, coords.lng),
			map: map
		});
	};
});