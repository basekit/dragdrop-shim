define(["jquery", "drag"], function($, Draggable) {
	console.log(arguments);
	var droppableArr = [];
    //the jquery.alpha.js and jquery.beta.js plugins have been loaded.
    $(function() {
        new Draggable( document.querySelector('#draggable'), droppableArr, {
			draggabilly : { containment: document.body },
		});
    });
});
