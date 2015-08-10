define(["jquery", "drag", "drop"], function($, Draggable, Droppable) {
	var droppableArr = [];
    $(function() {

		droppableArr.push( new Droppable( document.querySelector('.droppable'), {
				onDrop: function () {
					console.log(arguments);
				}
			})
		);

		new Draggable( document.querySelector('.draggable'), droppableArr, {
			draggabilly : { containment: document.body }
		});
    });
});
