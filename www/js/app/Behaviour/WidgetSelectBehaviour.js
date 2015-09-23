(function($, WidgetMoveBehaviour) {
    'use strict';

	window.WidgetSelectBehaviour = {
		load: function (el, frame, widgetDragElId) {

			var iframeBoundaries = null;

			// When you click them...
			frame.contentWindow.$(el).on('mousedown', function () {

				WidgetMoveBehaviour.load(this, frame, widgetDragElId)

			});
		}
	};
}($, window.WidgetMoveBehaviour));
