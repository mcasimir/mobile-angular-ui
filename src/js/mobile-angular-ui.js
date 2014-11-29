(function() {
  'use strict';

  angular.module('mobile-angular-ui', [
    'mobile-angular-ui.pointerEvents',     /* prevents actions on disabled elements */
    'mobile-angular-ui.activeLinks',       /* adds .active class to current links */
    'mobile-angular-ui.fastclick',         /* polyfills overflow: auto */
    'mobile-angular-ui.sharedState',       /* SharedState service */
    'mobile-angular-ui.ui',                /* ui-* directives */
    'mobile-angular-ui.outerClick',        /* outerClick directives */
    'mobile-angular-ui.modals',            /* modals and overlays */
    'mobile-angular-ui.switch',            /* switch form input */
    'mobile-angular-ui.sidebars',          /* sidebars */
    'mobile-angular-ui.scrollable',        /* uiScrollable directives */
    'mobile-angular-ui.capture',           /* uiYieldTo and uiContentFor directives */
    'mobile-angular-ui.navbars'            /* navbars */
  ]);

}());