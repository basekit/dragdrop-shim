define(["jquery", "drag", "drop", "classie"], function($, Draggable, Droppable, classie) {
	
	var body = document.body,
		droppableArr = [],
		dropAreaTimeout;

    $(function() {

		droppableArr.push( new Droppable( document.querySelector('.droppable'), {
				onDrop: function () {
					console.log(arguments);
				}
			})
		);

		$('.draggable').each(function () {
			new Draggable( this, droppableArr, {
				draggabilly : { 
					containment: document.body 
				},
				onStart : function() {
					// add class 'drag-active' to body
					classie.add( body, 'drag-active' );
				},
				onEnd : function( wasDropped ) {
					if( !wasDropped ) {
						classie.remove( body, 'drag-active' );
					}
					else {
						// after some time hide drop area and remove class 'drag-active' from body
						clearTimeout( dropAreaTimeout );
						dropAreaTimeout = setTimeout( function() {
							// remove class 'drag-active' from body
							classie.remove( body, 'drag-active' );
						}, 400 );
					}
				}
			});
		});
		
    });
});
