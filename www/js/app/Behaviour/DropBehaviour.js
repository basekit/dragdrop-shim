define([
	"drop"
], function(Droppable) {
	var DropBehaviour = {
		load: function (el, iframe) {
			return new Droppable( el, {
				onDrop: function () {
					console.log(arguments);
				},
				frameEl: iframe
			});
		}
	};

	return DropBehaviour;
		
});