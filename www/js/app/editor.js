define([
	"jquery", 
	"drag", 
	"drop", 
	"classie",
	"app/Behaviour/DragBehaviour",
	"app/Behaviour/DropBehaviour"
], function($, Draggable, Droppable, classie, Drag, Drop) {

	var Editor = {
		load: function (iframe) {

			if (typeof iframe !== 'object' || 
				iframe.nodeName !== "IFRAME"
			) {
				throw "Site IFRAME element required."
			}

			droppableArr = [];
			
			iframeWindow = iframe.contentWindow ? iframe.contentWindow : iframe.contentDocument.defaultView,
			$dragHighlight = iframeWindow.$('#drop-highlight');

			// Set up all the droppables (widgets) in this demo.
			// This will receive dragglables and console.log its data.
	    	iframeWindow.$('.droppable').each(function () {
				droppableArr.push( Drop.load(this, iframe) );
			});

	    	// Set all the draggables, in this demo, this is just 
	    	// the NEW WIDGETS from the Pop-ups and sidebars
			$('.draggable').each(function () {
				Drag.load(this, droppableArr, iframe, document.body, $dragHighlight);
			});
		}
	};

	return Editor;
});
