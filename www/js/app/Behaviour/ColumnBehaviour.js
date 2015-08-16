define([
	"jquery",
	"app/Behaviour/DropBehaviour"
], function($, Drop ) {
	var ColumnBehaviour = {
		load: function (el, iframe) {

			var $dropEl = this.createDropEl();

			$(el).append($dropEl);

			this.resizeDropEl(el, $dropEl);

			return Drop.load( $dropEl[0], iframe);
		},

		createDropEl: function () {
			var $dropEl = $('<div></div>')
				.addClass('column-drop')
				.css('position', 'absolute')
				.css('bottom', '0');
			
			return $dropEl;
		},

		resizeDropEl: function (el, $dropEl) {
			var $el = $(el);

			$dropEl.css('left', $el.position().left + 'px');
			$dropEl.css('width', $el.outerWidth() + 'px');

			if ($el.find('.droppable').length === 0) {
				// Set the height to the columns parent
				$dropEl.css('height', $el.parent().height() + 'px');
			} else {
				// Offset of the last child element + it's height - the offset of the column
				$dropEl.css('height', ($el.parent().innerHeight() - ($el.find('.droppable').last().position().top + $el.find('.droppable').last().outerHeight(true)))  + 'px');
			}
		}
	};

	return ColumnBehaviour;
		
});