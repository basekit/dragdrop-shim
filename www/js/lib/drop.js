/**
 * dragdrop.js
 * http://www.codrops.com
 *
 * Licensed under the MIT license.
 * http://www.opensource.org/licenses/mit-license.php
 *
 * Copyright 2014, Codrops
 * http://www.codrops.com
 *
 * Modified by http://www.basekit.com
 * - Made code AMD ready!
 *
 * Original Code found here:
 * http://tympanus.net/codrops/2014/11/11/drag-and-drop-interaction-ideas/
 */
;( function(window) {

	'use strict';

function dropDefinition(classie) {

	/*************************************************************/
	/******************* Some helper functions *******************/
	/*************************************************************/

	var body = document.body, docElem = window.document.documentElement,
		transEndEventNames = { 'WebkitTransition': 'webkitTransitionEnd', 'MozTransition': 'transitionend', 'OTransition': 'oTransitionEnd', 'msTransition': 'MSTransitionEnd', 'transition': 'transitionend' },
		transEndEventName = transEndEventNames[ Modernizr.prefixed( 'transition' ) ],
		support = { transitions : Modernizr.csstransitions };

	// https://remysharp.com/2010/07/21/throttling-function-calls
	function throttle(fn, threshhold, scope) {
		threshhold || (threshhold = 250);
		var last,
			deferTimer;

		return function () {
			var context = scope || this;
			var now = +new Date,
			args = arguments;
			if (last && now < last + threshhold) {
				// hold on to it
				clearTimeout(deferTimer);
				deferTimer = setTimeout(function () {
					last = now;
					fn.apply(context, args);
				}, threshhold);
			} else {
				last = now;
				fn.apply(context, args);
			}
		};
	}
	function isiOSSafari() {
        return (navigator.userAgent.match(/Version\/[\d\.]+.*Safari/) && /iPad|iPhone|iPod/.test(navigator.platform)) ? true : false;
	}
	// from http://responsejs.com/labs/dimensions/
	function getViewportW() {
		var client = docElem['clientWidth'], inner = window['innerWidth'];
		return client < inner ? inner : client;
	}
	function getViewportH() {
		var client = docElem['clientHeight'], inner = window['innerHeight'];
		return client < inner ? inner : client;
	}
	function scrollX() { return window.pageXOffset || docElem.scrollLeft; }
	function scrollY() { return window.pageYOffset || docElem.scrollTop; }


	// gets the offset of an element relative to the document
	function getOffset( el, frameEl ) {
		var offset = el.getBoundingClientRect(),
			offsetVar = {top:offset.top, left:offset.left},
			iframeBoundaries = null;

		// RH: need check to see if this element is contained in
		// this window's context. If not add the the iframe windown
		// x,y offset to the calculations.
		if(frameEl !== null &&  typeof frameEl === 'object') {

			iframeBoundaries = frameEl.getBoundingClientRect();

			offsetVar.top = offsetVar.top + iframeBoundaries.top;
			offsetVar.left = offsetVar.left + iframeBoundaries.left;

			offsetVar.scrollX = frameEl.contentWindow.pageXOffset;
			offsetVar.scrollY = frameEl.contentWindow.pageYOffset;

			return { top : offsetVar.top, left : offsetVar.left, realTop : offset.top, realLeft : offset.left, scrollX:offsetVar.scrollX, scrollY:offsetVar.scrollY }

		} else {

			// RH: Because Safari on the iPhone has decided that it want's to
			// do things differently, it extends all frames out to their full
			// height. This means, the top level window scrolls and not the body
			// of the iframe, like in all other browsers.
			// As the top of the element is still the top in a full screen editor
			// we do everything the same BAR add the scrollX and scrollY.
			// Thanks Apple.
			if(isiOSSafari() && el.ownerDocument !== window) {
				return { top : offsetVar.top, left : offsetVar.left, realTop : offset.top, realLeft : offset.left, scrollX:scrollX(), scrollY:scrollY()   }
			}else {
				return { top : offsetVar.top + scrollY(), left : offsetVar.left + scrollX(), realTop : offset.top, realLeft : offset.left, scrollX:scrollX(), scrollY:scrollY()   }
			}


		}
	}
	function setTransformStyle( el, tval ) { el.style.transform = tval; }
	function onEndTransition( el, callback ) {
		var onEndCallbackFn = function( ev ) {
			if( support.transitions ) {
				this.removeEventListener( transEndEventName, onEndCallbackFn );
			}
			if( callback && typeof callback === 'function' ) { callback.call(); }
		};

		if( support.transitions ) {
			el.addEventListener( transEndEventName, onEndCallbackFn );
		}
		else {
			onEndCallbackFn();
		}
	}
	function extend( a, b ) {
		for( var key in b ) {
			if( b.hasOwnProperty( key ) ) {
				a[key] = b[key];
			}
		}
		return a;
	}

	/*************************************************************/
	/************************ Drag & Drop ************************/
	/*************************************************************/

	var is3d = false;

	/***************/
	/** Droppable **/
	/***************/

	function Droppable( droppableEl, options ) {
		this.el = droppableEl;
		this.leaning = null;
		this.options = extend( {}, this.options );
		extend( this.options, options );
	}

	Droppable.prototype.options = {
		onDrop : function(instance, draggableEl) { return false; }
	}

	// based on http://stackoverflow.com/a/2752387 : checks if the droppable element is ready to collect the draggable: the draggable element must intersect the droppable in half of its width or height.
	Droppable.prototype.isDroppable = function( draggableEl ) {
		var offset1 = getOffset( draggableEl, null ), width1 = draggableEl.offsetWidth, height1 = draggableEl.offsetHeight,
			offset2 = getOffset( this.el, this.options.frameEl ), width2 = this.el.offsetWidth, height2 = this.el.offsetHeight;

		return !(offset2.left > offset1.left + width1 - width1/2 ||
				offset2.left + width2 < offset1.left + width1/2 ||
				offset2.top > offset1.top + height1 - height1/2 ||
				offset2.top + height2 < offset1.top + height1/2 );
	}

	// RH: based on function above, with extra leaning
	Droppable.prototype.isDroppableAdvanced = function( draggableEl, endFlag ) {
		var offset1 = getOffset( draggableEl, null ), width1 = draggableEl.offsetWidth, height1 = draggableEl.offsetHeight,
			offset2 = getOffset( this.el, this.options.frameEl ), width2 = this.el.offsetWidth, height2 = this.el.offsetHeight,
			side = false;

		// if inside...
		if(!(offset2.left > offset1.left + width1 - width1/2 ||
				offset2.left + width2 < offset1.left + width1/2 ||
				offset2.top > offset1.top + height1 - height1/2 ||
				offset2.top + height2 < offset1.top + height1/2 )) {
			// ...then check leaning..
			// calculation description. At this point we know we are inside the drop boundaries
			// left: if drag left edge is gr than drop left edge + 30px
			if (offset1.left + width1 > offset2.left + width2 - 30) {
				side = 'right';
			// top: if drag top edge in the top half of the drop
			} else if (offset1.left < offset2.left + 30) {
				side = 'left';
			// right: if drag right edge is greater than drop right edge - 30px
			} else if(offset1.top + height1/2 > offset2.top + height2/2){
				side = 'bottom'
			} else if(offset1.top + height1/2 < offset2.top + height2/2){
				side = 'top'
			// bottom: if drag top edge in the bottom half of the drop
			}

			return {
				leaning: side,
				x: offset2.realLeft,
				y: offset2.realTop,
				width: width2,
				height: height2,
				tl:[offset2.realLeft, offset2.realTop],
				tr:[offset2.realLeft + width2, offset2.realTop],
				bl:[offset2.realLeft, offset2.realTop + height2],
				br:[offset2.realLeft + width2, offset2.realTop + height2],
				el:this.el,
				scrollX:offset2.scrollX,
				scrollY:offset2.scrollY
			}
		} else {
			if (endFlag === true) {
				return false;
			} else {
				return {
					leaning: side,
					x: offset2.realLeft,
					y: offset2.realTop,
					width: width2,
					height: height2,
					tl:[offset2.realLeft, offset2.realTop],
					tr:[offset2.realLeft + width2, offset2.realTop],
					bl:[offset2.realLeft, offset2.realTop + height2],
					br:[offset2.realLeft + width2, offset2.realTop + height2],
					el:this.el,
					scrollX:offset2.scrollX,
					scrollY:offset2.scrollY
				}
			}

		}
	}

	// highlight the droppable if it's ready to collect the draggable
	// RH - add leaning class; top, right, left, bottom
	Droppable.prototype.highlight = function( draggableEl ) {
		var droppableCords = this.isDroppableAdvanced( draggableEl );

		if( droppableCords.leaning !== false ) {
			classie.add( this.el, 'highlight' );
			// Check if leaning is different to previous check...
			if (this.leaning !== droppableCords.leaning) {
				// if not, swap class out
				classie.remove( this.el, 'drop-' + this.leaning );
				classie.add( this.el, 'drop-' + droppableCords.leaning );
				// save previous leaning
				this.leaning = droppableCords.leaning;
			}
		} else {
			classie.remove( this.el, 'highlight' );
			classie.remove( this.el, 'drop-' + this.leaning );
			// remove leaning
			this.leaning = null;
		}

		return droppableCords;
	}

	// accepts a draggable element...
	Droppable.prototype.collect = function( draggableEl, draggableObject ) {
		// remove highlight class from droppable element
		classie.remove( this.el, 'highlight' );
		this.options.onDrop( this.options.droppableObject, draggableObject, this.leaning);
		this.leaning = null;
	}

	return Droppable;

}; // end definition

// -------------------------- transport -------------------------- //

if ( typeof define === 'function' && define.amd ) {
  // AMD
  define( [
	'classie'
    ],
    dropDefinition );
} else if ( typeof exports === 'object' ) {
  // CommonJS
  module.exports = dropDefinition(
  	require('desandro-classie')
  );
} else {
  // browser global
  window.Droppable = dropDefinition(
    window.classie
  );
}

})(window);
