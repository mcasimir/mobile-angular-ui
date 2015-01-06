---
title: "mobile-angular-ui.core.sharedState"
name: "sharedState"
type: "module"
src: "src/js/core/sharedState.js"
path: "mobile-angular-ui/core/sharedState"
---

`SharedState` aims to provide a proper way to create directives and components that previously used scope variables to communicate.

`mobile-angular-ui.core.sharedState` is expose the homonymous service `SharedState` and a group of directives to access it.

eg.

``` js
app.controller('controller1', function($scope, SharedState){
  SharedState.initialize($scope, 'myId');
});

app.controller('controller2', function(SharedState){
  SharedState.toggle('myId');
});
```

Data structures retaining statuses will stay outside angular scopes thus they are not evaluated against digest cycle until its necessary. Also although statuses are sort of global variables `SharedState` will take care of disposing them when no scopes are requiring them anymore.

A set of `ui-*` directives are available to interact with `SharedState` module and will hopefully let you spare your controllers and your time for something that is more meaningful than this:

``` js
$scope.activeTab = 1;

$scope.setActiveTab = function(n) {
  $scope.activeTab = n;
};
```

## Usage

Declare it as a dependency to your app unless you have already included some of its super-modules.

```
angular.module('myApp', ['mobile-angular-ui.core.sharedState']);
```

Use `ui-state` directive to require/initialize a state from the target element scope

Example: Tabs

``` html

<div class="tabs" ui-state="activeTab">

  <ul class="nav nav-tabs">
    <li ui-class="{'active': activeTab == 1)}">
      <a ui-set="{'activeTab': 1}">Tab 1</a>
    </li>
    <li ui-class="{'active': activeTab == 2)}">
      <a ui-set="{'activeTab': 2}">Tab 2</a>
    </li>
    <li ui-class="{'active': activeTab == 3)}">
      <a ui-set="{'activeTab': 3}">Tab 3</a>
    </li>
  </ul>

  <div ui-if="activeTab == 1">
    Tab 1
  </div>

  <div ui-if="activeTab == 2">
    Tab 2
  </div>

  <div ui-if="activeTab == 3">
    Tab 3
  </div>

</div>
```

NOTE: `ui-toggle/set/turnOn/turnOff` responds to `click/tap` without stopping propagation so you can use them along with ng-click too. You can also change events to respond to with `ui-triggers` attribute.

Any `SharedState` method is exposed through `Ui` object in `$rootScope`. So you could always do `ng-click="Ui.turnOn('myVar')"`.

Since `SharedState` is a service you can initialize/set statuses through controllers too:

``` js
app.controller('myController', function($scope, SharedState){
  SharedState.initialize($scope, "activeTab", 3);
});
```

As well as you can use `ui-default` for that: 

``` html
<div class="tabs" ui-state="activeTab" ui-default="thisIsAnExpression(5 + 1 - 2)"></div>
```