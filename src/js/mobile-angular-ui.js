/**

@module mobile-angular-ui

@description

This is the main angular module of `mobile-angular-ui` framework.

By requiring this module you will have all 'mobile-angular-ui.core'
and `mobile-angular-ui.components` features required as well. 

*/
(function() {
  'use strict';

  angular.module('mobile-angular-ui', [
    'mobile-angular-ui.core',
    'mobile-angular-ui.components'
  ]);

}());