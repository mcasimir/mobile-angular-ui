/**
 * @module mobile-angular-ui.core.capture
 * @description
 *
 * The `capture` module exposes directives to var you extract markup which can
 * be used in other parts of a template using `uiContentFor` and `uiYieldTo`
 * directives.
 *
 * It provides a way to move or clone a block of markup to other parts of the document.
 *
 * This method is particularly useful to setup parts of the layout within an
 * angular view. Since blocks of html are transplanted within their original
 * `$scope` is easy to create layout interactions depending on the context.
 * Some tipical task you can accomplish with these directives are: _setup
 * the navbar title depending on the view_ or _place a submit button for a
 * form inside a navbar_.
 *
 * ## Usage
 *
 * Declare it as a dependency to your app unless you have already included some
 * of its super-modules.
 *
 * ```
 * angular.module('myApp', ['mobile-angular-ui']);
 * ```
 *
 * Or
 *
 * ```
 * angular.module('myApp', ['mobile-angular-ui']);
 * ```
 *
 * Or
 *
 * ```
 * angular.module('myApp', ['mobile-angular-ui.core.capture']);
 * ```
 *
 * Use `ui-yield-to` as a placeholder.
 *
 * ``` html
 * <!-- index.html -->
 *
 * <div class="navbar">
 *   <div ui-yield-to="title" class="navbar-brand">
 *     <span>Default Title</span>
 *   </div>
 * </div>
 *
 * <div class="app-body">
 *   <ng-view class="app-content"></ng-view>
 * </div>
 * ```
 *
 * Use `ui-content-for` inside any view to populate the `ui-yield-to` content.
 *
 * ``` html
 * <!-- myView.html -->
 *
 * <div ui-content-for="title">
 *   <span>My View Title</span>
 * </div>
 * ```
 *
 * Since the original scope is preserved you can use directives inside
 * `ui-content-for` blocks to interact with the current scope. In the following
 * example we will add a navbar button to submit a form inside a nested view.
 *
 * ``` html
 * <!-- index.html -->
 *
 * <div class="navbar">
 *   <div ui-yield-to="navbarAction">
 *   </div>
 * </div>
 *
 * <div class="app-body">
 *   <ng-view class="app-content"></ng-view>
 * </div>
 * ```
 *
 * ``` html
 * <!-- newCustomer.html -->
 *
 * <form ng-controller="newCustomerController">
 *
 *   <div class="inputs">
 *     <input type="text" ng-model="customer.name" />
 *   </div>
 *
 *   <div ui-content-for="navbarAction">
 *     <button ng-click="createCustomer()">
 *       Save
 *     </button>
 *   </div>
 *
 * </form>
 * ```
 *
 * ``` javascript
 * app.controller('newCustomerController', function($scope, Store){
 *   $scope.customer = {};
 *   $scope.createCustomer = function(){
 *     Store.create($scope.customer);
 *     // ...
 *   }
 * });
 * ```
 *
 * If you wish you can also duplicate markup instead of move it. Just add `duplicate` parameter to `uiContentFor` directive to specify this behaviour.
 *
 * ``` html
 * <div ui-content-for="navbarAction" duplicate>
 *   <button ng-click="createCustomer()">
 *     Save
 *   </button>
 * </div>
 * ```
 */
(function() {
  'use strict';

  angular.module('mobile-angular-ui.core.capture', [])

    .run([
      'Capture',
      '$rootScope',
      function(Capture, $rootScope) {
        $rootScope.$on('$routeChangeSuccess', function() {
          Capture.resetAll();
        });
      }
    ])

    .factory('Capture', [
      '$compile',
      function($compile) {
        var yielders = {};

        return {
          yielders: yielders,

          resetAll: function() {
            for (var name in yielders) {
              if (yielders.hasOwnProperty(name)) {
                this.resetYielder(name);
              }
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
            yielder.defaultContent = defaultContent || '';
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

  /**
   * @directive uiContentFor
   * @restrict A
   * @description
   *
   * `ui-content-for` makes inner contents to replace the corresponding
   * `ui-yield-to` placeholder contents.
   *
   * `uiContentFor` is intended to be used inside a view in order to populate outer placeholders.
   * Any content you send to placeholders via `ui-content-for` is
   * reverted to placeholder defaults after view changes (ie. on `$routeChangeStart`).
   *
   * @param {string} uiContentFor The id of the placeholder to be replaced
   * @param {boolean} uiDuplicate If present duplicates the content instead of moving it (default to `false`)
   *
   */
    .directive('uiContentFor', [
      'Capture',
      function(Capture) {
        return {
          compile: function(tElem, tAttrs) {
            var rawContent = tElem.html();
            if (tAttrs.uiDuplicate === null || tAttrs.uiDuplicate === undefined) {
             // no need to compile anything!
              tElem.html('');
              tElem.remove();
            }
            return function(scope, elem, attrs) {
              Capture.setContentFor(attrs.uiContentFor, rawContent, scope);
            };
          }
        };
      }
    ])

   /**
    * @directive uiYieldTo
    * @restrict A
    * @description
    *
    * `ui-yield-to` defines a placeholder which contents will be further replaced by `ui-content-for` directive.
    *
    * Inner html is considered to be a default. Default is restored any time `$routeChangeStart` happens.
    *
    * @param {string} uiYieldTo The unique id of this placeholder.
    *
    */
    .directive('uiYieldTo', [
      '$compile', 'Capture', function($compile, Capture) {
        return {
          link: function(scope, element, attr) {
            Capture.putYielder(attr.uiYieldTo, element, scope, element.html());

            element.on('$destroy', function() {
              Capture.removeYielder(attr.uiYieldTo);
            });

            scope.$on('$destroy', function() {
              Capture.removeYielder(attr.uiYieldTo);
            });
          }
        };
      }
    ]);

})();
