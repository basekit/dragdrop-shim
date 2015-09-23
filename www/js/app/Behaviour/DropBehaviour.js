(function(Droppable, $) {
    'use strict';

	window.DropBehaviour = {
		load: function (el, iframe) {
			return new Droppable( el, {
				onDrop: function () {
					console.log(arguments);
					var dropEl = arguments[0].el;

					// Just highlight the element for now!
					$(dropEl).addClass('drop-feedback');
					setTimeout(function () {
						$(dropEl).removeClass('drop-feedback');
					}, 500);

				},
				frameEl: iframe
			});
		}
	};
}(window.Droppable, $));
