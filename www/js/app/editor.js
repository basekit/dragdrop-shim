define(["jquery", "drag", "drop", "classie"], function($, Draggable, Droppable, classie) {

	var Editor = {
		load: function (iframe) {

			var droppableArr = [],
				dropAreaTimeout,
				iframeWindow = iframe.contentWindow? iframe.contentWindow : iframe.contentDocument.defaultView,
				iframeBody = $(iframeWindow.document.body)[0],
				$dragHighlight = iframeWindow.$('#drop-highlight');

			function setHightPositon (x, y, width, height) {
				$dragHighlight.css({
					'top':y,
					'left':x,
					'width':width,
					'height':height,
				});
			}

			function getElementBoundaries (element) {
				return element.getBoundingClientRect();
			}

	    	iframeWindow.$('.droppable').each(function () {
				droppableArr.push( new Droppable( this, {
						onDrop: function () {
							console.log(arguments);
						},
						frameEl: iframe
					})
				);
			});
			
			$('.draggable').each(function () {
				new Draggable( this, droppableArr, {
					draggabilly : { 
						containment: document.body 
					},
					onStart : function() {
						$("iframe").css('z-index', '-1');
						
						classie.add( iframeBody, 'drag-active' );
					},
					onDrag: function (droppableCoords) {
						var columnBoundaries = null;
						if (droppableCoords !== null) {
							switch (droppableCoords.leaning) {
								case 'top':
									setHightPositon(droppableCoords.x,droppableCoords.y,droppableCoords.width + 'px','30px');
									break;
								case 'bottom':
									setHightPositon(droppableCoords.x,droppableCoords.y + droppableCoords.height - 30,droppableCoords.width + 'px', '30px');
									break;
								case 'left':
									if (classie.has(droppableCoords.el.parentNode, 'column')) {
										columnBoundaries = getElementBoundaries(droppableCoords.el.parentNode);
										setHightPositon(columnBoundaries.left,columnBoundaries.top,'30px',columnBoundaries.height + 'px');
									} else {
										setHightPositon(droppableCoords.x,droppableCoords.y,'30px',droppableCoords.height + 'px');
									}
									
									break;
								case 'right':
									if (classie.has(droppableCoords.el.parentNode, 'column')) {
										columnBoundaries = getElementBoundaries(droppableCoords.el.parentNode);
										setHightPositon(columnBoundaries.left + columnBoundaries.width - 30, columnBoundaries.top,'30px', columnBoundaries.height + 'px');
									} else {
										setHightPositon((droppableCoords.x + droppableCoords.width - 30),droppableCoords.y,'30px',droppableCoords.height + 'px');
									}
									
									break;
							}
						} else {
							setHightPositon(0,0,0,0);
						}
					},
					onEnd : function( wasDropped ) {
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
						$("iframe").css('z-index', '0');
					}
				});
			});
		}
	};

	return Editor;
});
