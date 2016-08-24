/**
 * @module mobile-angular-ui
 * @position 0
 * @description
 *
 * This is the main angular module of `mobile-angular-ui` framework.
 *
 * By requiring this module you will have all `mobile-angular-ui.core`
 * and `mobile-angular-ui.components` features required as well.
 *
 * ## Usage
 *
 * Declare it as a dependency for your application:
 *
 * ``` js
 * angular.module('myApp', ['mobile-angular-ui']);
 * ```
 */
(function() {
  'use strict';

  angular.module('mobile-angular-ui', [
    'mobile-angular-ui.core',
    'mobile-angular-ui.components'
  ]);

})();
