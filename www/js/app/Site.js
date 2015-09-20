define([
	"jquery", 
	"drop", 
	"app/Behaviour/DropBehaviour",
	"app/Behaviour/ColumnBehaviour",
	"app/Behaviour/WidgetSelectBehaviour"
], function($, Droppable, Drop, Column, WidgetSelectBehaviour) {
	
	var Site = {

		load: function (iframe, widgetDragElId, columnDragElId) {

			// Remember all the droppables!
			var droppableArr = []; 

			iframeWindow = iframe.contentWindow ? iframe.contentWindow : iframe.contentDocument.defaultView,

			// Setup Drag Behaviour for all widgets...
			iframeWindow.$('.widget').each(function () {
				WidgetSelectBehaviour.load(this, iframe, widgetDragElId);
			});

			// Set up all the droppables (widgets)
			// This will receive dragglables.
	    	iframeWindow.$('.droppable').each(function () {
				droppableArr.push( Drop.load(this, iframe) );
			});

			// Set up the columns blank space drops
			iframeWindow.$('.column').each(function () {
				droppableArr.push( Column.load(this, iframe) );
			});

			this.setUpScrollEvents(iframeWindow, widgetDragElId, columnDragElId);

            return droppableArr;
		},

		doScroll: function (iframeWindow, widgetDragElId, columnDragElId) {

			if(iframeWindow.$('body').hasClass('drag-active')) {
                    return;
                }

            $(widgetDragElId).css('display', 'none');
            $(columnDragElId).css('display', 'none');
		},

		setUpScrollEvents: function (iframeWindow, widgetDragElId, columnDragElId) {

			var self = this;

			// For iPhone iframe stetching...
			$(iframeWindow).scroll(function () {
				self.doScroll(iframeWindow, widgetDragElId, columnDragElId);
            });

			// For everything else!
            iframeWindow.$('body').scroll(function () {
				self.doScroll(iframeWindow, widgetDragElId, columnDragElId);
            });
		}
	};

	return Site;
});