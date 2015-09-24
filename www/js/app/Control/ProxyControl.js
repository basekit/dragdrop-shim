(function($, Draggable, Drag) {
    'use strict';

	window.ProxyControl = {

		load: function (iframe, droppableArr, $dragHighlight) {

	    	$('.site-drag').each(function () {
				Drag.load({ el: this }, droppableArr, iframe, document.body, $dragHighlight, 'frame');
			});

		}
	};
}($, window.Draggable, window.DragBehaviour));
