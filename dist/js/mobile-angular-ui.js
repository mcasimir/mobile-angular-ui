/*! Overthrow. An overflow:auto polyfill for responsive design. (c) 2012: Scott Jehl, Filament Group, Inc. http://filamentgroup.github.com/Overthrow/license.txt */
(function( w, undefined ){
	
	var doc = w.document,
		docElem = doc.documentElement,
		enabledClassName = "overthrow-enabled",

		// Touch events are used in the polyfill, and thus are a prerequisite
		canBeFilledWithPoly = "ontouchmove" in doc,
		
		// The following attempts to determine whether the browser has native overflow support
		// so we can enable it but not polyfill
		nativeOverflow = 
			// Features-first. iOS5 overflow scrolling property check - no UA needed here. thanks Apple :)
			"WebkitOverflowScrolling" in docElem.style ||
			// Test the windows scrolling property as well
			"msOverflowStyle" in docElem.style ||
			// Touch events aren't supported and screen width is greater than X
			// ...basically, this is a loose "desktop browser" check. 
			// It may wrongly opt-in very large tablets with no touch support.
			( !canBeFilledWithPoly && w.screen.width > 800 ) ||
			// Hang on to your hats.
			// Whitelist some popular, overflow-supporting mobile browsers for now and the future
			// These browsers are known to get overlow support right, but give us no way of detecting it.
			(function(){
				var ua = w.navigator.userAgent,
					// Webkit crosses platforms, and the browsers on our list run at least version 534
					webkit = ua.match( /AppleWebKit\/([0-9]+)/ ),
					wkversion = webkit && webkit[1],
					wkLte534 = webkit && wkversion >= 534;
					
				return (
					/* Android 3+ with webkit gte 534
					~: Mozilla/5.0 (Linux; U; Android 3.0; en-us; Xoom Build/HRI39) AppleWebKit/534.13 (KHTML, like Gecko) Version/4.0 Safari/534.13 */
					ua.match( /Android ([0-9]+)/ ) && RegExp.$1 >= 3 && wkLte534 ||
					/* Blackberry 7+ with webkit gte 534
					~: Mozilla/5.0 (BlackBerry; U; BlackBerry 9900; en-US) AppleWebKit/534.11+ (KHTML, like Gecko) Version/7.0.0 Mobile Safari/534.11+ */
					ua.match( / Version\/([0-9]+)/ ) && RegExp.$1 >= 0 && w.blackberry && wkLte534 ||
					/* Blackberry Playbook with webkit gte 534
					~: Mozilla/5.0 (PlayBook; U; RIM Tablet OS 1.0.0; en-US) AppleWebKit/534.8+ (KHTML, like Gecko) Version/0.0.1 Safari/534.8+ */   
					ua.indexOf( "PlayBook" ) > -1 && wkLte534 && !ua.indexOf( "Android 2" ) === -1 ||
					/* Firefox Mobile (Fennec) 4 and up
					~: Mozilla/5.0 (Mobile; rv:15.0) Gecko/15.0 Firefox/15.0 */
					ua.match(/Firefox\/([0-9]+)/) && RegExp.$1 >= 4 ||
					/* WebOS 3 and up (TouchPad too)
					~: Mozilla/5.0 (hp-tablet; Linux; hpwOS/3.0.0; U; en-US) AppleWebKit/534.6 (KHTML, like Gecko) wOSBrowser/233.48 Safari/534.6 TouchPad/1.0 */
					ua.match( /wOSBrowser\/([0-9]+)/ ) && RegExp.$1 >= 233 && wkLte534 ||
					/* Nokia Browser N8
					~: Mozilla/5.0 (Symbian/3; Series60/5.2 NokiaN8-00/012.002; Profile/MIDP-2.1 Configuration/CLDC-1.1 ) AppleWebKit/533.4 (KHTML, like Gecko) NokiaBrowser/7.3.0 Mobile Safari/533.4 3gpp-gba 
					~: Note: the N9 doesn't have native overflow with one-finger touch. wtf */
					ua.match( /NokiaBrowser\/([0-9\.]+)/ ) && parseFloat(RegExp.$1) === 7.3 && webkit && wkversion >= 533
				);
			})();

	// Expose overthrow API
	w.overthrow = {};

	w.overthrow.enabledClassName = enabledClassName;

	w.overthrow.addClass = function(){
		if( docElem.className.indexOf( w.overthrow.enabledClassName ) === -1 ){
			docElem.className += " " + w.overthrow.enabledClassName;
		}
	};

	w.overthrow.removeClass = function(){
		docElem.className = docElem.className.replace( w.overthrow.enabledClassName, "" );
	};

	// Enable and potentially polyfill overflow
	w.overthrow.set = function(){
			
		// If nativeOverflow or at least the element canBeFilledWithPoly, add a class to cue CSS that assumes overflow scrolling will work (setting height on elements and such)
		if( nativeOverflow ){
			w.overthrow.addClass();
		}

	};

	// expose polyfillable 
	w.overthrow.canBeFilledWithPoly = canBeFilledWithPoly;

	// Destroy everything later. If you want to.
	w.overthrow.forget = function(){

		w.overthrow.removeClass();
		
	};
		
	// Expose overthrow API
	w.overthrow.support = nativeOverflow ? "native" : "none";
		
})( this );

/*! Overthrow. An overflow:auto polyfill for responsive design. (c) 2012: Scott Jehl, Filament Group, Inc. http://filamentgroup.github.com/Overthrow/license.txt */
(function( w, undefined ){
	
	// Auto-init
	w.overthrow.set();

}( this ));
/*! Overthrow. An overflow:auto polyfill for responsive design. (c) 2012: Scott Jehl, Filament Group, Inc. http://filamentgroup.github.com/Overthrow/license.txt */
(function( w, o, undefined ){

	// o is overthrow reference from overthrow-polyfill.js
	if( o === undefined ){
		return;
	}

	o.scrollIndicatorClassName = "overthrow";
	
	var doc = w.document,
		docElem = doc.documentElement,
		// o api
		nativeOverflow = o.support === "native",
		canBeFilledWithPoly = o.canBeFilledWithPoly,
		configure = o.configure,
		set = o.set,
		forget = o.forget,
		scrollIndicatorClassName = o.scrollIndicatorClassName;

	// find closest overthrow (elem or a parent)
	o.closest = function( target, ascend ){
		return !ascend && target.className && target.className.indexOf( scrollIndicatorClassName ) > -1 && target || o.closest( target.parentNode );
	};
		
	// polyfill overflow
	var enabled = false;
	o.set = function(){
			
		set();

		// If nativeOverflow or it doesn't look like the browser canBeFilledWithPoly, our job is done here. Exit viewport left.
		if( enabled || nativeOverflow || !canBeFilledWithPoly ){
			return;
		}

		w.overthrow.addClass();

		enabled = true;

		o.support = "polyfilled";

		o.forget = function(){
			forget();
			enabled = false;
			// Remove touch binding (check for method support since this part isn't qualified by touch support like the rest)
			if( doc.removeEventListener ){
				doc.removeEventListener( "touchstart", start, false );
			}
		};

		// Fill 'er up!
		// From here down, all logic is associated with touch scroll handling
			// elem references the overthrow element in use
		var elem,
			
			// The last several Y values are kept here
			lastTops = [],
	
			// The last several X values are kept here
			lastLefts = [],
			
			// lastDown will be true if the last scroll direction was down, false if it was up
			lastDown,
			
			// lastRight will be true if the last scroll direction was right, false if it was left
			lastRight,
			
			// For a new gesture, or change in direction, reset the values from last scroll
			resetVertTracking = function(){
				lastTops = [];
				lastDown = null;
			},
			
			resetHorTracking = function(){
				lastLefts = [];
				lastRight = null;
			},
		
			// On webkit, touch events hardly trickle through textareas and inputs
			// Disabling CSS pointer events makes sure they do, but it also makes the controls innaccessible
			// Toggling pointer events at the right moments seems to do the trick
			// Thanks Thomas Bachem http://stackoverflow.com/a/5798681 for the following
			inputs,
			setPointers = function( val ){
				inputs = elem.querySelectorAll( "textarea, input" );
				for( var i = 0, il = inputs.length; i < il; i++ ) {
					inputs[ i ].style.pointerEvents = val;
				}
			},
			
			// For nested overthrows, changeScrollTarget restarts a touch event cycle on a parent or child overthrow
			changeScrollTarget = function( startEvent, ascend ){
				if( doc.createEvent ){
					var newTarget = ( !ascend || ascend === undefined ) && elem.parentNode || elem.touchchild || elem,
						tEnd;
							
					if( newTarget !== elem ){
						tEnd = doc.createEvent( "HTMLEvents" );
						tEnd.initEvent( "touchend", true, true );
						elem.dispatchEvent( tEnd );
						newTarget.touchchild = elem;
						elem = newTarget;
						newTarget.dispatchEvent( startEvent );
					}
				}
			},
			
			// Touchstart handler
			// On touchstart, touchmove and touchend are freshly bound, and all three share a bunch of vars set by touchstart
			// Touchend unbinds them again, until next time
			start = function( e ){

				// Stop any throw in progress
				if( o.intercept ){
					o.intercept();
				}
				
				// Reset the distance and direction tracking
				resetVertTracking();
				resetHorTracking();
				
				elem = o.closest( e.target );
					
				if( !elem || elem === docElem || e.touches.length > 1 ){
					return;
				}			

				setPointers( "none" );
				var touchStartE = e,
					scrollT = elem.scrollTop,
					scrollL = elem.scrollLeft,
					height = elem.offsetHeight,
					width = elem.offsetWidth,
					startY = e.touches[ 0 ].pageY,
					startX = e.touches[ 0 ].pageX,
					scrollHeight = elem.scrollHeight,
					scrollWidth = elem.scrollWidth,
				
					// Touchmove handler
					move = function( e ){
					
						var ty = scrollT + startY - e.touches[ 0 ].pageY,
							tx = scrollL + startX - e.touches[ 0 ].pageX,
							down = ty >= ( lastTops.length ? lastTops[ 0 ] : 0 ),
							right = tx >= ( lastLefts.length ? lastLefts[ 0 ] : 0 );
							
						// If there's room to scroll the current container, prevent the default window scroll
						if( ( ty > 0 && ty < scrollHeight - height ) || ( tx > 0 && tx < scrollWidth - width ) ){
							e.preventDefault();
						}
						// This bubbling is dumb. Needs a rethink.
						else {
							changeScrollTarget( touchStartE );
						}
						
						// If down and lastDown are inequal, the y scroll has changed direction. Reset tracking.
						if( lastDown && down !== lastDown ){
							resetVertTracking();
						}
						
						// If right and lastRight are inequal, the x scroll has changed direction. Reset tracking.
						if( lastRight && right !== lastRight ){
							resetHorTracking();
						}
						
						// remember the last direction in which we were headed
						lastDown = down;
						lastRight = right;							
						
						// set the container's scroll
						elem.scrollTop = ty;
						elem.scrollLeft = tx;
					
						lastTops.unshift( ty );
						lastLefts.unshift( tx );
					
						if( lastTops.length > 3 ){
							lastTops.pop();
						}
						if( lastLefts.length > 3 ){
							lastLefts.pop();
						}
					},
				
					// Touchend handler
					end = function( e ){

						// Bring the pointers back
						setPointers( "auto" );
						setTimeout( function(){
							setPointers( "none" );
						}, 450 );
						elem.removeEventListener( "touchmove", move, false );
						elem.removeEventListener( "touchend", end, false );
					};
				
				elem.addEventListener( "touchmove", move, false );
				elem.addEventListener( "touchend", end, false );
			};
			
		// Bind to touch, handle move and end within
		doc.addEventListener( "touchstart", start, false );
	};
		
})( this, this.overthrow );

/**
 * @preserve FastClick: polyfill to remove click delays on browsers with touch UIs.
 *
 * @version 1.0.3
 * @codingstandard ftlabs-jsv2
 * @copyright The Financial Times Limited [All Rights Reserved]
 * @license MIT License (see LICENSE.txt)
 */

/*jslint browser:true, node:true*/
/*global define, Event, Node*/


/**
 * Instantiate fast-clicking listeners on the specified layer.
 *
 * @constructor
 * @param {Element} layer The layer to listen on
 * @param {Object} options The options to override the defaults
 */
function FastClick(layer, options) {
	'use strict';
	var oldOnClick;

	options = options || {};

	/**
	 * Whether a click is currently being tracked.
	 *
	 * @type boolean
	 */
	this.trackingClick = false;


	/**
	 * Timestamp for when click tracking started.
	 *
	 * @type number
	 */
	this.trackingClickStart = 0;


	/**
	 * The element being tracked for a click.
	 *
	 * @type EventTarget
	 */
	this.targetElement = null;


	/**
	 * X-coordinate of touch start event.
	 *
	 * @type number
	 */
	this.touchStartX = 0;


	/**
	 * Y-coordinate of touch start event.
	 *
	 * @type number
	 */
	this.touchStartY = 0;


	/**
	 * ID of the last touch, retrieved from Touch.identifier.
	 *
	 * @type number
	 */
	this.lastTouchIdentifier = 0;


	/**
	 * Touchmove boundary, beyond which a click will be cancelled.
	 *
	 * @type number
	 */
	this.touchBoundary = options.touchBoundary || 10;


	/**
	 * The FastClick layer.
	 *
	 * @type Element
	 */
	this.layer = layer;

	/**
	 * The minimum time between tap(touchstart and touchend) events
	 *
	 * @type number
	 */
	this.tapDelay = options.tapDelay || 200;

	if (FastClick.notNeeded(layer)) {
		return;
	}

	// Some old versions of Android don't have Function.prototype.bind
	function bind(method, context) {
		return function() { return method.apply(context, arguments); };
	}


	var methods = ['onMouse', 'onClick', 'onTouchStart', 'onTouchMove', 'onTouchEnd', 'onTouchCancel'];
	var context = this;
	for (var i = 0, l = methods.length; i < l; i++) {
		context[methods[i]] = bind(context[methods[i]], context);
	}

	// Set up event handlers as required
	if (deviceIsAndroid) {
		layer.addEventListener('mouseover', this.onMouse, true);
		layer.addEventListener('mousedown', this.onMouse, true);
		layer.addEventListener('mouseup', this.onMouse, true);
	}

	layer.addEventListener('click', this.onClick, true);
	layer.addEventListener('touchstart', this.onTouchStart, false);
	layer.addEventListener('touchmove', this.onTouchMove, false);
	layer.addEventListener('touchend', this.onTouchEnd, false);
	layer.addEventListener('touchcancel', this.onTouchCancel, false);

	// Hack is required for browsers that don't support Event#stopImmediatePropagation (e.g. Android 2)
	// which is how FastClick normally stops click events bubbling to callbacks registered on the FastClick
	// layer when they are cancelled.
	if (!Event.prototype.stopImmediatePropagation) {
		layer.removeEventListener = function(type, callback, capture) {
			var rmv = Node.prototype.removeEventListener;
			if (type === 'click') {
				rmv.call(layer, type, callback.hijacked || callback, capture);
			} else {
				rmv.call(layer, type, callback, capture);
			}
		};

		layer.addEventListener = function(type, callback, capture) {
			var adv = Node.prototype.addEventListener;
			if (type === 'click') {
				adv.call(layer, type, callback.hijacked || (callback.hijacked = function(event) {
					if (!event.propagationStopped) {
						callback(event);
					}
				}), capture);
			} else {
				adv.call(layer, type, callback, capture);
			}
		};
	}

	// If a handler is already declared in the element's onclick attribute, it will be fired before
	// FastClick's onClick handler. Fix this by pulling out the user-defined handler function and
	// adding it as listener.
	if (typeof layer.onclick === 'function') {

		// Android browser on at least 3.2 requires a new reference to the function in layer.onclick
		// - the old one won't work if passed to addEventListener directly.
		oldOnClick = layer.onclick;
		layer.addEventListener('click', function(event) {
			oldOnClick(event);
		}, false);
		layer.onclick = null;
	}
}


/**
 * Android requires exceptions.
 *
 * @type boolean
 */
var deviceIsAndroid = navigator.userAgent.indexOf('Android') > 0;


/**
 * iOS requires exceptions.
 *
 * @type boolean
 */
var deviceIsIOS = /iP(ad|hone|od)/.test(navigator.userAgent);


/**
 * iOS 4 requires an exception for select elements.
 *
 * @type boolean
 */
var deviceIsIOS4 = deviceIsIOS && (/OS 4_\d(_\d)?/).test(navigator.userAgent);


/**
 * iOS 6.0(+?) requires the target element to be manually derived
 *
 * @type boolean
 */
var deviceIsIOSWithBadTarget = deviceIsIOS && (/OS ([6-9]|\d{2})_\d/).test(navigator.userAgent);

/**
 * BlackBerry requires exceptions.
 *
 * @type boolean
 */
var deviceIsBlackBerry10 = navigator.userAgent.indexOf('BB10') > 0;

/**
 * Determine whether a given element requires a native click.
 *
 * @param {EventTarget|Element} target Target DOM element
 * @returns {boolean} Returns true if the element needs a native click
 */
FastClick.prototype.needsClick = function(target) {
	'use strict';
	switch (target.nodeName.toLowerCase()) {

	// Don't send a synthetic click to disabled inputs (issue #62)
	case 'button':
	case 'select':
	case 'textarea':
		if (target.disabled) {
			return true;
		}

		break;
	case 'input':

		// File inputs need real clicks on iOS 6 due to a browser bug (issue #68)
		if ((deviceIsIOS && target.type === 'file') || target.disabled) {
			return true;
		}

		break;
	case 'label':
	case 'video':
		return true;
	}

	return (/\bneedsclick\b/).test(target.className);
};


/**
 * Determine whether a given element requires a call to focus to simulate click into element.
 *
 * @param {EventTarget|Element} target Target DOM element
 * @returns {boolean} Returns true if the element requires a call to focus to simulate native click.
 */
FastClick.prototype.needsFocus = function(target) {
	'use strict';
	switch (target.nodeName.toLowerCase()) {
	case 'textarea':
		return true;
	case 'select':
		return !deviceIsAndroid;
	case 'input':
		switch (target.type) {
		case 'button':
		case 'checkbox':
		case 'file':
		case 'image':
		case 'radio':
		case 'submit':
			return false;
		}

		// No point in attempting to focus disabled inputs
		return !target.disabled && !target.readOnly;
	default:
		return (/\bneedsfocus\b/).test(target.className);
	}
};


/**
 * Send a click event to the specified element.
 *
 * @param {EventTarget|Element} targetElement
 * @param {Event} event
 */
FastClick.prototype.sendClick = function(targetElement, event) {
	'use strict';
	var clickEvent, touch;

	// On some Android devices activeElement needs to be blurred otherwise the synthetic click will have no effect (#24)
	if (document.activeElement && document.activeElement !== targetElement) {
		document.activeElement.blur();
	}

	touch = event.changedTouches[0];

	// Synthesise a click event, with an extra attribute so it can be tracked
	clickEvent = document.createEvent('MouseEvents');
	clickEvent.initMouseEvent(this.determineEventType(targetElement), true, true, window, 1, touch.screenX, touch.screenY, touch.clientX, touch.clientY, false, false, false, false, 0, null);
	clickEvent.forwardedTouchEvent = true;
	targetElement.dispatchEvent(clickEvent);
};

FastClick.prototype.determineEventType = function(targetElement) {
	'use strict';

	//Issue #159: Android Chrome Select Box does not open with a synthetic click event
	if (deviceIsAndroid && targetElement.tagName.toLowerCase() === 'select') {
		return 'mousedown';
	}

	return 'click';
};


/**
 * @param {EventTarget|Element} targetElement
 */
FastClick.prototype.focus = function(targetElement) {
	'use strict';
	var length;

	// Issue #160: on iOS 7, some input elements (e.g. date datetime) throw a vague TypeError on setSelectionRange. These elements don't have an integer value for the selectionStart and selectionEnd properties, but unfortunately that can't be used for detection because accessing the properties also throws a TypeError. Just check the type instead. Filed as Apple bug #15122724.
	if (deviceIsIOS && targetElement.setSelectionRange && targetElement.type.indexOf('date') !== 0 && targetElement.type !== 'time') {
		length = targetElement.value.length;
		targetElement.setSelectionRange(length, length);
	} else {
		targetElement.focus();
	}
};


/**
 * Check whether the given target element is a child of a scrollable layer and if so, set a flag on it.
 *
 * @param {EventTarget|Element} targetElement
 */
FastClick.prototype.updateScrollParent = function(targetElement) {
	'use strict';
	var scrollParent, parentElement;

	scrollParent = targetElement.fastClickScrollParent;

	// Attempt to discover whether the target element is contained within a scrollable layer. Re-check if the
	// target element was moved to another parent.
	if (!scrollParent || !scrollParent.contains(targetElement)) {
		parentElement = targetElement;
		do {
			if (parentElement.scrollHeight > parentElement.offsetHeight) {
				scrollParent = parentElement;
				targetElement.fastClickScrollParent = parentElement;
				break;
			}

			parentElement = parentElement.parentElement;
		} while (parentElement);
	}

	// Always update the scroll top tracker if possible.
	if (scrollParent) {
		scrollParent.fastClickLastScrollTop = scrollParent.scrollTop;
	}
};


/**
 * @param {EventTarget} targetElement
 * @returns {Element|EventTarget}
 */
FastClick.prototype.getTargetElementFromEventTarget = function(eventTarget) {
	'use strict';

	// On some older browsers (notably Safari on iOS 4.1 - see issue #56) the event target may be a text node.
	if (eventTarget.nodeType === Node.TEXT_NODE) {
		return eventTarget.parentNode;
	}

	return eventTarget;
};


/**
 * On touch start, record the position and scroll offset.
 *
 * @param {Event} event
 * @returns {boolean}
 */
FastClick.prototype.onTouchStart = function(event) {
	'use strict';
	var targetElement, touch, selection;

	// Ignore multiple touches, otherwise pinch-to-zoom is prevented if both fingers are on the FastClick element (issue #111).
	if (event.targetTouches.length > 1) {
		return true;
	}

	targetElement = this.getTargetElementFromEventTarget(event.target);
	touch = event.targetTouches[0];

	if (deviceIsIOS) {

		// Only trusted events will deselect text on iOS (issue #49)
		selection = window.getSelection();
		if (selection.rangeCount && !selection.isCollapsed) {
			return true;
		}

		if (!deviceIsIOS4) {

			// Weird things happen on iOS when an alert or confirm dialog is opened from a click event callback (issue #23):
			// when the user next taps anywhere else on the page, new touchstart and touchend events are dispatched
			// with the same identifier as the touch event that previously triggered the click that triggered the alert.
			// Sadly, there is an issue on iOS 4 that causes some normal touch events to have the same identifier as an
			// immediately preceeding touch event (issue #52), so this fix is unavailable on that platform.
			// Issue 120: touch.identifier is 0 when Chrome dev tools 'Emulate touch events' is set with an iOS device UA string,
			// which causes all touch events to be ignored. As this block only applies to iOS, and iOS identifiers are always long,
			// random integers, it's safe to to continue if the identifier is 0 here.
			if (touch.identifier && touch.identifier === this.lastTouchIdentifier) {
				event.preventDefault();
				return false;
			}

			this.lastTouchIdentifier = touch.identifier;

			// If the target element is a child of a scrollable layer (using -webkit-overflow-scrolling: touch) and:
			// 1) the user does a fling scroll on the scrollable layer
			// 2) the user stops the fling scroll with another tap
			// then the event.target of the last 'touchend' event will be the element that was under the user's finger
			// when the fling scroll was started, causing FastClick to send a click event to that layer - unless a check
			// is made to ensure that a parent layer was not scrolled before sending a synthetic click (issue #42).
			this.updateScrollParent(targetElement);
		}
	}

	this.trackingClick = true;
	this.trackingClickStart = event.timeStamp;
	this.targetElement = targetElement;

	this.touchStartX = touch.pageX;
	this.touchStartY = touch.pageY;

	// Prevent phantom clicks on fast double-tap (issue #36)
	if ((event.timeStamp - this.lastClickTime) < this.tapDelay) {
		event.preventDefault();
	}

	return true;
};


/**
 * Based on a touchmove event object, check whether the touch has moved past a boundary since it started.
 *
 * @param {Event} event
 * @returns {boolean}
 */
FastClick.prototype.touchHasMoved = function(event) {
	'use strict';
	var touch = event.changedTouches[0], boundary = this.touchBoundary;

	if (Math.abs(touch.pageX - this.touchStartX) > boundary || Math.abs(touch.pageY - this.touchStartY) > boundary) {
		return true;
	}

	return false;
};


/**
 * Update the last position.
 *
 * @param {Event} event
 * @returns {boolean}
 */
FastClick.prototype.onTouchMove = function(event) {
	'use strict';
	if (!this.trackingClick) {
		return true;
	}

	// If the touch has moved, cancel the click tracking
	if (this.targetElement !== this.getTargetElementFromEventTarget(event.target) || this.touchHasMoved(event)) {
		this.trackingClick = false;
		this.targetElement = null;
	}

	return true;
};


/**
 * Attempt to find the labelled control for the given label element.
 *
 * @param {EventTarget|HTMLLabelElement} labelElement
 * @returns {Element|null}
 */
FastClick.prototype.findControl = function(labelElement) {
	'use strict';

	// Fast path for newer browsers supporting the HTML5 control attribute
	if (labelElement.control !== undefined) {
		return labelElement.control;
	}

	// All browsers under test that support touch events also support the HTML5 htmlFor attribute
	if (labelElement.htmlFor) {
		return document.getElementById(labelElement.htmlFor);
	}

	// If no for attribute exists, attempt to retrieve the first labellable descendant element
	// the list of which is defined here: http://www.w3.org/TR/html5/forms.html#category-label
	return labelElement.querySelector('button, input:not([type=hidden]), keygen, meter, output, progress, select, textarea');
};


/**
 * On touch end, determine whether to send a click event at once.
 *
 * @param {Event} event
 * @returns {boolean}
 */
FastClick.prototype.onTouchEnd = function(event) {
	'use strict';
	var forElement, trackingClickStart, targetTagName, scrollParent, touch, targetElement = this.targetElement;

	if (!this.trackingClick) {
		return true;
	}

	// Prevent phantom clicks on fast double-tap (issue #36)
	if ((event.timeStamp - this.lastClickTime) < this.tapDelay) {
		this.cancelNextClick = true;
		return true;
	}

	// Reset to prevent wrong click cancel on input (issue #156).
	this.cancelNextClick = false;

	this.lastClickTime = event.timeStamp;

	trackingClickStart = this.trackingClickStart;
	this.trackingClick = false;
	this.trackingClickStart = 0;

	// On some iOS devices, the targetElement supplied with the event is invalid if the layer
	// is performing a transition or scroll, and has to be re-detected manually. Note that
	// for this to function correctly, it must be called *after* the event target is checked!
	// See issue #57; also filed as rdar://13048589 .
	if (deviceIsIOSWithBadTarget) {
		touch = event.changedTouches[0];

		// In certain cases arguments of elementFromPoint can be negative, so prevent setting targetElement to null
		targetElement = document.elementFromPoint(touch.pageX - window.pageXOffset, touch.pageY - window.pageYOffset) || targetElement;
		targetElement.fastClickScrollParent = this.targetElement.fastClickScrollParent;
	}

	targetTagName = targetElement.tagName.toLowerCase();
	if (targetTagName === 'label') {
		forElement = this.findControl(targetElement);
		if (forElement) {
			this.focus(targetElement);
			if (deviceIsAndroid) {
				return false;
			}

			targetElement = forElement;
		}
	} else if (this.needsFocus(targetElement)) {

		// Case 1: If the touch started a while ago (best guess is 100ms based on tests for issue #36) then focus will be triggered anyway. Return early and unset the target element reference so that the subsequent click will be allowed through.
		// Case 2: Without this exception for input elements tapped when the document is contained in an iframe, then any inputted text won't be visible even though the value attribute is updated as the user types (issue #37).
		if ((event.timeStamp - trackingClickStart) > 100 || (deviceIsIOS && window.top !== window && targetTagName === 'input')) {
			this.targetElement = null;
			return false;
		}

		this.focus(targetElement);
		this.sendClick(targetElement, event);

		// Select elements need the event to go through on iOS 4, otherwise the selector menu won't open.
		// Also this breaks opening selects when VoiceOver is active on iOS6, iOS7 (and possibly others)
		if (!deviceIsIOS || targetTagName !== 'select') {
			this.targetElement = null;
			event.preventDefault();
		}

		return false;
	}

	if (deviceIsIOS && !deviceIsIOS4) {

		// Don't send a synthetic click event if the target element is contained within a parent layer that was scrolled
		// and this tap is being used to stop the scrolling (usually initiated by a fling - issue #42).
		scrollParent = targetElement.fastClickScrollParent;
		if (scrollParent && scrollParent.fastClickLastScrollTop !== scrollParent.scrollTop) {
			return true;
		}
	}

	// Prevent the actual click from going though - unless the target node is marked as requiring
	// real clicks or if it is in the whitelist in which case only non-programmatic clicks are permitted.
	if (!this.needsClick(targetElement)) {
		event.preventDefault();
		this.sendClick(targetElement, event);
	}

	return false;
};


/**
 * On touch cancel, stop tracking the click.
 *
 * @returns {void}
 */
FastClick.prototype.onTouchCancel = function() {
	'use strict';
	this.trackingClick = false;
	this.targetElement = null;
};


/**
 * Determine mouse events which should be permitted.
 *
 * @param {Event} event
 * @returns {boolean}
 */
FastClick.prototype.onMouse = function(event) {
	'use strict';

	// If a target element was never set (because a touch event was never fired) allow the event
	if (!this.targetElement) {
		return true;
	}

	if (event.forwardedTouchEvent) {
		return true;
	}

	// Programmatically generated events targeting a specific element should be permitted
	if (!event.cancelable) {
		return true;
	}

	// Derive and check the target element to see whether the mouse event needs to be permitted;
	// unless explicitly enabled, prevent non-touch click events from triggering actions,
	// to prevent ghost/doubleclicks.
	if (!this.needsClick(this.targetElement) || this.cancelNextClick) {

		// Prevent any user-added listeners declared on FastClick element from being fired.
		if (event.stopImmediatePropagation) {
			event.stopImmediatePropagation();
		} else {

			// Part of the hack for browsers that don't support Event#stopImmediatePropagation (e.g. Android 2)
			event.propagationStopped = true;
		}

		// Cancel the event
		event.stopPropagation();
		event.preventDefault();

		return false;
	}

	// If the mouse event is permitted, return true for the action to go through.
	return true;
};


/**
 * On actual clicks, determine whether this is a touch-generated click, a click action occurring
 * naturally after a delay after a touch (which needs to be cancelled to avoid duplication), or
 * an actual click which should be permitted.
 *
 * @param {Event} event
 * @returns {boolean}
 */
FastClick.prototype.onClick = function(event) {
	'use strict';
	var permitted;

	// It's possible for another FastClick-like library delivered with third-party code to fire a click event before FastClick does (issue #44). In that case, set the click-tracking flag back to false and return early. This will cause onTouchEnd to return early.
	if (this.trackingClick) {
		this.targetElement = null;
		this.trackingClick = false;
		return true;
	}

	// Very odd behaviour on iOS (issue #18): if a submit element is present inside a form and the user hits enter in the iOS simulator or clicks the Go button on the pop-up OS keyboard the a kind of 'fake' click event will be triggered with the submit-type input element as the target.
	if (event.target.type === 'submit' && event.detail === 0) {
		return true;
	}

	permitted = this.onMouse(event);

	// Only unset targetElement if the click is not permitted. This will ensure that the check for !targetElement in onMouse fails and the browser's click doesn't go through.
	if (!permitted) {
		this.targetElement = null;
	}

	// If clicks are permitted, return true for the action to go through.
	return permitted;
};


/**
 * Remove all FastClick's event listeners.
 *
 * @returns {void}
 */
FastClick.prototype.destroy = function() {
	'use strict';
	var layer = this.layer;

	if (deviceIsAndroid) {
		layer.removeEventListener('mouseover', this.onMouse, true);
		layer.removeEventListener('mousedown', this.onMouse, true);
		layer.removeEventListener('mouseup', this.onMouse, true);
	}

	layer.removeEventListener('click', this.onClick, true);
	layer.removeEventListener('touchstart', this.onTouchStart, false);
	layer.removeEventListener('touchmove', this.onTouchMove, false);
	layer.removeEventListener('touchend', this.onTouchEnd, false);
	layer.removeEventListener('touchcancel', this.onTouchCancel, false);
};


/**
 * Check whether FastClick is needed.
 *
 * @param {Element} layer The layer to listen on
 */
FastClick.notNeeded = function(layer) {
	'use strict';
	var metaViewport;
	var chromeVersion;
	var blackberryVersion;

	// Devices that don't support touch don't need FastClick
	if (typeof window.ontouchstart === 'undefined') {
		return true;
	}

	// Chrome version - zero for other browsers
	chromeVersion = +(/Chrome\/([0-9]+)/.exec(navigator.userAgent) || [,0])[1];

	if (chromeVersion) {

		if (deviceIsAndroid) {
			metaViewport = document.querySelector('meta[name=viewport]');

			if (metaViewport) {
				// Chrome on Android with user-scalable="no" doesn't need FastClick (issue #89)
				if (metaViewport.content.indexOf('user-scalable=no') !== -1) {
					return true;
				}
				// Chrome 32 and above with width=device-width or less don't need FastClick
				if (chromeVersion > 31 && document.documentElement.scrollWidth <= window.outerWidth) {
					return true;
				}
			}

		// Chrome desktop doesn't need FastClick (issue #15)
		} else {
			return true;
		}
	}

	if (deviceIsBlackBerry10) {
		blackberryVersion = navigator.userAgent.match(/Version\/([0-9]*)\.([0-9]*)/);

		// BlackBerry 10.3+ does not require Fastclick library.
		// https://github.com/ftlabs/fastclick/issues/251
		if (blackberryVersion[1] >= 10 && blackberryVersion[2] >= 3) {
			metaViewport = document.querySelector('meta[name=viewport]');

			if (metaViewport) {
				// user-scalable=no eliminates click delay.
				if (metaViewport.content.indexOf('user-scalable=no') !== -1) {
					return true;
				}
				// width=device-width (or less than device-width) eliminates click delay.
				if (document.documentElement.scrollWidth <= window.outerWidth) {
					return true;
				}
			}
		}
	}

	// IE10 with -ms-touch-action: none, which disables double-tap-to-zoom (issue #97)
	if (layer.style.msTouchAction === 'none') {
		return true;
	}

	return false;
};


/**
 * Factory method for creating a FastClick object
 *
 * @param {Element} layer The layer to listen on
 * @param {Object} options The options to override the defaults
 */
FastClick.attach = function(layer, options) {
	'use strict';
	return new FastClick(layer, options);
};


if (typeof define == 'function' && typeof define.amd == 'object' && define.amd) {

	// AMD. Register as an anonymous module.
	define(function() {
		'use strict';
		return FastClick;
	});
} else if (typeof module !== 'undefined' && module.exports) {
	module.exports = FastClick.attach;
	module.exports.FastClick = FastClick;
} else {
	window.FastClick = FastClick;
}

angular.module("mobile-angular-ui.active-links", []).run([
  "$rootScope", function($rootScope) {
    return angular.forEach(["$locationChangeSuccess", "$includeContentLoaded"], function(evtName) {
      return $rootScope.$on(evtName, function() {
        var newPath;
        newPath = window.location.href;
        angular.forEach(document.links, function(domLink) {
          var link;
          link = angular.element(domLink);
          if (domLink.href === newPath) {
            link.addClass("active");
          } else {
            link.removeClass("active");
          }
          return link = null;
        });
        return newPath = null;
      });
    });
  }
]);
angular.module("mobile-angular-ui.directives.capture", [])

.run([
  "CaptureService", "$rootScope", function(CaptureService, $rootScope) {
    $rootScope.$on('$routeChangeStart', function() {
      CaptureService.resetAll();
    });
  }
])

.factory("CaptureService", [
  "$compile", function($compile) {
    var yielders = {};

    return {
      resetAll: function() {
        for (name in yielders) {
          this.resetYielder(name);
        }
      },
      
      resetYielder: function(name) {
        var b = yielders[name];
        this.setContentFor(name, b.defaultContent, b.defaultScope);
      },

      putYielder: function(name, element, defaultScope, defaultContent) {
        var yielder = {};
        yielder.name = name;
        yielder.element = element;
        yielder.defaultContent = defaultContent || "";
        yielder.defaultScope = defaultScope;
        yielders[name] = yielder;
      },

      getYielder: function(name) {
        return yielders[name];
      },

      removeYielder: function(name) {
        delete yielders[name];
      },
      
      setContentFor: function(name, content, scope) {
        var b = yielders[name];
        if (!b) {
          return;
        }
        b.element.html(content);
        $compile(b.element.contents())(scope);
      }

    };
  }
])

.directive("contentFor", [
  "CaptureService", function(CaptureService) {
    return {
      compile: function(tElem, tAttrs) {
        var rawContent = tElem.html();
        if(tAttrs.duplicate == null) {
          // no need to compile anything!
          tElem.html("");
        }
        return function postLink(scope, elem, attrs) {
          CaptureService.setContentFor(attrs.contentFor, rawContent, scope);
          if (attrs.duplicate == null) {
            elem.remove();
          }
        }
      }
    };
  }
])

.directive("yieldTo", [
  "$compile", "CaptureService", function($compile, CaptureService) {
    return {
      link: function(scope, element, attr) {
        CaptureService.putYielder(attr.yieldTo, element, scope, element.html());
        element.contents().remove();

        scope.$on('$destroy', function(){
          CaptureService.removeYielder(attr.yieldTo);
        });
      }
    };
  }
]);

angular.module('mobile-angular-ui.directives.carousel', [])

.run(["$rootScope", function($rootScope) {
    
    $rootScope.carouselPrev = function(id) {
      $rootScope.$emit("mobile-angular-ui.carousel.prev", id);
    };
    
    $rootScope.carouselNext = function(id) {
      $rootScope.$emit("mobile-angular-ui.carousel.next", id);
    };
    
    var carouselItems = function(id) {
      var elem = angular.element(document.getElementById(id));
      var res = angular.element(elem.children()[0]).children();
      elem = null;
      return res;
    };

    var findActiveItemIndex = function(items) {
      var idx = -1;
      var found = false;

      for (var _i = 0; _i < items.length; _i++) {
        var item = items[_i];
        idx += 1;
        if (angular.element(item).hasClass('active')) {
          found = true;
          break;
        }
      }

      if (found) {
        return idx;
      } else {
        return -1;
      }

    };

    $rootScope.$on("mobile-angular-ui.carousel.prev", function(e, id) {
      var items = carouselItems(id);
      var idx = findActiveItemIndex(items);
      var lastIdx = items.length - 1;

      if (idx !== -1) {
        angular.element(items[idx]).removeClass("active");
      }

      if (idx <= 0) {
        angular.element(items[lastIdx]).addClass("active");
      } else {
        angular.element(items[idx - 1]).addClass("active");
      }

      items = null;
      idx = null;
      lastIdx = null;
    });

    $rootScope.$on("mobile-angular-ui.carousel.next", function(e, id) {
      var items = carouselItems(id);
      var idx = findActiveItemIndex(items);
      var lastIdx = items.length - 1;
      
      if (idx !== -1) {
        angular.element(items[idx]).removeClass("active");
      }
      
      if (idx === lastIdx) {
        angular.element(items[0]).addClass("active");
      } else {
        angular.element(items[idx + 1]).addClass("active");
      }
      
      items = null;
      idx = null;
      lastIdx = null;
    });
  }
]);

angular.module("mobile-angular-ui.drag", [
  'ngTouch',
  'mobile-angular-ui.transform'
])

// 
// $drag
// 
// A provider to create touch & drag components.
// 
// $drag Service wraps ngTouch $swipe to extend its behavior moving one or more
// target element throug css transform according to the $swipe coords thus creating 
// a drag effect.
// 
// $drag interface is similar to $swipe:
// 
// app.controller('MyController', function($drag, $element){
//   $drag.bind($element, {
//    start: function(coords, cancel, markers, e){},
//    move: function(coords, cancel, markers, e){},
//    end: function(coords, cancel, markers, e){},
//    cancel: function(coords, markers, e){},
//    transform: function(x, y, transform) {},
//    adaptTransform: function(x, y, transform) {},
//    constraint: fn or {top: y1, left: x1, bottom: y2, right: x2}
//   });
// });
// 
// Main differences from $swipe are: 
//  - coords param take into account css transform so you can easily detect collision with other elements.
//  - start, move, end callback receive a cancel funcion that can be used to cancel the motion and reset
//    the transform.
//  - you can configure the transform behavior passing a transform function to options.
//  - you can constraint the motion through the constraint option (setting relative movement limits) 
//    or through the track option (setting absolute coords);
//  - you can setup collision markers being watched and passed to callbacks.
//  
// Example (drag to dismiss):
//  $drag.bind(e, {
//    move: function(c, cancel, markers){
//      if(c.left > markers.m1.left) {
//        e.addClass('willBeDeleted');
//      } else {
//        e.removeClass('willBeDeleted');
//      }
//    },
//    end: function(coords, cancel){
//      if(c.left > markers.m1.left) {
//        e.addClass('deleting');
//        delete($scope.myModel).then(function(){
//          e.remove();
//        }, function(){
//          cancel();
//        });
//      } else {
//        cancel();
//      }
//    },
//    cancel: function(){
//      e.removeClass('willBeDeleted');
//      e.removeClass('deleting');
//    },
//    constraint: { 
//        minX: 0, 
//        minY: 0, 
//        maxY: 0 
//     },
//   });

.provider('$drag', function() {
  this.$get = ['$swipe', '$document', 'Transform', function($swipe, $document, Transform) {
    return {
      bind: function(elem, options) {
        var defaults = {
          constraint: {}
        };

        options = angular.extend({}, defaults, options || {});

        var
          e = angular.element(elem)[0],
          zIndexBkp = e.style.zIndex,
          moving = false,
          deltaXTot = 0, // total movement since elem is bound
          deltaYTot = 0,
          x0, y0, // touch coords on start 
          t0, // transform on start
          tOrig = Transform.fromElement(e),
          x, y, // current touch coords
          t, // current transform
          minX = options.constraint.minX !== undefined ? options.constraint.minX : Number.NEGATIVE_INFINITY,
          maxX = options.constraint.maxX !== undefined ? options.constraint.maxX : Number.POSITIVE_INFINITY,
          minY = options.constraint.minY !== undefined ? options.constraint.minY : Number.NEGATIVE_INFINITY,
          maxY = options.constraint.maxY !== undefined ? options.constraint.maxY : Number.POSITIVE_INFINITY,
          scope = elem.scope(),
          
          cancelFn = function(){
            elem.triggerHandler('touchcancel');
          },

          resetFn = function(){
            elem.triggerHandler('touchcancel');
            deltaXTot = 0;
            deltaYTot = 0;
            tOrig.set(e);
          },

          callbacks = {
            start: function(c) {
              
              if (!moving) { // Sometimes $swipe calls start multiple times
                                // without before end or cancel thus we need
                                // to ensure this is a fresh start to
                                // reset everything.
                t0 = Transform.fromElement(e);
                x  = x0 = c.x;
                y  = y0 = c.y; 
                moving = true;
                e.style.zIndex = 99999;
                if (options.start) {
                  options.start(e.getBoundingClientRect(), cancelFn, resetFn);  
                }
              }
                          
            },

            move: function(c) {
              // total movement shoud match constraints
              var dx, dy,
              deltaX, deltaY, r;

              deltaX = Math.max(Math.min(maxX - deltaXTot, c.x - x0), minX - deltaXTot);
              deltaY = Math.max(Math.min(maxY - deltaYTot, c.y - y0), minY - deltaYTot);

              dx = deltaX - (x - x0);
              dy = deltaY - (y - y0);

              t = Transform.fromElement(e); 

              if (options.transform) {
                r = options.transform(t, dx, dy, c.x, c.y, x0, y0);
                t = r || t;
              } else {
                t.translate(dx, dy);
              }

              if (options.adaptTransform) {
                r = options.adaptTransform(t, dx, dy, c.x, c.y, x0, y0);
                t = r || t;
              }
              
              x = deltaX + x0;
              y = deltaY + y0;

              t.set(e);

              if (options.move) {
                options.move(e.getBoundingClientRect(), cancelFn, resetFn);  
              }

            },

            end: function(c) {
              moving = false; 

              var deltaXTotOld = deltaXTot;
              var deltaYTotOld = deltaYTot;

              var undoFn = function() {
                deltaXTot = deltaXTotOld;
                deltaYTot = deltaYTotOld;
                t0.set(e);
              };

              deltaXTot = deltaXTot + x - x0;
              deltaYTot = deltaYTot + y - y0;
              
              if (options.end) {
                options.end(e.getBoundingClientRect(), undoFn, resetFn);
              }
              e.style.zIndex = zIndexBkp;
            },

            cancel: function() {
              if (moving) {
                t0.set(e);  
                if (options.cancel) {
                  options.cancel(e.getBoundingClientRect(), resetFn);
                }
                moving = false;
                e.style.zIndex = zIndexBkp;
              }
            }
          };

        scope.$on('$destroy', function() { 
          $document.unbind('mouseout', cancelFn);
          callbacks = options = e = moving = deltaXTot = deltaYTot = x0 = y0 = t0 = tOrig = x = y = t = minX = maxX = minY = maxY = scope = null;
        });

        $swipe.bind(elem, callbacks);
        $document.on('mouseout', cancelFn);
      }
    };
  }];
});
// Provides touch events via fastclick.js
(function() {
  var module = angular.module('mobile-angular-ui.fastclick', []);

  module.run(function($window, $document) {
      $window.addEventListener("load", (function() {
         FastClick.attach($document[0].body);
      }), false);
  });

  angular.forEach(['select', 'input', 'textarea'], function(directiveName){
    module.directive(directiveName, function(){
      return {
        restrict: "E",
        compile: function(elem) {
          elem.addClass("needsclick");
        }
      };
    });
  });  
})();

angular.module('mobile-angular-ui.modals', [])

.directive('modalOverlay', [
  '$rootElement',
  function($rootElement) {
    return {
      restrict: 'C',
      link: function(scope, elem) {
        $rootElement.addClass('has-modal-overlay');
        scope.$on('$destroy', function(){
          $rootElement.removeClass('has-modal-overlay');
        });
      }
    };
}]);
angular.module('mobile-angular-ui.directives.navbars', [])

.directive('navbarAbsoluteTop', function() {
  return {
    replace: false,
    restrict: "C",
    link: function(scope, elem, attrs) {
      elem.parent().addClass('has-navbar-top');
    }
  };
})

.directive('navbarAbsoluteBottom', function() {
  return {
    replace: false,
    restrict: "C",
    link: function(scope, elem, attrs) {
      elem.parent().addClass('has-navbar-bottom');
    }
  };
});
angular.module('mobile-angular-ui.outerClick', [])

.factory('isAncestorOrSelf', function () {
  return function (element, target) {
    var parent = element;
    while (parent.length > 0) {
      if (parent[0] === target[0]) {
        parent = null;
        return true;
      }
      parent = parent.parent();
    }
    parent = null;
    return false;
  };
})

.factory('bindOuterClick', [
  '$document',
  '$timeout', 
  'isAncestorOrSelf',
  function ($document, $timeout, isAncestorOrSelf) {
    
    return function (scope, element, outerClickFn, outerClickIf) {
      var handleOuterClick = function(event){
        if (!isAncestorOrSelf(angular.element(event.target), element)) {
          scope.$apply(function() {
            outerClickFn(scope, {$event:event});
          });
        }
      };

      var stopWatching = angular.noop;
      var t = null;

      if (outerClickIf) {
        stopWatching = scope.$watch(outerClickIf, function(value){
          $timeout.cancel(t);

          if (value) {
            // prevents race conditions 
            // activating with other click events
            t = $timeout(function(scope) {
              $document.on('click tap', handleOuterClick);
            }, 0);

          } else {
            $document.unbind('click tap', handleOuterClick);    
          }
        });
      } else {
        $timeout.cancel(t);
        $document.on('click tap', handleOuterClick);
      }

      scope.$on('$destroy', function(){
        stopWatching();
        $document.unbind('click tap', handleOuterClick);
      });
    };
  }
])

.directive('outerClick', [
  'bindOuterClick', 
  '$parse',
  function(bindOuterClick, $parse){
    return {
      restrict: 'A',
      compile: function(elem, attrs) {
        var outerClickFn = $parse(attrs.outerClick);
        var outerClickIf = attrs.outerClickIf;
        return function(scope, elem) {
          bindOuterClick(scope, elem, outerClickFn, outerClickIf);
        };
      }
    };
  }
]);
angular.module('mobile-angular-ui.pointer-events', []).run([
  '$document', function($document) {
    return angular.element($document).on("click tap", function(e) {
      var target;
      target = angular.element(e.target);
      if (target.hasClass("disabled")) {
        e.preventDefault();
        e.stopPropagation();
        target = null;
        return false;
      } else {
        target = null;
        return true;
      }
    });
  }
]);

(function() {
  var module = angular.module('mobile-angular-ui.scrollable', []);

  module.directive('scrollableContent', function() {
    return {
      restrict: 'C',
      controller: ['$element', function($element) {
        var scrollableContent = $element[0],
            scrollable = $element.parent()[0];

        this.scrollableContent = scrollableContent;

        // scrollTo function.
        // 
        // Usage: 
        // obtain scrollableContent controller somehow. Then:
        // 
        // - Scroll to top of containedElement
        // scrollableContentController.scrollTo(containedElement);
        // 
        // - Scroll to top of containedElement with a margin of 10px;
        // scrollableContentController.scrollTo(containedElement, 10);
        // 
        // - Scroll top by 200px;
        // scrollableContentController.scrollTo(200);
        // 
        this.scrollTo = function(elementOrNumber, marginTop) {
          marginTop = marginTop || 0;

          if (angular.isNumber(elementOrNumber)) {
            scrollableContent.scrollTop = elementOrNumber - marginTop;
          } else {
            var target = angular.element(elementOrNumber)[0];
            if ((! target.offsetParent) || target.offsetParent == scrollable) {
              scrollableContent.scrollTop = target.offsetTop - marginTop;
            } else {
              // recursively subtract offsetTop from marginTop until it reaches scrollable element.
              this.scrollTo(target.offsetParent, marginTop - target.offsetTop);
            }
          }
        };
      }],
      link: function(scope, element, attr) {
        if (overthrow.support !== 'native') {
          element.addClass('overthrow');
          overthrow.forget();
          overthrow.set();
        }
      }
    };
  });

  angular.forEach(['input', 'textarea'], function(directiveName) {
    module.directive(directiveName, ['$rootScope','$timeout', function($rootScope, $timeout) {
      return {
        require: '?^^scrollableContent',
        link: function(scope, elem, attrs, scrollable) {
          // Workaround to avoid soft keyboard hiding inputs
          elem.on('focus', function(){
            var h1 = scrollable.scrollableContent.offsetHeight;
            $timeout(function() {
              var h2 = scrollable.scrollableContent.offsetHeight;
              // 
              // if scrollableContent height is reduced in half second
              // since an input got focus we assume soft keyboard is showing.
              //
              if (h1 > h2) {
                scrollable.scrollTo(elem, 10);  
              }
            }, 500);
          });
        }
      };
    }]);
  });

  angular.forEach({Top: 'scrollableHeader', Bottom: 'scrollableFooter'}, 
    function(directiveName, side) {
        module.directive(directiveName, [
          '$window',
          function($window) {
                  return {
                    restrict: 'C',
                    link: function(scope, element, attr) {
                      var el = element[0],
                          styles = $window.getComputedStyle(el),
                          margin = parseInt(styles.marginTop) + parseInt(styles.marginBottom),
                          heightWithMargin = el.offsetHeight + margin,
                          parentStyle = element.parent()[0].style;

                      parentStyle['padding' + side] = heightWithMargin + 'px'; 

                      scope.$on('$destroy', function(){
                        parentStyle['padding' + side] = '0px';
                      });
                    }
                  };
                }
        ]);
    });
})();
angular.module('mobile-angular-ui.sharedState', [])

.factory('SharedState', [
  '$rootScope',
  '$parse',
  function($rootScope, $parse){
    var values = {};    // values, context object for evals
    var statuses = {};  // status info
    var scopes = {};    // scopes references
    return {
      initialize: function(scope, id, defaultValue) {
        var isNewScope = scopes[scope] === undefined;

        scopes[scope.$id] = scopes[scope.$id] || [];
        scopes[scope.$id].push(id);

        if (!statuses[id]) {
          statuses[id] = {references: 1, defaultValue: defaultValue};
          $rootScope.$broadcast('mobile-angular-ui.state.initialized.' + id, defaultValue);
          if (defaultValue !== undefined) {
            $rootScope.$broadcast('mobile-angular-ui.state.changed.' + id, defaultValue);
          }
        } else if (isNewScope) { // is a new reference from 
                                 // a different scope
          statuses[id].references++; 
        }
        scope.$on('$destroy', function(){
          var ids = scopes[scope.$id] || [];
          for (var i = 0; i < ids.length; i++) {
            var status = statuses[ids[i]];
            status.references--;
            if (status.references <= 0) {
              delete statuses[ids[i]];
              delete values[ids[i]];
              $rootScope.$broadcast('mobile-angular-ui.state.destroyed.' + id, defaultValue);
            }
          }
          delete scopes[scope.$id];
        });
      },

      setOne: function(id, value) {
        if (statuses[id] !== undefined) {
          var prev = values[id];
          values[id] = value;
          if (prev != value) {
            $rootScope.$broadcast('mobile-angular-ui.state.changed.' + id, value, prev);
          }
          return value;
        } else {
          if (console) {
            console.warn('Warning: Attempt to set uninitialized shared state:', id);
          }
        }
      },

      setMany: function(map) {
        angular.forEach(map, function(value, id) {
          this.setOne(id, value);
        }, this);
      },

      set: function(idOrMap, value) {
        if (angular.isObject(idOrMap) && angular.isUndefined(value)) {
          this.setMany(idOrMap);
        } else {
          this.setOne(idOrMap, value);
        }
      },

      turnOn: function(id) {
        return this.setOne(id, true);     
      },

      turnOff: function(id) {
        return this.setOne(id, false);
      },

      toggle: function(id) {
        return this.setOne(id, !this.get(id));     
      },

      get: function(id) {
        return statuses[id] && values[id];
      },

      isActive: function(id) {
        return !! this.get(id);
      },

      active: function(id) {
        return this.isActive(id);
      },

      isUndefined: function(id) {
        return statuses[id] === undefined || this.get(id) === undefined;
      },

      equals: function(id, value) {
        return this.get(id) === value;
      },

      eq: function(id, value) {
        return this.equals(id, value);
      },

      values: function() {
        return values;
      }

    };
  }
]);
(function() {
  var module = angular.module(
    'mobile-angular-ui.sidebars', [
      'mobile-angular-ui.sharedState',
      'mobile-angular-ui.outerClick'
    ]
  );

  angular.forEach(['left', 'right'], function (side) {
    var directiveName = 'sidebar' + side.charAt(0).toUpperCase() + side.slice(1);
    module.directive(directiveName, [
      '$rootElement',
      'SharedState',
      'bindOuterClick',
      '$location',
      function (
        $rootElement,
        SharedState,
        bindOuterClick,
        $location
      ) {
        
        var outerClickCb = function (scope){
          SharedState.turnOff(directiveName);
        };

        var outerClickIf = function() {
          return SharedState.isActive(directiveName);
        };
        
        return {
          restrict: 'C',
          link: function (scope, elem, attrs) {
            var parentClass = 'has-sidebar-' + side;
            var activeClass = 'sidebar-' + side + '-in';

            $rootElement.addClass(parentClass);
            scope.$on('$destroy', function () {
              $rootElement
                .removeClass(parentClass);
              $rootElement
                .removeClass(activeClass);
            });

            var defaultActive = attrs.active !== undefined && attrs.active !== 'false';          
            SharedState.initialize(scope, directiveName, defaultActive);

            scope.$on('mobile-angular-ui.state.changed.' + directiveName, function (e, active) {
              if (attrs.trackAsSearchParam == '' || attrs.trackAsSearchParam) {
                $location.search(directiveName, active || null);
              }
              
              if (active) {
                $rootElement
                  .addClass(activeClass);
              } else {
                $rootElement
                  .removeClass(activeClass);
              }
            });

            scope.$on('$routeChangeSuccess', function() {
              SharedState.turnOff(directiveName);
            });

            scope.$on('$routeUpdate', function() {
              if (attrs.trackAsSearchParam) {
                if (($location.search())[directiveName]) {
                  SharedState.turnOn(directiveName);
                } else {
                  SharedState.turnOff(directiveName);
                }                
              }
            });

            if (attrs.closeOnOuterClicks !== 'false') {
              bindOuterClick(scope, elem, outerClickCb, outerClickIf);
            }
          }
        };
      }
    ]);
  });
})();
angular.module('mobile-angular-ui.switch', [])
.directive("switch", function() {
  return {
    restrict: "EA",
    replace: true,
    scope: {
      model: "=ngModel",
      changeExpr: "@ngChange",
      disabled: "@"
    },
    template: "<div class='switch' ng-class='{active: model}'><div class='switch-handle'></div></div>",
    link: function(scope, elem, attrs) {

      elem.on('click tap', function(){
        if (attrs.disabled == null) {
          scope.model = !scope.model;
          scope.$apply();

          if (scope.changeExpr != null) {
            scope.$parent.$eval(scope.changeExpr);
          };
        }
      });

      elem.addClass('switch-transition-enabled');
    }
  };
});
angular.module('mobile-angular-ui.transform', [])

.factory('Transform', [
  '$window',
  function($window){

    function matrixHeight(m) {
      return m.length;
    }

    function matrixWidth(m) {
      return m[0] ? m[0].length : 0;
    }

    function matrixMult(m1, m2) {
      var width1  = matrixWidth(m1), 
          width2  = matrixWidth(m2), 
          height1 = matrixHeight(m1), 
          height2 = matrixHeight(m2);

      if (width1 != height2) {
        throw new Error("error: incompatible sizes");
      }
    
      var result = [];
      for (var i = 0; i < height1; i++) {
          result[i] = [];
          for (var j = 0; j < width2; j++) {
              var sum = 0;
              for (var k = 0; k < width1; k++) {
                  sum += m1[i][k] * m2[k][j];
              }
              result[i][j] = sum;
          }
      }
      return result; 
    }

    //
    // Cross-Browser stuffs
    // 
    var vendorPrefix,
        cssPrefix,
        transformProperty,
        prefixes = ['', 'webkit', 'Moz', 'O', 'ms'],
        d = $window.document.createElement('div');
    
    for (var i = 0; i < prefixes.length; i++) {
      var prefix = prefixes[i];
      if ( (prefix + 'Perspective') in d.style ) {
        vendorPrefix = prefix;
        cssPrefix = (prefix === '' ? '' : '-' + prefix.toLowerCase() + '-');
        transformProperty = cssPrefix + 'transform';
        break;
      }
    }

    d = null;

    //
    // Represents a 2d transform, 
    // behind the scene is a transform matrix exposing methods to get/set
    // meaningfull primitives like rotation, translation and scale.
    // 
    // Allows to apply multiple transforms through #merge.
    //
    function Transform(matrix) {
      this.mtx = matrix || [
        [1,0,0],
        [0,1,0],
        [0,0,1]
      ];
    }

    Transform.fromElement = function(e) {
      var tr = $window
              .getComputedStyle(e, null)
              .getPropertyValue(transformProperty);

      if (!tr || tr === 'none') {
        return new Transform();
      }

      if (tr.match('matrix3d')) {
        throw new Error('Handling 3d transform is not supported yet');
      }

      var values = 
        tr.split('(')[1]
          .split(')')[0]
          .split(',')
          .map(Number);

      var mtx = [
        [values[0], values[2], values[4]],
        [values[1], values[3], values[5]],
        [        0,         0,        1 ],
      ];

      return new Transform(mtx);
    };

    Transform.prototype.apply = function(e, options) {
      var mtx = Transform.fromElement(e).merge(this).mtx;
      e.style[transformProperty] = 'matrix(' + [ mtx[0][0], mtx[1][0], mtx[0][1], mtx[1][1], mtx[0][2], mtx[1][2] ].join(',') + ')';
      return this;
    };

    Transform.prototype.set = function(e) {
      var mtx = this.mtx;
      e.style[transformProperty] = 'matrix(' + [ mtx[0][0], mtx[1][0], mtx[0][1], mtx[1][1], mtx[0][2], mtx[1][2] ].join(',') + ')';
      return this;
    };

    Transform.prototype.rotate = function(a) {
      a = a * (Math.PI / 180); // deg2rad
      var t = [
        [Math.cos(a), -Math.sin(a),  0],
        [Math.sin(a),  Math.cos(a),  0],
        [          0,            0,  1]
      ];

      this.mtx = matrixMult(t, this.mtx);
      return this;
    };

    Transform.prototype.translate = function(x, y) {
      y = (y === null || y === undefined) ? x : y;
      var t = [
        [1,0,x],
        [0,1,y],
        [0,0,1]
      ];
      this.mtx = matrixMult(t, this.mtx);
      return this;
    };

    Transform.prototype.scale = function(a) {
      var t = [
        [a,0,0],
        [0,a,0],
        [0,0,1]
      ];
      this.mtx = matrixMult(t, this.mtx);
      return this;
    };

    Transform.prototype.merge = function(t) {
      this.mtx = matrixMult(this.mtx, t.mtx);
      return this;
    };

    Transform.prototype.getRotation = function() {
      var mtx = this.mtx;
      return Math.round(Math.atan2(mtx[1][0], mtx[0][0]) * (180/Math.PI)); // rad2deg
    };

    Transform.prototype.getTranslation = function() {
      var mtx = this.mtx;
      return {
        x: mtx[0][2],
        y: mtx[1][2]
      };
    };

    Transform.prototype.getScale = function() {
      var mtx = this.mtx, a = mtx[0][0], b = mtx[1][0], d = 10;
      return Math.round( Math.sqrt( a*a + b*b ) * d ) / d;
    };

    Transform.prototype.matrixToString = function() {
      var mtx = this.mtx;
      var res = "";
      for (var i = 0; i < mtx.length; i++) {
        for (var j = 0; j < mtx[i].length; j++) {
          var n = '' + mtx[i][j];
          res += n;
          for (var k = 0; k < 5 - n.length; k++) {
            res += ' ';
          }
        }
        res += '\n';
      }
      return res;
    };

    return Transform;
  }
]);
var module = angular.module('mobile-angular-ui.ui', []);

module.factory('uiBindEvent', function(){
  return function(scope, element, eventNames, fn){
    eventNames = eventNames || 'click tap';
    element.on(eventNames, function(event){
      scope.$apply(function() {
        fn(scope, {$event:event});
      });
    });
  };
});


module.directive('uiState', [
  'SharedState', 
  '$parse',
  function(SharedState, $parse){
    return {
      restrict: 'EA',
      priority: 601, // more than ng-if
      link: function(scope, elem, attrs){
        var id               = attrs.uiState || attrs.id,
            defaultValueExpr = attrs.uiDefault || attrs['default'],
            defaultValue     = defaultValueExpr ? scope.$eval(defaultValueExpr) : undefined;

        SharedState.initialize(scope, id);

        if (defaultValue !== undefined) {
          scope.$evalAsync(function(){
            SharedState.set(id, defaultValue);
          });
        }
      }
    };
  }
]);

angular.forEach(['toggle', 'turnOn', 'turnOff', 'set'], 
  function(methodName){
    var directiveName = 'ui' + methodName[0].toUpperCase() + methodName.slice(1);
    
    module.directive(directiveName, [
      '$parse',
      'SharedState',
      'uiBindEvent',
      function($parse, SharedState, uiBindEvent) {
            var method = SharedState[methodName];
            return {
              restrict: 'A',
              compile: function(elem, attrs) {
                var fn = methodName === 'set' ?
                  $parse(attrs[directiveName]) :
                    function(scope) {
                      return attrs[directiveName]; 
                    };

                return function(scope, elem, attrs) {
                  var callback = function() {
                    var arg = fn(scope);
                    return method.call(SharedState, arg);
                  };
                  uiBindEvent(scope, elem, attrs.uiTriggers, callback);
                };
              }
            };
          }
    ]);
  });

// Same as ng-if but takes into account SharedState too
module.directive('uiIf', ['$animate', 'SharedState', '$parse', function($animate, SharedState, $parse) {
  function getBlockNodes(nodes) {
    var node = nodes[0];
    var endNode = nodes[nodes.length - 1];
    var blockNodes = [node];
    do {
      node = node.nextSibling;
      if (!node) break;
      blockNodes.push(node);
    } while (node !== endNode);

    return angular.element(blockNodes);
  }

  return {
    multiElement: true,
    transclude: 'element',
    priority: 600,
    terminal: true,
    restrict: 'A',
    $$tlb: true,
    link: function ($scope, $element, $attr, ctrl, $transclude) {
        var block, childScope, previousElements, 
        exprFn = $parse($attr.uiIf),
        uiIfFn = function() { // can be slow
          return exprFn(angular.extend({}, SharedState.values(), $scope));
        };

        $scope.$watch(uiIfFn, function uiIfWatchAction(value) {
          if (value) {
            if (!childScope) {
              $transclude(function (clone, newScope) {
                childScope = newScope;
                clone[clone.length++] = document.createComment(' end uiIf: ' + $attr.uiIf + ' ');
                // Note: We only need the first/last node of the cloned nodes.
                // However, we need to keep the reference to the jqlite wrapper as it might be changed later
                // by a directive with templateUrl when its template arrives.
                block = {
                  clone: clone
                };
                $animate.enter(clone, $element.parent(), $element);
              });
            }
          } else {
            if (previousElements) {
              previousElements.remove();
              previousElements = null;
            }
            if (childScope) {
              childScope.$destroy();
              childScope = null;
            }
            if (block) {
              previousElements = getBlockNodes(block.clone);
              var done = function() {
                previousElements = null;
              };
              var nga = $animate.leave(previousElements, done);
              if (nga) {
                nga.then(done);
              }
              block = null;
            }
          }
        });
    }
  };
}]);

// Same as ng-hide but takes into account SharedState too
module.directive('uiHide', ['$animate', 'SharedState', '$parse', function($animate, SharedState, $parse) {
  var NG_HIDE_CLASS = 'ng-hide';
  var NG_HIDE_IN_PROGRESS_CLASS = 'ng-hide-animate';

  return {
    restrict: 'A',
    multiElement: true,
    link: function(scope, element, attr) {
      var exprFn = $parse(attr.uiHide),
      uiHideFn = function() { // can be slow
        return exprFn(angular.extend({}, SharedState.values(), scope));
      };
      scope.$watch(uiHideFn, function uiHideWatchAction(value){
        $animate[value ? 'addClass' : 'removeClass'](element,NG_HIDE_CLASS, {
          tempClasses : NG_HIDE_IN_PROGRESS_CLASS
        });
      });
    }
  };
}]);

// Same as ng-show but takes into account SharedState too
module.directive('uiShow', ['$animate', 'SharedState', '$parse', function($animate, SharedState, $parse) {
  var NG_HIDE_CLASS = 'ng-hide';
  var NG_HIDE_IN_PROGRESS_CLASS = 'ng-hide-animate';

  return {
    restrict: 'A',
    multiElement: true,
    link: function(scope, element, attr) {
      var exprFn = $parse(attr.uiShow),
      uiShowFn = function() { // can be slow
        return exprFn(angular.extend({}, SharedState.values(), scope));
      };
      scope.$watch(uiShowFn, function uiShowWatchAction(value){
        $animate[value ? 'removeClass' : 'addClass'](element, NG_HIDE_CLASS, {
          tempClasses : NG_HIDE_IN_PROGRESS_CLASS
        });
      });
    }
  };
}]);

module.run([
  '$rootScope',
  'SharedState',
  function($rootScope, SharedState){
    $rootScope.ui = SharedState;
  }
]);
angular.module('mobile-angular-ui', [
  'mobile-angular-ui.pointer-events',
  'mobile-angular-ui.active-links',
  'mobile-angular-ui.fastclick',

  // New modules
  'mobile-angular-ui.sharedState',
  'mobile-angular-ui.ui',
  'mobile-angular-ui.outerClick',
  'mobile-angular-ui.modals',
  'mobile-angular-ui.switch',
  'mobile-angular-ui.sidebars',

  // Old modules
  'mobile-angular-ui.scrollable',
  'mobile-angular-ui.directives.capture',
  'mobile-angular-ui.directives.navbars',
]);