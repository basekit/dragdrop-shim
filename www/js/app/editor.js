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

			iframeWindow.$('.widget').each(function () {
				$(this).on('click', function () {

					$('#move-drag').css('display', 'block');

					var offset = $(this).offset(),
						offsetVar = {};

					iframeBoundaries = iframe.getBoundingClientRect();
					offsetVar.top = iframeBoundaries.top;
					offsetVar.left = iframeBoundaries.left;
					offsetVar.scrollX = iframe.contentWindow.pageXOffset;
					offsetVar.scrollY = iframe.contentWindow.pageYOffset;
					
					
					$('#move-drag').offset({
						top:offset.top - offsetVar.scrollY + offsetVar.top,
						left:offset.left - offsetVar.scrollX + offsetVar.left
					});
				});
			});

			iframeWindow.$('.column').each(function () {
				droppableArr.push( Column.load(this, iframe) );
			});

			$(iframeWindow).scroll(function () {

				if(iframeWindow.$('body').hasClass('drag-active')) {
					return;
				}

				$('#move-drag').css('display', 'none');
			});
		}
	};

	return Editor;
});
