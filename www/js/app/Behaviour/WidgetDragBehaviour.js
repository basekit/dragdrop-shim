define([
	"jquery"
], function($) {

	function isiOSSafari() {
        return (navigator.userAgent.match(/Version\/[\d\.]+.*Safari/) && /iPad|iPhone|iPod/.test(navigator.platform)) ? true : false;
	}

	var WidgetDragBehaviour = {
		load: function (el, frame, widgetDragElId) {

			var iframeBoundaries = null;

			// When you click them...
			frame.contentWindow.$(el).on('mousedown', function () {

				// Show a drag handle in the main document
				$(widgetDragElId).css('display', 'block');

				// And position it over the widget (HARD!)
				var offset = $(el).offset(),
					offsetVar = {},
					scrollWin = isiOSSafari() ? window : frame.contentWindow;

				// RH:This is a pain in iOS as the iframe this value
				// yeilds a different result as scrolling frame is the main window
				// In all other browsers, its the iframewindow. 
				iframeBoundaries = frame.getBoundingClientRect();

				offsetVar.top = iframeBoundaries.top;
				offsetVar.left = iframeBoundaries.left;

				// Offset the handle to include the scroll offset
				// REMEMBER! pageXOffset sometimes comes back as
				// a negative number. We Math.abs() it to positive
				offsetVar.scrollX = (isiOSSafari() ? scrollWin.pageXOffset : -(scrollWin.pageXOffset));
				offsetVar.scrollY = (isiOSSafari() ? scrollWin.pageYOffset : -(scrollWin.pageYOffset));

				$(widgetDragElId).offset({
					top:offset.top + offsetVar.scrollY + offsetVar.top,
					left:offset.left + offsetVar.scrollX + offsetVar.left
				});
			});
		}
	};

	return WidgetDragBehaviour;
		
});