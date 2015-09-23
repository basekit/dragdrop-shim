(function ($, Site, SidebarControl, ProxyControl) {
    'use strict';

	window.Editor = {

		load: function (iframe) {

			var droppableArr = [],
				iframeWindow = iframe.contentWindow ? iframe.contentWindow : iframe.contentDocument.defaultView,
                $dragHighlight = iframeWindow.$('#drop-highlight'),
                widgetDragElId = '#move-drag',
                columnDragElId = '#column-drag';

			// You have to frame, to play!
			if (typeof iframe !== 'object' ||
				iframe.nodeName !== "IFRAME"
			) {
				throw "Site IFRAME element required."
			}


			droppableArr = Site.load(iframe, widgetDragElId, columnDragElId);

			SidebarControl.load(iframe, droppableArr, $dragHighlight);
			ProxyControl.load(iframe, droppableArr, $dragHighlight);

			$('#column-drag').on('mouseover', function (e) {
				e.preventDefault();
			});

			// Add button!
			$('#add-button').on('click', function () {
				$('body').toggleClass('show-sidebar');
			});

		}
	};
}($, window.Site, window.SidebarControl, window.ProxyControl));
