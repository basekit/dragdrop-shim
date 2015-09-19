define([
	"jquery",
	"app/Site",
	"app/Control/SidebarControl",
	"app/Control/ProxyControl"

], function($, Site, SidebarControl, ProxyControl) {

	var Editor = {

		load: function (iframe) {

			var droppableArr = [],
				iframeWindow = iframe.contentWindow ? iframe.contentWindow : iframe.contentDocument.defaultView;

			// You have to frame, to play!
			if (typeof iframe !== 'object' || 
				iframe.nodeName !== "IFRAME"
			) {
				throw "Site IFRAME element required."
			}
			
			$dragHighlight = iframeWindow.$('#drop-highlight');
			widgetDragElId = '#move-drag',
			
			droppableArr = Site.load(iframe, widgetDragElId);

			SidebarControl.load(iframe, droppableArr, $dragHighlight);
			ProxyControl.load(iframe, droppableArr, $dragHighlight);

			// Add button!
			$('#add-button').on('click', function () {
				$('body').toggleClass('show-sidebar');
			});
			
		}
	};

	return Editor;
});
