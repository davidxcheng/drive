$(document).ready(function() {
	$('#when').datepicker({ format: 'yyyy-mm-dd', todayHighlight: true });
	$('#find').on('click', function(e) {
		e.preventDefault();
		console.dir({
			vehicle: $('#which').val(),
			when: $('#where').val(),
			where: where
		});
	});

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
				console.log(station.id);
			});
		})
	};
});