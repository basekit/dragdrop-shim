(function($) {
    'use strict';

	function isiOSSafari() {
        return (navigator.userAgent.match(/Version\/[\d\.]+.*Safari/) && /iPad|iPhone|iPod/.test(navigator.platform)) ? true : false;
	}

	window.WidgetMoveBehaviour = {
		load: function (el, frame, widgetDragElId) {

			var iframeBoundaries = null,
				offset = $(el).offset(),
				frameOffset = {},
				iframeWindow = frame.contentWindow ? frame.contentWindow : frame.contentDocument.defaultView,
				scrollWin = isiOSSafari() ? window : iframeWindow;

			// Show a drag handle in the main document
			// And position it over the widget

			$(widgetDragElId).css('display', 'block');

			// RH:This is a pain in iOS as the iframe this value
			// yeilds a different result as scrolling frame is the main window
			// In all other browsers, its the iframewindow.
			iframeBoundaries = frame.getBoundingClientRect();

			frameOffset.top = iframeBoundaries.top;
			frameOffset.left = iframeBoundaries.left;

			// Offset the handle to include the scroll offset.
			// iOS likes the stretch all frames out to their
			// full height, rather than letting them scroll
			// in the window (rather annoying!). So we have
			// to use the main window scroll offset, rather
			// than the iframe window scroll offset.
			// ----------------------------------------------
			// Why is one number positive and one number negative?
			//
			//  - If frame is full height, top window is the scrolling element, click whilst scrolled
			//		-- offset.top never changes. 						= 116.90625
			//		-- scroll increases positively.						= 175
			//		-- frame offset decreases negatively				= -75
			//
			//  - If frame is scrolling element and window is viewport height, click whilst scrolled
			//		-- offset.top never changes. 						= 116.90625
			//      -- scroll decreases negatively (when we flip it)	= -75
			//      -- frame offset never changes						= 100
			//
			frameOffset.scrollX = (isiOSSafari() ? scrollWin.pageXOffset : -(scrollWin.pageXOffset));
			frameOffset.scrollY = (isiOSSafari() ? scrollWin.pageYOffset : -(scrollWin.pageYOffset));

			// TEST LOG
			//console.log(offset.top);
			//console.log(frameOffset.scrollY);
			//console.log(frameOffset.top);

			$(widgetDragElId).offset({
				top:offset.top + frameOffset.scrollY + frameOffset.top,
				left:offset.left + frameOffset.scrollX + frameOffset.left
			});
		}
	};
}($));
