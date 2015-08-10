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
	function getOffset( el ) {
		var offset = el.getBoundingClientRect();
		return { top : offset.top + scrollY(), left : offset.left + scrollX() }
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
		var offset1 = getOffset( draggableEl ), width1 = draggableEl.offsetWidth, height1 = draggableEl.offsetHeight,
			offset2 = getOffset( this.el ), width2 = this.el.offsetWidth, height2 = this.el.offsetHeight;

		return !(offset2.left > offset1.left + width1 - width1/2 || 
				offset2.left + width2 < offset1.left + width1/2 || 
				offset2.top > offset1.top + height1 - height1/2 ||
				offset2.top + height2 < offset1.top + height1/2 );
	}

	// RH: based on function above, with extra leaning
	Droppable.prototype.isDroppableAdvanced = function( draggableEl ) {
		var offset1 = getOffset( draggableEl ), width1 = draggableEl.offsetWidth, height1 = draggableEl.offsetHeight,
			offset2 = getOffset( this.el ), width2 = this.el.offsetWidth, height2 = this.el.offsetHeight;

		// if inside...
		if(!(offset2.left > offset1.left + width1 - width1/2 || 
				offset2.left + width2 < offset1.left + width1/2 || 
				offset2.top > offset1.top + height1 - height1/2 ||
				offset2.top + height2 < offset1.top + height1/2 )) {
			// ...then check leaning..
			// calculation description. At this point we know we are inside the drop boundaries
			// left: if drag left edge is gr than drop left edge + 30px 
			if (offset1.left + width1 > offset2.left + width2 - 30) {
				return 'right';
			// top: if drag top edge in the top half of the drop
			} else if (offset1.left < offset2.left + 30) {
				return 'left';
			// right: if drag right edge is greater than drop right edge - 30px 
			} else if(offset1.top > offset2.top + height2/2){
				return 'bottom'
			} else if(offset1.top < offset2.top + height2/2){
				return 'top'
			// bottom: if drag top edge in the bottom half of the drop
			} 
		} else {
			return false;
		}
	}

	// highlight the droppable if it's ready to collect the draggable
	// RH - add leaning class; top, right, left, bottom
	Droppable.prototype.highlight = function( draggableEl ) {
		var leaning = this.isDroppableAdvanced( draggableEl );
		
		if( leaning !== false ) {
			classie.add( this.el, 'highlight' );
			// Check if leaning is different to previous check...
			if (this.leaning !== leaning) {
				// if not, swap class out
				classie.remove( this.el, this.leaning );
				classie.add( this.el, leaning );
				// save previous leaning
				this.leaning = leaning;
			}
		} else {
			classie.remove( this.el, 'highlight' );
			classie.remove( this.el, this.leaning );
			// remove leaning
			this.leaning = null;
		}
	}

	// accepts a draggable element...
	Droppable.prototype.collect = function( draggableEl ) {
		// remove highlight class from droppable element
		classie.remove( this.el, 'highlight' );
		this.options.onDrop( this, draggableEl , this.leaning);
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
  window.Draggable = dropDefinition(
    window.classie
  );
}

})(window);