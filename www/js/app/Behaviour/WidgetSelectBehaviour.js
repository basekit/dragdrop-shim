define([
	"jquery",
	"app/Behaviour/WidgetMoveBehaviour"
], function($, WidgetMoveBehaviour) {

	var WidgetSelectBehaviour = {
		load: function (el, frame, widgetDragElId) {

			var iframeBoundaries = null;

			// When you click them...
			frame.contentWindow.$(el).on('mousedown', function () {

				WidgetMoveBehaviour.load(this, frame, widgetDragElId)
			
			});
		}
	};

	return WidgetSelectBehaviour;
		
});