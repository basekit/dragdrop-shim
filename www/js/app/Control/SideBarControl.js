(function($, Draggable, Drag) {
    'use strict';

	window.SidebarControl = {

		load: function (iframe, droppableArr, $dragHighlight) {

	    	// Set all the draggables, in this demo, this is just
	    	// the NEW WIDGETS from the Pop-ups and sidebars
			$('.sidebar-drag').each(function () {
				Drag.load({ el: this }, droppableArr, iframe, document.body, $dragHighlight, 'toplevel');
			});

		}
	};
}($, window.Draggable, window.DragBehaviour));
