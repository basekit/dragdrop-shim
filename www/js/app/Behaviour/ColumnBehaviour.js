define([
	"jquery",
	"app/Behaviour/DropBehaviour"
], function($, Drop ) {
	function isiOSSafari() {
        return (navigator.userAgent.match(/Version\/[\d\.]+.*Safari/) && /iPad|iPhone|iPod/.test(navigator.platform)) ? true : false;
	}
	var ColumnBehaviour = {
		load: function (el, iframe) {

			var $dropEl = this.createDropEl(),
				timeout = null,
				self = this;

			$el = $(el);			

			$el.append($dropEl);

			this.resizeDropEl(el, $dropEl);
			// Column Drag handle... coming soon!
			//this.setUpResizeHandle(el, iframe);

			// Set up window resizing
			$(window).on('resize', function () {
				clearTimeout(timeout);
				timeout = setTimeout(function () {
					self.resizeDropEl(el, $dropEl);
					timeout = null;
				}, 10);
			});

			return Drop.load( $dropEl[0], iframe);
		},

		setUpResizeHandle: function (el, iframe) {
			var self = this,
				$el = $(el),
				side = (parseInt($el.data('order'),10) === 1) ? 'right' : 'left';

			$el.on('mouseover', function () {
				self.showResizeIndicator(el, iframe, side);
			});

			$el.on('mouseout', function () {
				self.hideResizeIndicator(el);
			});
		},

		showResizeIndicator: function (el, iframe, side) {
			var $el = $(el),
				$columnDrag = $('#column-drag'),
				iframeBoundaries = iframe.getBoundingClientRect(),
				frameWindow = iframe.contentWindow ? iframe.contentWindow : iframe.contentDocument.defaultView,
				scrollWin = isiOSSafari() ? window : frameWindow,
				elementOffset = {},
				frameOffset = {},
				positionX = 0,
				positionY = 0,
				width = (side === 'right' ? parseInt($el.width(),10) : 0);

			// These positionX / positionY calculations are 
			// explained in WidgetMoveBehaviour load function. 
			frameOffset.top = iframeBoundaries.top;
			frameOffset.left = iframeBoundaries.left;
			frameOffset.scrollX = (isiOSSafari() ? scrollWin.pageXOffset : -(scrollWin.pageXOffset));
			frameOffset.scrollY = (isiOSSafari() ? scrollWin.pageYOffset : -(scrollWin.pageYOffset));
			elementOffset = $el.offset();

			positionX = elementOffset.left + frameOffset.left + frameOffset.scrollX + width;
			positionY = elementOffset.top + frameOffset.top + frameOffset.scrollY;

			// This element lives in the Editor HTML
			$columnDrag.css({
				'display':'block',
				'width':'20px',
				'height': $el.parent().height() + 'px',
				'top': positionY + 'px',
				'left': positionX + 'px'
			});
		},

		hideResizeIndicator: function () {
			var $columnDrag = $('#column-drag');

			// This element lives in the Editor HTML
			$columnDrag.css({
				'display':'none',
				'width':'0px',
				'height': '0px',
				'top': '0px',
				'left': '0px'
			});
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