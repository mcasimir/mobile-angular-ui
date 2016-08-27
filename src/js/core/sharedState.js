(function() {
  'use strict';
  /**
   * @module mobile-angular-ui.core.sharedState
   *
   * @description
   * `mobile-angular-ui.core.sharedState` is expose the homonymous service
   * `SharedState` and a group of directives to access it.
   *
   * `SharedState` allows to use elementary angular or angularish directives
   * to create interactive components.
   *
   * Ie.
   *
   * ``` html
   * <div class="nav nav-tabs" ui-shared-state='activeTab'>
   *   <a ui-set="{activeTab: 1}">Tab1</a>
   *   <a ui-set="{activeTab: 2}">Tab2</a>
   *   <a ui-set="{activeTab: 3}">Tab3</a>
   * </div>
   * <div class="tabs">
   *   <div ui-if="activeTab == 1">Tab1</div>
   *   <div ui-if="activeTab == 2">Tab2</div>
   *   <div ui-if="activeTab == 3">Tab3</div>
   * </div>
   * ```
   *
   * Using `SharedState` you will be able to:
   *
   * - Create interactive components without having to write javascript code
   * - Have your controller free from UI logic
   * - Separe `ng-click` triggering application logic from those having a visual effect only
   * - Export state of components to urls
   * - Easily make components comunicate each other
   *
   * Also note that:
   *
   * Data structures retaining statuses will stay outside angular scopes
   * thus they are not evaluated against digest cycle until its necessary.
   * Also although statuses are sort of global variables `SharedState` will
   * take care of disposing them when no scopes are requiring them anymore.
   *
   * A set of `ui-*` directives are available to interact with `SharedState`
   * module and will hopefully var you spare your controllers and your time
   * for something that is more meaningful than this:
   *
   * ``` js
   * $scope.activeTab = 1;
   *
   * $scope.setActiveTab = function(n) {
   *   $scope.activeTab = n;
   * };
   * ```
   *
   * ## Usage
   *
   * Declare it as a dependency to your app unless you have already included some
   * of its super-modules.
   *
   * ```
   * angular.module('myApp', ['mobile-angular-ui.core.sharedState']);
   * ```
   *
   * Use `ui-shared-state` directive to require/initialize a state from the target element scope
   *
   * **Example.** Tabs
   *
   * <iframe class='embedded-example' src='/examples/tabs.html'></iframe>
   *
   * **Example.** Custom components
   *
   * <iframe class='embedded-example'  src='/examples/lightbulb.html'></iframe>
   *
   * NOTE: `ui-toggle/set/turnOn/turnOff` responds to `click/tap` without
   * stopping propagation so you can use them along with ng-click too.
   * You can also change events to respond to with `ui-triggers` attribute.
   *
   * Any `SharedState` method is exposed through `Ui` object in `$rootScope`.
   * So you could always do `ng-click="Ui.turnOn('myVar')"`.
   *
   * Since `SharedState` is a service you can initialize/set statuses through
   * controllers too:
   *
   * ``` js
   * app.controller('myController', function($scope, SharedState){
   *   SharedState.initialize($scope, "activeTab", 3);
   * });
   * ```
   *
   * As well as you can use `ui-default` for that:
   *
   * ``` html
   * <div class="tabs" ui-shared-state="activeTab" ui-default="thisIsAnExpression(5 + 1 - 2)"></div>
   * ```
   *
   */
  var module = angular.module('mobile-angular-ui.core.sharedState', []);

  /**
   * @ngdoc service
   * @class SharedState
   *
   * @description
   *
   * A `SharedState` state can be considered as a global variable identified by an `id`.
   *
   * `SharedState` service exposes methods to interact with statuses to create,
   * read and update states.
   *
   * It acts as a BUS between UI elements to share UI related state that is
   * automatically disposed when all scopes requiring it are destroyed.
   *
   * eg.
   *
   * ``` js
   * app.controller('controller1', function($scope, SharedState){
   *   SharedState.initialize($scope, 'myId');
   * });
   *
   * app.controller('controller2', function(SharedState){
   *   SharedState.toggle('myId');
   * });
   * ```
   *
   * Data structures retaining statuses will stay outside angular scopes thus
   * they are not evaluated against digest cycle until its necessary. Also
   * although statuses are sort of global variables `SharedState` will take
   * care of disposing them when no scopes are requiring them anymore.
   *
   * A set of `ui-*` directives are available to interact with `SharedState`
   * module and will hopefully var you spare your controllers and your time for
   * something that is more meaningful than this:
   *
   * ``` js
   * $scope.activeTab = 1;
   *
   * $scope.setActiveTab = function(n) {
   *   $scope.activeTab = n;
   * };
   * ```
   *
   */

  /**
  * @event 'mobile-angular-ui.state.initialized.ID'
  * @shortname initialized
  * @memberOf mobile-angular-ui.core.sharedState~SharedState
  *
  * @description
  * Broadcasted on `$rootScope` when `#initialize` is called for a new state not
  * referenced by any scope currently.
  *
  * @param {any} currentValue The value with which this state has been initialized
  *
  * @memberOf mobile-angular-ui.core.sharedState~SharedState
  */

  /**
  * @event 'mobile-angular-ui.state.destroyed.ID'
  * @shortname destroyed
  * @memberOf mobile-angular-ui.core.sharedState~SharedState
  *
  * @description
  * Broadcasted on `$rootScope` when a state is destroyed.
  *
  */

  /**
 * @event 'mobile-angular-ui.state.changed.ID'
 * @shortname changed
 * @memberOf mobile-angular-ui.core.sharedState~SharedState
 *
 * @description
 * Broadcasted on `$rootScope` the value of a state changes.
 *
 * ``` js
 * $scope.$on('mobile-angular-ui.state.changed.uiSidebarLeft', function(e, newVal, oldVal) {
 *   if (newVal === true) {
 *     console.log('sidebar opened');
 *   } else {
 *     console.log('sidebar closed');
 *   }
 * });
 * ```
 *
 * @param {any} newValue
 * @param {any} oldValue
 *
 */

  module.factory('SharedState', [
    '$rootScope', '$log',
    function($rootScope, $log) {
      var values = {};    // values, context object for evals
      var statusesMeta = {};  // status info
      var scopes = {};    // scopes references
      var exclusionGroups = {}; // support exclusive boolean sets

      return {
        /**
         * @function initialize
         * @memberOf mobile-angular-ui.core.sharedState~SharedState
         * @description
         *
         * Initialize, or require if already intialized, a state identified by `id` within the provided `scope`, making it available to the rest of application.
         *
         * A `SharedState` is bound to one or more scopes. Each time
         * `initialize` is called for an angular `scope` this will be bound to
         * the `SharedState` and a reference count is incremented to allow
         * garbage collection.
         *
         * Reference count is decremented once the scope is destroyed. When the counter reach 0 the state will be disposed.
         *
         * @param  {scope} scope The scope to bound this state
         * @param  {string} id The unique name of this state
         * @param  {object} [options] Options
         * @param  {object} [options.defaultValue] the initialization value, it is taken into account only if the state `id` is not already initialized
         * @param  {string} [options.exclusionGroup] Specifies an exclusion group
         * for the state. This means that for boolean operations (ie. toggle,
         * turnOn, turnOf) when this state is set to `true`, any other state
         * that is in the same `exclusionGroup` will be set to `false`.
         */
        initialize: function(scope, id, options) {
          options = options || {};

          var isNewScope = scopes[scope] === undefined;
          var defaultValue = options.defaultValue;
          var exclusionGroup = options.exclusionGroup;

          scopes[scope.$id] = scopes[scope.$id] || [];
          scopes[scope.$id].push(id);

          if (!statusesMeta[id]) { // is a brand new state
            // not referenced by any
            // scope currently

            statusesMeta[id] = angular.extend({}, options, {references: 1});

            $rootScope.$broadcast('mobile-angular-ui.state.initialized.' + id, defaultValue);

            if (defaultValue !== undefined) {
              this.setOne(id, defaultValue);
            }

            if (exclusionGroup) {
              // Exclusion groups are sets of statuses references
              exclusionGroups[exclusionGroup] = exclusionGroups[exclusionGroup] || {};
              exclusionGroups[exclusionGroup][id] = true;
            }

          } else if (isNewScope) { // is a new reference from
            // a different scope
            statusesMeta[id].references++;
          }
          scope.$on('$destroy', function() {
            var ids = scopes[scope.$id] || [];
            for (var i = 0; i < ids.length; i++) {
              var status = statusesMeta[ids[i]];

              if (status.exclusionGroup) {
                delete exclusionGroups[status.exclusionGroup][ids[i]];
                if (Object.keys(exclusionGroups[status.exclusionGroup]).length === 0) {
                  delete exclusionGroups[status.exclusionGroup];
                }
              }

              status.references--;
              if (status.references <= 0) {
                delete statusesMeta[ids[i]];
                delete values[ids[i]];
                $rootScope.$broadcast('mobile-angular-ui.state.destroyed.' + id);
              }
            }
            delete scopes[scope.$id];
          });
        },

        /**
         * @function setOne
         * @memberOf mobile-angular-ui.core.sharedState~SharedState
         * @description
         *
         * Set the value of the state identified by `id` to the `value` parameter.
         *
         * @param  {string} id Unique identifier for state
         * @param  {any} value New value for this state
         */
        setOne: function(id, value) {
          if (statusesMeta[id] !== undefined) {
            var prev = values[id];
            values[id] = value;
            if (prev !== value) {
              $rootScope.$broadcast('mobile-angular-ui.state.changed.' + id, value, prev);
            }
            return value;
          }
          $log.warn('Warning: Attempt to set uninitialized shared state: ' + id);
        },

        /**
         * @memberOf mobile-angular-ui.core.sharedState~SharedState
         *
         * @function setMany
         * @description
         *
         * Set multiple statuses at once. ie.
         *
         * ```
         * SharedState.setMany({ activeTab: 'firstTab', sidebarIn: false });
         * ```
         *
         * @param {object} object An object of the form `{state1: value1, ..., stateN: valueN}`
         */
        setMany: function(map) {
          angular.forEach(map, function(value, id) {
            this.setOne(id, value);
          }, this);
        },

        /**
         * @function set
         * @memberOf mobile-angular-ui.core.sharedState~SharedState
         * @description
         *
         * A shorthand for both `setOne` and `setMany`.
         * When called with only one parameter that is an object
         * it is the same of `setMany`, otherwise is the
         * same of `setOne`.
         *
         * @param {string|object} idOrMap A state id or a `{state: value}` map object.
         * @param {any} [value] The value to assign in case idOrMap is a string.
         */
        set: function(idOrMap, value) {
          if (!idOrMap) {
            return;
          } else if (angular.isObject(idOrMap)) {
            this.setMany(idOrMap);
          } else {
            this.setOne(idOrMap, value);
          }
        },

        /**
         * @function turnOn
         * @memberOf mobile-angular-ui.core.sharedState~SharedState
         * @description
         *
         * Set shared state identified by `id` to `true`. If the
         * shared state has been initialized with `exclusionGroup`
         * option it will also turn off (set to `false`) all other
         * statuses from the same exclusion group.
         *
         * @param  {string} id The unique name of this state
         */
        turnOn: function(id) {
          // Turns off other statuses belonging to the same exclusion group.
          var eg = statusesMeta[id] && statusesMeta[id].exclusionGroup;
          if (eg) {
            var egStatuses = Object.keys(exclusionGroups[eg]);
            for (var i = 0; i < egStatuses.length; i++) {
              var item = egStatuses[i];
              if (item !== id) {
                this.turnOff(item);
              }
            }
          }
          return this.setOne(id, true);
        },

        /**
         * @function turnOff
         * @memberOf mobile-angular-ui.core.sharedState~SharedState
         *
         * @description
         * Set shared state identified by `id` to `false`.
         *
         * @param  {string} id The unique name of this state
         */
        turnOff: function(id) {
          return this.setOne(id, false);
        },

        /**
         * @function toggle
         * @memberOf mobile-angular-ui.core.sharedState~SharedState
         * @description
         *
         * If current value for shared state identified by `id` evaluates
         * to `true` it calls `turnOff` on it otherwise calls `turnOn`.
         * Be aware that it will take into account `exclusionGroup` option.
         * See `#turnOn` and `#initialize` for more.
         *
         * @param  {string} id The unique name of this state
         */
        toggle: function(id) {
          return this.get(id) ? this.turnOff(id) : this.turnOn(id);
        },

        /**
         * @function get
         * @memberOf mobile-angular-ui.core.sharedState~SharedState
         *
         * @description
         * Returns the current value of the state identified by `id`.
         *
         * @param  {string} id The unique name of this state
         * @returns {any}
         */
        get: function(id) {
          return statusesMeta[id] && values[id];
        },

        /**
         * @function isActive
         * @memberOf mobile-angular-ui.core.sharedState~SharedState
         * @description
         *
         * Return `true` if the boolean conversion of `#get(id)` evaluates to `true`.
         *
         * @param  {string} id The unique name of this state
         * @returns {bool}
         */
        isActive: function(id) {
          return Boolean(this.get(id));
        },

        /**
         * @function active
         * @alias mobile-angular-ui.core.sharedState~SharedState.isActive
         * @memberOf mobile-angular-ui.core.sharedState~SharedState
         * @description
         *
         * Alias for `#isActive`.
         *
         * @param  {string} id The unique name of this state
         * @returns {bool}
         */
        active: function(id) {
          return this.isActive(id);
        },

        /**
         * @function isUndefined
         * @memberOf mobile-angular-ui.core.sharedState~SharedState
         * @description
         *
         * Return `true` if state identified by `id` is not defined.
         *
         * @param  {string} id The unique name of this state
         * @returns {bool}
         */
        isUndefined: function(id) {
          return statusesMeta[id] === undefined || this.get(id) === undefined;
        },

        /**
         * Returns `true` if state identified by `id` exsists.
         *
         * @param  {string} id The unique name of this state
         * @returns {bool}
         *
         * @function has
         * @memberOf mobile-angular-ui.core.sharedState~SharedState
         */
        has: function(id) {
          return statusesMeta[id] !== undefined;
        },

        /**
         * Returns the number of references of a status.
         *
         * @param  {string} id The unique name of this state
         * @returns {integer}
         *
         * @function referenceCount
         * @memberOf mobile-angular-ui.core.sharedState~SharedState
         */
        referenceCount: function(id) {
          var status = statusesMeta[id];
          return status === undefined ? 0 : status.references;
        },

        /**
         * Returns `true` if `#get(id)` is exactly equal (`===`) to `value` param.
         *
         * @param  {string} id The unique name of this state
         * @param  {any} value The value for comparison
         * @returns {bool}
         *
         * @function equals
         * @memberOf mobile-angular-ui.core.sharedState~SharedState
         */
        equals: function(id, value) {
          return this.get(id) === value;
        },

        /**
         * Alias for `#equals`
         *
         * @param  {string} id The unique name of this state
         * @param  {any} value The value for comparison
         * @returns {bool}
         *
         * @function eq
         * @memberOf mobile-angular-ui.core.sharedState~SharedState
         * @alias mobile-angular-ui.core.sharedState~SharedState.equals
         */
        eq: function(id, value) {
          return this.equals(id, value);
        },

        /**
         * Returns an object with all the status values currently stored.
         * It has the form of `{statusId: statusValue}`.
         *
         * Bear in mind that in order to spare resources it currently
         * returns just the internal object retaining statuses values.
         * Thus it is not intended to be modified and direct changes to it will be not tracked or notified.
         *
         * Just clone before apply any change to it.
         *
         * @returns {object}
         *
         * @function values
         * @memberOf mobile-angular-ui.core.sharedState~SharedState
         */
        values: function() {
          return values;
        },

        exclusionGroups: function() {
          return exclusionGroups;
        }
      };
    }
  ]);

  var uiBindEvent = function(scope, element, eventNames, fn) {
    eventNames = eventNames || 'click tap';
    element.on(eventNames, function(event) {
      scope.$apply(function() {
        fn(scope, {$event: event});
      });
    });
  };

  /**
   * Calls `SharedState#initialize` on the scope relative to the element using it.
   *
   * @param {string} uiState The shared state id
   * @param {expression} [uiDefault] the default value
   *
   * @directive uiSharedState
   */
  module.directive('uiSharedState', [
    'SharedState', function(SharedState) {
      return {
        restrict: 'EA',
        priority: 601, // more than ng-if
        link: function(scope, elem, attrs) {
          var id = attrs.uiSharedState || attrs.id;
          var defaultValueExpr = attrs.uiDefault || attrs.default;
          var defaultValue = defaultValueExpr ? scope.$eval(defaultValueExpr) : undefined;

          SharedState.initialize(scope, id, {
            defaultValue: defaultValue,
            exclusionGroup: attrs.uiExclusionGroup
          });
        }
      };
    }
  ]);

  /**
   * Alias for uiSharedState. **Deprecated** since it clashes with
   * [UI-Router](https://ui-router.github.io/) `uiState` directive.
   *
   * @deprecated
   * @param {string} uiState The shared state id
   * @param {expression} [uiDefault] the default value
   *
   * @directive uiState
   */
  module.directive('uiState', [
    'SharedState', function(SharedState) {
      return {
        restrict: 'EA',
        priority: 601, // more than ng-if
        link: function(scope, elem, attrs) {
          var id = attrs.uiState || attrs.id;
          var defaultValueExpr = attrs.uiDefault || attrs.default;
          var defaultValue = defaultValueExpr ? scope.$eval(defaultValueExpr) : undefined;

          SharedState.initialize(scope, id, {
            defaultValue: defaultValue,
            exclusionGroup: attrs.uiExclusionGroup
          });
        }
      };
    }
  ]);

  angular.forEach(['toggle', 'turnOn', 'turnOff', 'set'],
    function(methodName) {
      var directiveName = 'ui' + methodName[0].toUpperCase() + methodName.slice(1);

      /**
       * Calls `SharedState#toggle` when triggering events happens on the element using it.
       *
       * @param {string} uiToggle the target shared state
       * @param {expression} uiDefault the default value
       *
       * @directive uiToggle
       */

      /**
       * @function uiTurnOn
       *
       * @description
       * Calls `SharedState#turnOn` when triggering events happens on the element using it.
       *
       *
       * @ngdoc directive
       *
       * @param {string} uiTurnOn the target shared state
       * @param {expression} uiDefault the default value
       */

      /**
       * @function uiTurnOff
       *
       * @description
       * Calls `SharedState#turnOff` when triggering events happens on the element using it.
       *
       * @ngdoc directive
       *
       * @param {string} uiTurnOff the target shared state
       * @param {string} [uiTriggers='click tap'] the event triggering the call.
       */

      /**
       * @function uiSet
       *
       * @description
       * Calls `SharedState#set` when triggering events happens on the element using it.
       *
       * @ngdoc directive
       *
       * @param {object} uiSet The object to pass to SharedState#set
       * @param {string} [uiTriggers='click tap'] the event triggering the call.
       */

      module.directive(directiveName, [
        '$parse',
        '$interpolate',
        'SharedState',
        function($parse, $interpolate, SharedState) {
          var method = SharedState[methodName];
          return {
            restrict: 'A',
            priority: 1, // This would make postLink calls happen after ngClick
                // (and similar) ones, thus intercepting events after them.
                //
                // This will prevent eventual ng-if to detach elements
                // before ng-click fires.

            compile: function(elem, attrs) {
              var attr = attrs[directiveName];
              var needsInterpolation = attr.match(/\{\{/);

              var exprFn = function($scope) {
                var res = attr;
                if (needsInterpolation) {
                  var interpolateFn = $interpolate(res);
                  res = interpolateFn($scope);
                }
                if (methodName === 'set') {
                  res = ($parse(res))($scope);
                }
                return res;
              };

              return function(scope, elem, attrs) {
                var callback = function() {
                  var arg = exprFn(scope);
                  return method.call(SharedState, arg);
                };
                uiBindEvent(scope, elem, attrs.uiTriggers, callback);
              };
            }
          };
        }
      ]);
    });

  /**
   * @name uiScopeContext
   * @inner
   * @description
   *
   * `uiScopeContext` is not a directive, but a parameter common to any of the
   * `ui-*` directives in this module.
   *
   * By default all `ui-*` conditions in this module evaluates in the context of
   * `SharedState` only, thus scope variable are not accessible. To use them you have
   * two options:
   *
   * #### 1. pre-interpolation
   *
   * You can use pre-interpolation in expression attribute. For instance the following syntax
   * is ligit:
   *
   * ``` html
   * <div ui-if='state{{idx}}'><!-- ... --></div>
   * ```
   *
   * In this case `idx` value is taken from scope and embedded into
   * conditions before parse them.
   *
   * This works as expected and is fine for the most cases, but it has a little caveat:
   *
   * The condition has to be re-parsed at each digest loop and has to walk scopes
   * in watchers.
   *
   * #### 2. uiScopeContext
   *
   * If you are concerned about performance issues using the first approach
   * `uiScopeContext` is a more verbose but also lightweight alternative
   * to accomplish the same.
   *
   * It allows to use current scope vars inside `ui-*` conditions, leaving
   * other scope vars (or the entire scope if not present) apart from the
   * condition evaluation process.
   *
   * Hopefully this will keep evaluation running against a flat and small data
   * structure instead of taking into account the whole scope.
   *
   * It is a list `scopeVar[ as aliasName] [, ...]` specifing one of more scope
   * variables to take into account when evaluating conditions. ie:
   *
   * ``` html
   * <!-- use item from ng-repeat -->
   * <div ui-if="openPanel == i" ui-scope-context='i' ng-repeat="i in [1,2,3]">
   *   <div class="panel-body">
   *     <!-- ... -->
   *   </div>
   * </div>
   * ```
   *
   * ``` html
   * <div ui-if="sharedState1 == myVar1 && sharedState2 == myVar2"
   *   ui-scope-context="myVar1, myVar2"
   * >
   * </div>
   * ```
   *
   * Be aware that scope vars will take precedence over sharedStates so,
   * in order to avoid name clashes you can use 'as' to refer to scope vars
   * with a different name in conditions:
   *
   * ``` html
   * <div ui-if="x == myVar1 && y == myVar2"
   *   ui-scope-context="x as myVar1, y as myVar2"
   * >
   * </div>
   * ```
   */
  var parseScopeContext = function(attr) {
    if (!attr || attr === '') {
      return [];
    }
    var vars = attr ? attr.trim().split(/ *, */) : [];
    var res = [];
    for (var i = 0; i < vars.length; i++) {
      var item = vars[i].split(/ *as */);
      if (item.length > 2 || item.length < 1) {
        throw new Error('Error parsing uiScopeContext="' + attr + '"');
      }
      res.push(item);
    }
    return res;
  };

  var mixScopeContext = function(context, scopeVars, scope) {
    for (var i = 0; i < scopeVars.length; i++) {
      var key = scopeVars[i][0];
      var alias = scopeVars[i][1] || key;
      context[alias] = key.split('.').reduce(function(scope, nextKey) {
        return scope[nextKey];
      }, scope);
    }
  };

  var parseUiCondition = function(name, attrs, $scope, SharedState, $parse, $interpolate) {
    var expr = attrs[name];
    var needsInterpolation = expr.match(/\{\{/);
    var exprFn;

    if (needsInterpolation) {
      exprFn = function(context) {
        var interpolateFn = $interpolate(expr);
        var parseFn = $parse(interpolateFn($scope));
        return parseFn(context);
      };
    } else {
      exprFn = $parse(expr);
    }

    var uiScopeContext = parseScopeContext(attrs.uiScopeContext);
    return function() {
      var context;
      if (uiScopeContext.length) {
        context = angular.extend({}, SharedState.values());
        mixScopeContext(context, uiScopeContext, $scope);
      } else {
        context = SharedState.values();
      }
      return exprFn(context);
    };
  };

  /**
    * @ngdoc directive
    * @function uiIf
    *
    * @description
    * Same as `ngIf` but evaluates condition against `SharedState` statuses too
    *
    * @param {expression} uiIf A condition to decide wether to attach the
    * element to the dom
    * @param {list} [uiScopeContext] A list `scopeVar[ as aliasName] [, ...]`
    * specifing one of more scope variables to take into account when
    * evaluating condition.
    */
  module.directive('uiIf', ['$animate', 'SharedState', '$parse', '$interpolate', function($animate, SharedState, $parse, $interpolate) {
    function getBlockNodes(nodes) {
      var node = nodes[0];
      var endNode = nodes[nodes.length - 1];
      var blockNodes = [node];
      do {
        node = node.nextSibling;
        if (!node) {
          break;
        }
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
      link: function($scope, $element, $attr, ctrl, $transclude) {
        var block;
        var childScope;
        var previousElements;
        var uiIfFn = parseUiCondition('uiIf', $attr, $scope, SharedState, $parse, $interpolate);

        $scope.$watch(uiIfFn, function uiIfWatchAction(value) {
          if (value) {
            if (!childScope) {
              $transclude(function(clone, newScope) {
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

  /**
   * @ngdoc directive
   * @function uiHide
   *
   * @description
   * Same as `ngHide` but evaluates condition against `SharedState` statuses
   *
   * @param {expression} uiShow A condition to decide wether to hide the element
   * @param {list} [uiScopeContext] A list `scopeVar[ as aliasName] [, ...]`
   * specifing one of more scope variables to take into account when evaluating condition.
   */
  module.directive('uiHide', ['$animate', 'SharedState', '$parse', '$interpolate', function($animate, SharedState, $parse, $interpolate) {
    var NG_HIDE_CLASS = 'ng-hide';
    var NG_HIDE_IN_PROGRESS_CLASS = 'ng-hide-animate';

    return {
      restrict: 'A',
      multiElement: true,
      link: function(scope, element, attr) {
        var uiHideFn = parseUiCondition('uiHide', attr, scope, SharedState, $parse, $interpolate);
        scope.$watch(uiHideFn, function uiHideWatchAction(value) {
          $animate[value ? 'addClass' : 'removeClass'](element, NG_HIDE_CLASS, {
            tempClasses: NG_HIDE_IN_PROGRESS_CLASS
          });
        });
      }
    };
  }]);

  /**
   * @ngdoc directive
   * @function uiShow
   *
   * @description
   * Same as `ngShow` but evaluates condition against `SharedState` statuses
   *
   * @param {expression} uiShow A condition to decide wether to show the element
   * @param {list} [uiScopeContext] A list `scopeVar[ as aliasName] [, ...]`
   * specifing one of more scope variables to take into account when evaluating condition.
   */
  module.directive('uiShow', ['$animate', 'SharedState', '$parse', '$interpolate', function($animate, SharedState, $parse) {
    var NG_HIDE_CLASS = 'ng-hide';
    var NG_HIDE_IN_PROGRESS_CLASS = 'ng-hide-animate';

    return {
      restrict: 'A',
      multiElement: true,
      link: function(scope, element, attr) {
        var uiShowFn = parseUiCondition('uiShow', attr, scope, SharedState, $parse);
        scope.$watch(uiShowFn, function uiShowWatchAction(value) {
          $animate[value ? 'removeClass' : 'addClass'](element, NG_HIDE_CLASS, {
            tempClasses: NG_HIDE_IN_PROGRESS_CLASS
          });
        });
      }
    };
  }]);

  /**
   * @ngdoc directive
   * @function uiClass
   *
   * @description
   * A simplified version of `ngClass` that evaluates in context of `SharedState`, it only suppors the `{'className': expr}` syntax.
   *
   * @param {expression} uiClass An expression that has to evaluate to an object
   * of the form `{'className': expr}`, where `expr` decides wether the class
   * should appear to element's class list.
   * @param {list} [uiScopeContext] A list `scopeVar[ as aliasName] [, ...]`
   * specifing one of more scope variables to take into account when evaluating
   * condition.
   */
  module.directive('uiClass', ['SharedState', '$parse', '$interpolate', function(SharedState, $parse) {
    return {
      restrict: 'A',
      link: function(scope, element, attr) {
        var uiClassFn = parseUiCondition('uiClass', attr, scope, SharedState, $parse);
        scope.$watch(uiClassFn, function uiClassWatchAction(value) {
          var classesToAdd = '';
          var classesToRemove = '';
          angular.forEach(value, function(expr, className) {
            if (expr) {
              classesToAdd += ' ' + className;
            } else {
              classesToRemove += ' ' + className;
            }
            classesToAdd = classesToAdd.trim();
            classesToRemove = classesToRemove.trim();
            if (classesToAdd.length) {
              element.addClass(classesToAdd);
            }
            if (classesToRemove.length) {
              element.removeClass(classesToRemove);
            }
          });
        }, true);
      }
    };
  }]);

  module.run([
    '$rootScope',
    'SharedState',
    function($rootScope, SharedState) {
      $rootScope.Ui = SharedState;
    }
  ]);

})();
