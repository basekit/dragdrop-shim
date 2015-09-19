define([
	"jquery",
	"drag",
	"app/Behaviour/DragBehaviour",
], function($, Draggable, Drag) {
	
	var SidebarControl = {

		load: function (iframe, droppableArr, $dragHighlight) {

	    	// Set all the draggables, in this demo, this is just 
	    	// the NEW WIDGETS from the Pop-ups and sidebars
			$('.sidebar-drag').each(function () {
				Drag.load(this, droppableArr, iframe, document.body, $dragHighlight, 'toplevel');
			});

		}
	};

	return SidebarControl;
});