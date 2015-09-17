define([
	"jquery", 
	"drag", 
	"drop", 
	"classie",
	"app/Behaviour/DragBehaviour",
	"app/Behaviour/DropBehaviour",
	"app/Behaviour/ColumnBehaviour"
], function($, Draggable, Droppable, classie, Drag, Drop, Column) {

	var Editor = {
		load: function (iframe) {

			// You have to frame, to play!
			if (typeof iframe !== 'object' || 
				iframe.nodeName !== "IFRAME"
			) {
				throw "Site IFRAME element required."
			}

			// Remember all the droppables!
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

			// For all widgets...
			iframeWindow.$('.widget').each(function () {
				// When you click them...
				iframeWindow.$(this).on('mousedown', function () {

					// Show a drag handle in the main document
					$('#move-drag').css('display', 'block');

					// And position it over the widget (HARD!)
					var offset = $(this).offset(),
						offsetVar = {};

					// RH:This is a pain in iOS as the iframe this value
					// yeilds a different result as scrolling frame is the main window
					// In all other browsers, its the iframewindow. 
					//iframeBoundaries = iframe.getBoundingClientRect();
					//offsetVar.top = iframeBoundaries.top;
					//offsetVar.left = iframeBoundaries.left;

					// Offset the handle to include the scroll offset
					// REMEMBER! pageXOffset comes back as a negative 
					// number, so  -- = + :$
					offsetVar.scrollX = iframe.contentWindow.pageXOffset > 0 ? iframe.contentWindow.pageXOffset : 0;
					offsetVar.scrollY = iframe.contentWindow.pageYOffset > 0 ? iframe.contentWindow.pageYOffset : 0;
					
					$('#move-drag').offset({
						top:offset.top - offsetVar.scrollY/* + offsetVar.top*/,
						left:offset.left - offsetVar.scrollX/* + offsetVar.left*/
					});
				});
			});

			// Set up the columns
			iframeWindow.$('.column').each(function () {
				droppableArr.push( Column.load(this, iframe) );
			});
		}
	};

	return Editor;
});
