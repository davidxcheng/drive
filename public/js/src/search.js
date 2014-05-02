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

	var findNearest = function(currentPosition, options) {
		var result = [],
			defaultRadius = 2.5 * 10 * 1000;

		options = options || {};
		maxResultSize = options.maxResultSize || 3;
		maxDistanceInMeters = options.maxDistanceInMeters || defaultRadius;

		// Compute distance to each item
		collection.forEach(function(item) {
			// todo: roll your own and remove google dependency
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