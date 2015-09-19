define([
	"jquery",
	"drag",
	"app/Behaviour/DragBehaviour",
], function($, Draggable, Drag) {
	
	var ProxyControl = {

		load: function (iframe, droppableArr, $dragHighlight) {

	    	$('.site-drag').each(function () {
				Drag.load(this, droppableArr, iframe, document.body, $dragHighlight, 'frame');
			});

		}
	};

	return ProxyControl;
});