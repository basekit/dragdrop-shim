define([
	"jquery"
], function($) {

	function isiOSSafari() {
        return (navigator.userAgent.match(/Version\/[\d\.]+.*Safari/) && /iPad|iPhone|iPod/.test(navigator.platform)) ? true : false;
	}

	var WidgetMoveBehaviour = {
		load: function (el, frame, widgetDragElId) {

			var iframeBoundaries = null,
				offset = $(el).offset(),
				offsetVar = {},
				scrollWin = isiOSSafari() ? window : frame.contentWindow;

			// Show a drag handle in the main document
			// And position it over the widget

			$(widgetDragElId).css('display', 'block');

			// RH:This is a pain in iOS as the iframe this value
			// yeilds a different result as scrolling frame is the main window
			// In all other browsers, its the iframewindow. 
			iframeBoundaries = frame.getBoundingClientRect();

			offsetVar.top = iframeBoundaries.top;
			offsetVar.left = iframeBoundaries.left;

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
			offsetVar.scrollX = (isiOSSafari() ? scrollWin.pageXOffset : -(scrollWin.pageXOffset));
			offsetVar.scrollY = (isiOSSafari() ? scrollWin.pageYOffset : -(scrollWin.pageYOffset));

			// TEST LOG
			//console.log(offset.top);
			//console.log(offsetVar.scrollY);
			//console.log(offsetVar.top);

			$(widgetDragElId).offset({
				top:offset.top + offsetVar.scrollY + offsetVar.top,
				left:offset.left + offsetVar.scrollX + offsetVar.left
			});
		}
	};

	return WidgetMoveBehaviour;
		
});