define([
	"jquery",
	"classie",
	"drag"
], function($, classie, Draggable) {
	var DragBehaviour = {
		// containment = document.body
		load: function (element, droppableArr, iframe, containment, $highlighter ) {
			var self = this,
				dropAreaTimeout = null,
				iframeWindow = iframe.contentWindow ? iframe.contentWindow : iframe.contentDocument.defaultView,
				iframeBody = $(iframeWindow.document.body)[0],
				drag = new Draggable( element, droppableArr, {
				helper:true,
				scroll:true,
				scrollable:iframe,
				scrollSensitivity:75,
				draggabilly : {
					// Contain the to the body of the editor
					containment: containment
				},
				onStart : function() {

					// The iframe always interferes with the drag event;
					// giving it a really bad drag experience where the 
					// proxy gets stuck on the iframe. This reduces the 
					// z-index of the iframe (and the elements behind it
					// so the iframe doesn't disappear!) so that the iframe
					// stops picking up the move events on drag
					$(iframe).css('z-index', '-1');

					// Set the 
					classie.add( iframeBody, 'drag-active' );
				},
				onDrag: function (droppableCoords) {

					var columnBoundaries = null;
					if (droppableCoords !== null) {
						switch (droppableCoords.leaning) {
							case 'top':

								// 1. left is equal to widget coord + horizontial scroll height of the iframe
								// 2. top is equal to widget coord + vertical scroll height of the iframe
								// 3. width is equal to width of the widget
								// 4. height is 30px
								self.setDropIndicatorPosition($dragHighlight, droppableCoords.x + droppableCoords.scrollX, droppableCoords.y + droppableCoords.scrollY, droppableCoords.width + 'px', '30px');
								break;

							case 'bottom':
								// 1. left is equal to widget coord + horizontial scroll height of the iframe
								// 2. top is equal to widget coord + widget height + vertical scroll height of the iframe - 30px (height of the indicator)
								// 3. width is equal to width of the widget
								// 4. height is 30px
								self.setDropIndicatorPosition($dragHighlight, droppableCoords.x + droppableCoords.scrollX, droppableCoords.y + droppableCoords.scrollY + droppableCoords.height - 30,droppableCoords.width + 'px', '30px');
								break;

							case 'left':
								// If a widget is in a column... we create a new column to the left in the columns above
								if (classie.has(droppableCoords.el.parentNode, 'column')) {
									
									// Get columns boundaries; (NOTE: this should be the important columns height, not the column (widget > column > columns))
									columnBoundaries = self.getElementBoundaries(droppableCoords.el.parentNode);
									columnsBoundaries = self.getElementBoundaries(droppableCoords.el.parentNode.parentNode);

									// 1. left is equal to widget coord + horizontial scroll height of the iframe
									// 2. top is equal to widget coord + vertical scroll height of the iframe
									// 3. width is 30px (should probably be in CSS)
									// 4. height is the height of the columns widget in total (NOTE: this is the columns height, not the column)
									self.setDropIndicatorPosition($dragHighlight, columnBoundaries.left + droppableCoords.scrollX, columnBoundaries.top + droppableCoords.scrollY,'30px',columnsBoundaries.height + 'px');
								} else {
								// If the widget is NOT in a columns widget, we indicate the 
								// dragging widget will be next to the existing widget

									// 1. left is equal to widget coord + horizontial scroll height of the iframe
									// 2. top is equal to widget coord + vertical scroll height of the iframe
									// 3. width is 30px (should probably be in CSS)
									// 4. height is the widget height
									self.setDropIndicatorPosition($dragHighlight, droppableCoords.x + droppableCoords.scrollX, droppableCoords.y + droppableCoords.scrollY,'30px',droppableCoords.height + 'px');
								}
								break;

							case 'right':

								// If a widget is in a column... we create a new column to the right in the columns above
								if (classie.has(droppableCoords.el.parentNode, 'column')) {

									// Get columns boundaries; (NOTE: this should be the important columns height, not the column (widget > column > columns))
									columnBoundaries = self.getElementBoundaries(droppableCoords.el.parentNode);
									columnsBoundaries = self.getElementBoundaries(droppableCoords.el.parentNode.parentNode);

									// 1. left is equal to widget coord + column width + horizontial scroll height of the iframe - 30px (indicator width)
									// 2. top is equal to widget coord + vertical scroll height of the iframe
									// 3. width is 30px (should probably be in CSS)
									// 4. height is the height of the columns widget in total (NOTE: this is the columns height, not the column)
									self.setDropIndicatorPosition($dragHighlight, columnBoundaries.left + droppableCoords.scrollX + columnBoundaries.width - 30, columnBoundaries.top + droppableCoords.scrollY,'30px', columnsBoundaries.height + 'px');
								} else {
								// If the widget is NOT in a columns widget, we indicate the 
								// dragging widget will be next to the existing widget

									// 1. left is equal to widget coord + widget width + horizontial scroll height of the iframe - 30px (indicator width)
									// 2. top is equal to widget coord + vertical scroll height of the iframe
									// 3. width is 30px (should probably be in CSS)
									// 4. height is the widget height
									self.setDropIndicatorPosition($dragHighlight, (droppableCoords.x + droppableCoords.scrollX + droppableCoords.width - 30), droppableCoords.y + droppableCoords.scrollY,'30px',droppableCoords.height + 'px');
								}
								break;
						}
					} else {

						// Hide the indicator!
						self.setDropIndicatorPosition($dragHighlight, 0,0,0,0);
					}
				},
				onEnd : function( wasDropped ) {

					// So fun class stuff to get nice animations and stuff!
					if( !wasDropped ) {
						classie.remove( iframeBody, 'drag-active' );
					}
					else {
						// after some time hide drop area and remove class 'drag-active' from body
						clearTimeout( dropAreaTimeout );
						dropAreaTimeout = setTimeout( function() {
							// remove class 'drag-active' from body
							classie.remove( iframeBody, 'drag-active' );
						}, 400 );
					}

					// The iframe always interferes with the drag event;
					// giving it a really bad drag experience where the 
					// proxy gets stuck on the iframe. This brings the 
					// iframe back to life after the drag.
					$("#editor-frame").css('z-index', '0');

					// Hide the indicator!
					self.setDropIndicatorPosition($dragHighlight, 0,0,0,0);
				}
			});


		},

		// Sets the XY position of the indicator
		// Also it's width and height related to the drop context.
		setDropIndicatorPosition: function ($highlighter, x, y, width, height) {

			if(width === 0 && height === 0) {
				$highlighter.hide();					
				$highlighter.css({
					'top':y,
					'left':x,
					'width':width,
					'height':height,
				});
			} else {
				$highlighter.css({
					'top':y,
					'left':x,
					'width':width,
					'height':height,
				});

				$highlighter.show();
			}
		},

		// Helper function: returns element client rectangle
		getElementBoundaries: function (element) {
			return element.getBoundingClientRect();
		}
	};

	return DragBehaviour;
		
});