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