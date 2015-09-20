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
 * Modified by BaseKit Platform Ltd
 * - Made code AMD ready!
 * 
 * Original Code found here: 
 * http://tympanus.net/codrops/2014/11/11/drag-and-drop-interaction-ideas/
 */
;( function( window ) {

	'use strict';

function dragDefinition(Draggabilly, classie ) {

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

	function isElement(o){
		return (
			typeof HTMLElement === "object" ? o instanceof HTMLElement : o && typeof o === "object" && o !== null && o.nodeType === 1 && typeof o.nodeName==="string"
		);
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

	function scrollX() { 
		return window.pageXOffset || docElem.scrollLeft; 
	}

	function scrollY() { 
		return window.pageYOffset || docElem.scrollTop; 
	}
	// gets the offset of an element relative to the document
	function getOffset( el ) {
		var offset = el.getBoundingClientRect();
		return { top : offset.top + scrollY(), left : offset.left + scrollX() }
	}

	function setTransformStyle( el, tval ) { 
		el.style.transform = tval; 
	}
	
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
	/** Draggable **/
	/***************/

	function Draggable( draggableEl, droppables, options ) {
		this.el = draggableEl;
		this.options = extend( {}, this.options );
		extend( this.options, options );
		this.droppables = droppables;
		this.scrollableEl = typeof this.options.scrollable.contentWindow === 'object' ? this.options.scrollable : document.querySelector( this.options.scrollable );
		this.scrollIncrement = 0;
		if( this.options.helper ) {
			this.offset = { left : getOffset( this.el ).left, top : getOffset( this.el ).top };
		}
		this.draggie = new Draggabilly( this.el, this.options.draggabilly );
		this.initEvents();
	}

	Draggable.prototype.options = {
		// auto scroll when dragging
		scroll: false,

		// element to scroll
		scrollable : window,
		
		// scroll speed (px)
		scrollSpeed : 20,
		
		// minimum distance to the scrollable element edges to trigger the scroll
		scrollSensitivity : 10,
		
		// draggabilly options
		draggabilly : {},
		
		// if the item should animate back to its original position
		animBack : true,
		
		// clone the draggable and insert it on the same position while dragging the original one
		helper : false,
		
		// callbacks
		onStart : function() { return false; },
		onDrag : function() { return false; },
		onEnd : function(wasDropped) { return false; }
	}

	Draggable.prototype.initEvents = function() {

		this.draggie.on( 'dragStart', this.onDragStart.bind(this) );
		this.draggie.on( 'dragMove', throttle( this.onDragMove.bind(this), 5 ) );
		this.draggie.on( 'dragEnd', this.onDragEnd.bind(this) );

	}

	Draggable.prototype.onDragStart = function( instance, event, pointer ) {

		//callback
		this.options.onStart();

		// save left & top
		this.position = { left : instance.position.x, top : instance.position.y };
		// create helper
		if( this.options.helper ) {
			this.createHelper( instance.element );
		}
		// add class is-active to the draggable element (control the draggable z-index)
		classie.add( instance.element, 'is-active' );
		// highlight droppable elements if draggables intersect
		this.highlightDroppables();
	}

	Draggable.prototype.onDragMove = function( instance, event, pointer ) {

		var droppableCoords = null;

		// scroll page if at viewport's edge
		if( this.options.scroll ) {
			this.scrollPage( instance.element );
		}
		// highlight droppable elements if draggables intersect
		droppableCoords = this.highlightDroppables();

		//callback
		this.options.onDrag(droppableCoords);
	}

	Draggable.prototype.onDragEnd = function( instance, event, pointer ) {
		var withAnimation, 
			droppableEl,
			dropped, 
			len,
			i;

		if( this.options.helper && this.options.context === 'toplevel' ) {

			instance.element.style.top = this.position.top + parseInt(instance.position.y,10) + 'px';
			instance.element.style.left = this.position.left + parseInt(instance.position.x,10) + 'px';	

		}

		if( this.options.scroll ) {
			// reset this.scrollIncrement
			this.scrollIncrement = 0;
		}

		// if the draggable && droppable elements intersect 
		// then "drop" and move back the draggable

		dropped = false;
		for( i = 0, len = this.droppables.length; i < len; ++i ) {
			droppableEl = this.droppables[i];

			if( droppableEl.isDroppableAdvanced( instance.element, true ) ) {
				dropped = true;
				droppableEl.collect( instance.element );
			}
		}

		//callback
		this.options.onEnd( dropped );

		withAnimation = true;
		
		if( dropped ) {
			// add class is-dropped to draggable ( controls how the draggable appears again at its original position)
			classie.add( instance.element, 'is-dropped' );
			// after a timeout remove that class to trigger the transition
			setTimeout( function() {
				classie.add( instance.element, 'is-complete' );
				
				onEndTransition( instance.element, function() {
					classie.remove( instance.element, 'is-complete' );
					classie.remove( instance.element, 'is-dropped' );
				} );
			}, 25 );
		}

		// move back with animation - track if the element moved away from its initial position or if it was dropped in a droppable element
		if( this.position.left === instance.position.x && this.position.top === instance.position.y || dropped ) {
			// in this case we will not set a transition for the item to move back
			withAnimation = false;
		}

		// move back the draggable element (with or without a transition)
		this.moveBack( withAnimation );
	}

	Draggable.prototype.onDragEndAnimation = function() {

		if(typeof this.options.onDragEndAnimation === 'function') {
			this.options.onDragEndAnimation();
		}
	}

	Draggable.prototype.highlightDroppables = function( el ) {
		var hoverCoords = null,
			droppableCoords = null;

		for( var i = 0, len = this.droppables.length; i < len; ++i ) {
			droppableCoords = this.droppables[i].highlight( this.el );
			if( droppableCoords.leaning !== false ) {
				hoverCoords = droppableCoords;
			}
		}

		return hoverCoords;
	}

	Draggable.prototype.createHelper = function() {

		var draggable, 
			clone;

		// clone the original item (same position)
		clone = this.el.cloneNode( true );
		
		// because the original element started the dragging, we need to remove the is-dragging class
		classie.remove( clone, 'is-dragging' );
		this.el.parentNode.replaceChild( clone, this.el );
		
		// initialize Draggabilly on the clone.. 
		draggable = new Draggable( clone, this.droppables, this.options );

		// the original item will be absolute on the page - need to set correct position values..
		classie.add( this.el, 'helper' );

		this.el.style.left = draggable.offset.left + 'px';
		this.el.style.top = draggable.offset.top + 'px';

		// save new left/top
		this.position.left = draggable.offset.left;
		this.position.top = draggable.offset.top;

		body.appendChild( this.el );

		classie.add( clone, 'is-drag-original' );
	}

	// move back the draggable to its original position
	Draggable.prototype.moveBack = function( withAnimation ) {

		var callbackFn, 
			anim;

		anim = this.options.animBack && withAnimation;

		// add animate class (where the transition is defined)
		if( anim ) { 
			classie.add( this.el, 'animate' ); 
		}
		
		// reset translation value
		setTransformStyle( this.el, is3d ? 'translate3d(0,0,0)' : 'translate(0,0)' );
		
		// apply original left/top
		this.el.style.left = this.position.left + 'px';
		this.el.style.top = this.position.top + 'px';
		
		// remove class animate (transition) and is-active to the draggable element (z-index)
		callbackFn = function() {

			if( anim ) { 
				classie.remove( this.el, 'animate' ); 
			}
			classie.remove( this.el, 'is-active' );
			if( this.options.helper ) {
				body.removeChild( this.el );
				classie.remove(document.getElementsByClassName('is-drag-original')[0], 'is-drag-original');
				this.onDragEndAnimation();
			}
		}.bind( this );

		if( anim ) {
			onEndTransition( this.el, callbackFn );
		}
		else {
			callbackFn();
		}
	}

	// check if element is outside of the viewport. TODO: check also for right and left sides
	Draggable.prototype.outViewport = function() {
		var scrollSensitivity = Math.abs( this.options.scrollSensitivity ) || 0,
			scrolled = scrollY(),
			viewed = scrolled + getViewportH(),
			elT = getOffset( this.el ).top,
			elHalfPos = elT + this.el.offsetHeight/2,
			belowViewport = elT + this.el.offsetHeight + scrollSensitivity > viewed,
			aboveViewport = elT - scrollSensitivity < scrolled;

		if( belowViewport ) this.scrolldir = 'down';
		else if( aboveViewport ) this.scrolldir = 'up';

		return belowViewport || aboveViewport;
	}

	// force the scroll on the page when dragging..
	Draggable.prototype.scrollPage = function() {
		// check if draggable is "outside" of the viewport
		if( this.outViewport( this.el ) ) {
			this.doScroll();
		}
		else {
			// reset this.scrollIncrement
			this.scrollIncrement = 0;
		}
	}

	// just considering scroll up and down
	// this.scrollIncrement is used to accelerate the scrolling. But mainly it's used to avoid the draggable flickering due to the throttle when dragging
	// todo: scroll right and left
	// todo: draggabilly multi touch scroll: see https://github.com/desandro/draggabilly/issues/1
	Draggable.prototype.doScroll = function() {
		var speed, val;
		
		speed = this.options.scrollSpeed || 20;
		this.scrollIncrement++;
		val = this.scrollIncrement < speed ? this.scrollIncrement : speed;

		if(isiOSSafari()) {

			// If iOS Safari, (ouch...) scroll this window
			// Set timeout is needed to fix scrolling on iPhone safari
			setTimeout(window.scrollTo( 0, this.scrolldir === 'up' ? window.pageYOffset + (val * -1) : window.pageYOffset + val ),10) ;
		
		} else if(

			// If iframe is the scrollable element
			isElement(this.scrollableEl) && 
			typeof this.scrollableEl.contentWindow === 'object'

		) {
			// Set timeout is needed to fix scrolling on iPhone safari
			setTimeout(this.scrollableEl.contentWindow.scrollTo( 0, this.scrolldir === 'up' ? this.scrollableEl.contentWindow.pageYOffset + (val * -1) : this.scrollableEl.contentWindow.pageYOffset + val ),10) ;
		
		// Else scroll the element
		} else {
			this.scrollableEl.scrollTop += this.scrolldir === 'up' ? val * -1 : val;
		}
	}

	return Draggable;

}; // end definition

// -------------------------- transport -------------------------- //

if ( typeof define === 'function' && define.amd ) {
  // AMD
  define( [
  	'draggabilly',
	'classie'		
    ],
    dragDefinition );
} else if ( typeof exports === 'object' ) {
  // CommonJS
  module.exports = dragDefinition(
  	require('desandro-classie')
  );
} else {
  // browser global
  window.Draggable = dragDefinition(
    window.Draggabilly,
    window.classie
  );
}
})( window );