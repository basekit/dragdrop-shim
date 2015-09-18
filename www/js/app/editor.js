define([
	"jquery", 
	"drag", 
	"drop", 
	"classie",
	"app/Behaviour/DragBehaviour",
	"app/Behaviour/DropBehaviour",
	"app/Behaviour/ColumnBehaviour"
], function($, Draggable, Droppable, classie, Drag, Drop, Column) {

	function isiOSSafari() {
        return (navigator.userAgent.match(/Version\/[\d\.]+.*Safari/) && /iPad|iPhone|iPod/.test(navigator.platform)) ? true : false;
	}

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
						offsetVar = {},
						scrollWin = isiOSSafari() ? window : iframe.contentWindow;

					// RH:This is a pain in iOS as the iframe this value
					// yeilds a different result as scrolling frame is the main window
					// In all other browsers, its the iframewindow. 
					iframeBoundaries = iframe.getBoundingClientRect();
					offsetVar.top = iframeBoundaries.top;
					offsetVar.left = iframeBoundaries.left;

					// Offset the handle to include the scroll offset
					// REMEMBER! pageXOffset sometimes comes back as
					// a negative number. We Math.abs() it to positive
					offsetVar.scrollX = (isiOSSafari() ? scrollWin.pageXOffset : -(scrollWin.pageXOffset));
					offsetVar.scrollY = (isiOSSafari() ? scrollWin.pageYOffset : -(scrollWin.pageYOffset));

					$('#move-drag').offset({
						top:offset.top + offsetVar.scrollY + offsetVar.top,
						left:offset.left + offsetVar.scrollX + offsetVar.left
					});
				});
			});

			// Set up the columns
			iframeWindow.$('.column').each(function () {
				droppableArr.push( Column.load(this, iframe) );
			});

			$(iframeWindow).scroll(function () {

                if(iframeWindow.$('body').hasClass('drag-active')) {
                    return;
                }

                $('#move-drag').css('display', 'none');
            });

            iframeWindow.$('body').scroll(function () {

                if(iframeWindow.$('body').hasClass('drag-active')) {
                    return;
                }

                $('#move-drag').css('display', 'none');
            });
		}
	};

	return Editor;
});
