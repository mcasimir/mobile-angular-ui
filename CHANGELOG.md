# Mobile Angular Ui Changelog

### v. 1.2.0-beta.9

- Fix #183 (padding not removed when sidebar-header/footer are removed)

_Fri Dec 19 2014_


### v. 1.2.0-beta.8

_Fri Dec 19 2014_

Drag Fixes and Demo improvements:

- Transform now works in FF (broken due to bad property name)
- Added translate(0,0) workaround to [drag-to-dismiss] in demo to make
it work in Android and mobile chrome
- Drag prevent propagation of move so it works while nested in ng-swipe
- Demo uses modals with ng-include

### v. 1.2.0-beta.7

_Fri Dec 19 2014_

- fix #177
- ui-* now fires after ng-click

### v. 1.2.0-beta.6

_Thu Dec 18 2014_

- Added ng-swipe-left/ng-swipe-right directives
- Improved tests for SharedState
- Scaffolded specs for ui-switch

### v. 1.2.0-beta.4 - v. 1.2.0-beta.5

_Tue Dec 16 2014_

- Fixes $drag causing exception or warning due to misused `insertRule`
- Doc comments in drag.js now reflects $drag actual interface


### v. 1.2.0-beta.4 - v. 1.2.0-beta.5

_Thu Dec 16 2014_

- Fixes $drag causing exception or warning due to misused `insertRule`
- Doc comments in drag.js now reflects $drag actual interface

### v. 1.2.0-beta.3

_Thu Dec 16 2014_

- Fixes #179: causing exception on focus inputs inside scrollables, now Angular soft keyboard workaround will work again
- Added tests with Protractor

### v. 1.2.0-beta.2

_Wed Nov 28 2014_

# Migrating to Mobile Angular UI 1.2

All of the functionalities are now separed in 3 modules: `core`, `components` and `gestures`.

## Core UI functionalities

Core UI Functionalities are those any HTML UI built on Angular could use. They are not Mobile-specific nor depending on anything else that Angular itself, and you could use them with any css framework.

### YieldTo/ContentFor

They are the same that 1.1 beside to be prefixed with `ui-` so use: `ui-yield-to` and `ui-content-for`.


### Toggle/Toggleable to SharedState and ui-*

Toggle has been rewritten from scratch for 1.2. In place of that there is a new service with it's own isolated context.

It is called `SharedState`. It will act as a BUS between UI elements to share UI related state that is automatically disposed when all scopes requiring it are destroyed.

eg.

``` js
SharedState.initialize(requiringScope, 'myId');
SharedState.toggle('myId');
```

Using `SharedState` directives is very close to attach an `ng-init` in root element and interact through expression and ng-click, but it has handy features to avoid polluting controllers/scopes with ui-related stuffs.

`SharedState` methods are exposed through `ui-` directives. So you should never use it directly in your controller, and you can spare them to hold application logic. 

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

### Outer Clicks

`ui-outer-click` and `ui-outer-click-if` are directives that allow to specifiy a behaviour when click/tap events happen outside an element. This can be easily used to implement eg. __close on outer click__ feature for a dropdown.


``` html
  <div class="btn-group pull-right">
    <a ui-turn-on='myDropdown' class='btn'>
      <i class="fa fa-ellipsis-v"></i>
    </a>
    <ul 
      class="dropdown-menu"
      
      ui-state="myDropdown"
      ui-if="myDropdown"
      
      ui-outer-click="ui.turnOff('myDropdown')"
      ui-outer-click-if="ui.active('myDropdown')"
      
      ui-turn-off="myDropdown">

      <li><a>Action</a></li>
      <li><a>Another action</a></li>
      <li><a>Something else here</a></li>
      <li class="divider"></li>
      <li><a>Separated link</a></li>
    </ul>
  </div>
```

## New Experimental Features

### $swipe

A drop in replacement for `ngTouch`'s `$swipe`. It is free from other `ngTouch` features that does not play or duplicates fastclicks behaviour.

### $drag

`$drag` Service wraps `$swipe` to extend its behavior moving target element through css transform according to the `$swipe` coords thus creating a drag effect.

$drag interface is very close to `$swipe`:

``` js
app.controller('MyController', function($drag, $element){
  var unbindDrag = $drag.bind($element, {
   // drag callbacks
   // - rect is the current result of getBoundingClientRect() for bound element
   // - cancelFn issue a "touchcancel" on element
   // - resetFn restore the initial transform
   // - undoFn undoes the current movement
   // - swipeCoords are the coordinates exposed by the underlying $swipe service
   start: function(rect, cancelFn, resetFn, swipeCoords){},
   move: function(rect, cancelFn, resetFn, swipeCoords){},
   end: function(rect, undoFn, resetFn, swipeCoords) {};
   cancel: function(rect, resetFn){},

   // constraints for the movement
   // you can use a "static" object of the form:
   // {top: .., lelf: .., bottom: .., rigth: ..}
   // or pass a function that is called on each movement 
   // and return it in a dynamic way.
   // This is useful if you have to constraint drag movement while bounduaries are
   // changing over time.

   constraint: function(){ return {top: y1, left: x1, bottom: y2, right: x2}; }, // or just {top: y1, left: x1, bottom: y2, right: x2}

   // instantiates the Trasform according to touch movement (defaults to `t.translate(dx, dy);`)
   // dx, dy are the distances of movement for x and y axis after constraints are applyied
   transform: function(transform, dx, dy, currSwipeX, currSwipeY, startSwipeX, startSwipeY) {},

   // changes the Transform before is applied to element (useful to add something like easing or accelleration)
   adaptTransform: function(transform, dx, dy, currSwipeX, currSwipeY, startSwipeX, startSwipeY) {}

  });
  
  // This is automatically called when element is disposed so it is not necessary
  // that you call this manually but if you have to detatch $drag service before
  // this you could just call:
  unbindDrag();
});
```

Main differences with `$swipe` are:
 - bound elements will move following swipe direction automatically
 - coords param take into account css transform so you can easily detect collision with other elements.
 - start, move, end callback receive a cancel funcion that can be used to cancel the motion and reset
   the transform.
 - you can configure the transform behavior passing a transform function to options.
 - you can constraint the motion through the constraint option (setting relative movement limits)

**Example 1.** Drag to dismiss

``` js
app.directive('dragToDismiss', function($drag, $parse, $timeout){
  return {
    restrict: 'A',
    compile: function(elem, attrs) {
      var dismissFn = $parse(attrs.dragToDismiss);
      return function(scope, elem, attrs){
        var dismiss = false;

        $drag.bind(elem, {
          constraint: {
            minX: 0, 
            minY: 0, 
            maxY: 0 
          },
          move: function(c) {
            if( c.left >= c.width / 4) {
              dismiss = true;
              elem.addClass('dismiss');
            } else {
              dismiss = false;
              elem.removeClass('dismiss');
            }
          },
          cancel: function(){
            elem.removeClass('dismiss');
          },
          end: function(c, undo, reset) {
            if (dismiss) {
              elem.addClass('dismitted');
              $timeout(function() { 
                scope.$apply(function() {
                  dismissFn(scope);  
                });
              }, 400);
            } else {
              reset();
            }
          }
        });
      };
    }
  };
});
```

**Example 2.** Touch enabled "deck of cards" carousel directive

``` js
app.directive('carousel', function(){
  return {
    restrict: 'C',
    scope: {},
    controller: function($scope) {
      this.itemCount = 0;
      this.activeItem = null;

      this.addItem = function(){
        var newId = this.itemCount++;
        this.activeItem = this.itemCount == 1 ? newId : this.activeItem;
        return newId;
      };

      this.next = function(){
        this.activeItem = this.activeItem || 0;
        this.activeItem = this.activeItem == this.itemCount - 1 ? 0 : this.activeItem + 1;
      };

      this.prev = function(){
        this.activeItem = this.activeItem || 0;
        this.activeItem = this.activeItem === 0 ? this.itemCount - 1 : this.activeItem - 1;
      };
    }
  };
});

app.directive('carouselItem', function($drag) {
  return {
    restrict: 'C',
    require: '^carousel',
    scope: {},
    transclude: true,
    template: '<div class="item"><div ng-transclude></div></div>',
    link: function(scope, elem, attrs, carousel) {
      scope.carousel = carousel;
      var id = carousel.addItem();
      
      var zIndex = function(){
        var res = 0;
        if (id == carousel.activeItem){
          res = 2000;
        } else if (carousel.activeItem < id) {
          res = 2000 - (id - carousel.activeItem);
        } else {
          res = 2000 - (carousel.itemCount - 1 - carousel.activeItem + id);
        }
        return res;
      };

      scope.$watch(function(){
        return carousel.activeItem;
      }, function(n, o){
        elem[0].style['z-index']=zIndex();
      });
      

      $drag.bind(elem, {
        constraint: { minY: 0, maxY: 0 },
        adaptTransform: function(t, dx, dy, x, y, x0, y0) {
          var maxAngle = 15;
          var velocity = 0.02;
          var r = t.getRotation();
          var newRot = r + Math.round(dx * velocity);
          newRot = Math.min(newRot, maxAngle);
          newRot = Math.max(newRot, -maxAngle);
          t.rotate(-r);
          t.rotate(newRot);
        },
        move: function(c){
          if(c.left >= c.width / 4 || c.left <= -(c.width / 4)) {
            elem.addClass('dismiss');  
          } else {
            elem.removeClass('dismiss');  
          }          
        },
        cancel: function(){
          elem.removeClass('dismiss');
        },
        end: function(c, undo, reset) {
          elem.removeClass('dismiss');
          if(c.left >= c.width / 4) {
            scope.$apply(function() {
              carousel.next();
            });
          } else if (c.left <= -(c.width / 4)) {
            scope.$apply(function() {
              carousel.next();
            });
          }
          reset();
        }
      });
    }
  };
});
```

### Transform

`Transform` is the underlying service used by `$drag` to deal with css trasform matrix in a simpler and vendor-angnostic way.

``` html
<div id="myElem" style="transform: translateX: 20px;"></div>
```

``` js
var e = document.getElementById('myElem');
var t0 = Transform.fromElement(e);

console.log(t0.getTranslation().x);
// -> 20;

t0.rotate(90);

// Set t0 to element ignoring previous transform.
t0.set(e);

var t1 = new Transform();

t1.translate(12, 40);

// merges t1 with current trasformation matrix of element.
t1.apply(e);

```

## UI Components

### General Considerations

Since 1.2 I've tried to retain bootstrap existing components look and feel as much as possible for two reason:

1. People would expect to already know them and how customize their appearence through css.
2. Mobile Angular UI dependance on bootstrap is more loose so it does not need to be updated each time BS3 changes.

As a consequence i've reduced special styles for panels/forms/modals to the bare minimum.

### Navbars

Pretty much the same. They plays well with `ng-if` now.

### Scrollables

`.scrollable` component is backward compatible but also has some major improvements too.

1. `.scrollable-header/.scrollable-footer` can be used to add fixed header/footer to a scrollable area without having to deal with css height and positioning to avoid breaking scroll.
2. `.scrollable-content` controller now expose a `scrollTo` function.
3. It plays nice with android keyboard and forms.
4. You can use `ui-scroll-bottom/ui-scroll-top` directives handle that events and implement features like _infinite scroll_.

``` html

<div class="scrollable">
  <div class="scrollable-content section" ui-scroll-bottom="loadMore()">
    <ul>
      <li ng-repeat="item in items">
        {{item.name}}
      </li>
    </ul>
  </div>
</div>

```

### Modals and Overlay

Modal dialogs has been reintroduced from Bootstrap, overlays are now just modals styled different.

``` html

<div content-for="modals">
  
  <!-- A plain modal dialog -->
  <div class="modal" ui-if='modal1' ui-state='modal1'>
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <button class="close" 
                  ui-turn-off="modal1">&times;</button>
          <h4 class="modal-title">Modal title</h4>
        </div>
        <div class="modal-body">
          <p>{{lorem}}</p>
        </div>
        <div class="modal-footer">
          <button ui-turn-off="modal1" class="btn btn-default">Close</button>
          <button ui-turn-off="modal1" ng-click="doSomething()" class="btn btn-primary">Save changes</button>
        </div>
      </div>
    </div>
  </div>

  <!-- A blurred overlay dialog -->
    <div class="modal modal-overlay" ui-if='modal2' ui-state='modal2'>
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <button class="close"
                    ui-turn-off="modal2">&times;</button>
            <h4 class="modal-title">Modal title</h4>
          </div>
          <div class="modal-body">
            <p>{{lorem}}</p>
          </div>
          <div class="modal-footer">
            <button ui-turn-off="modal2" class="btn btn-default">Close</button>
            <button ui-turn-off="modal2" ng-click="doSomething()" class="btn btn-primary">Save changes</button>
          </div>
        </div>
      </div>
    </div>
  
</div>

```

### Sidebars

Basically the same, but now they rely on `SharedState` and `bindOuterClick` to activate/inactivate them.

Syntax is basically the same:

```
<div class="sidebar sidebar-left">
  <!-- ... -->
</div>
```

Also you can now track sidebars status in url specifing `uiTrackAsSearchParam` attribute. This way you can manage to close a sidebar on back button too. It is optional cause it has a big caveat: you should not use query string part to update your view automatically. It is safe for many apps but not for all, so its optional.

To use this feature:

1. enable it in sidebar setting `uiTrackAsSearchParam` to `true`:

``` html
<div class="sidebar sidebar-left" ui-track-as-search-param="true">
  <!-- ... -->
</div>
```

2. Specify `reloadOnSearch: false` on your routes:

``` js
app.config(function($routeProvider) {
  $routeProvider.when('/',          {templateUrl: 'home.html', reloadOnSearch: false});
  $routeProvider.when('/scroll',    {templateUrl: 'scroll.html', reloadOnSearch: false}); 
  $routeProvider.when('/toggle',    {templateUrl: 'toggle.html', reloadOnSearch: false}); 
  $routeProvider.when('/tabs',      {templateUrl: 'tabs.html', reloadOnSearch: false}); 
  $routeProvider.when('/accordion', {templateUrl: 'accordion.html', reloadOnSearch: false}); 
  $routeProvider.when('/overlay',   {templateUrl: 'overlay.html', reloadOnSearch: false}); 
  $routeProvider.when('/forms',     {templateUrl: 'forms.html', reloadOnSearch: false});
  $routeProvider.when('/dropdown',  {templateUrl: 'dropdown.html', reloadOnSearch: false});
  $routeProvider.when('/drag',      {templateUrl: 'drag.html', reloadOnSearch: false});
  $routeProvider.when('/carousel',  {templateUrl: 'carousel.html', reloadOnSearch: false});
});

```

## Carousel

Carousel implementations (with `$swipe` or `$drag`) has been moved in an external file/plugin and not included by default.

## Utils

`panels` and `forms` has been discontinued completely. This is due to: panels has a trivial markup as they are in bootstrap. Forms on the contrary has a lot of functionalities so in my opinion `.form-*` directives need an external plugin to be implemented and mantained correctly.


### v. 1.1.0-beta.22

_Sun May 25 2014_

- Fix #60: contentFor directive not compiling already compiled content anymore. You can use directives in contentFor blocks. 

- Fix #64: switch directive:  ngModel changes are now properly reflected in the parent scope and external changes to the linked ngModel are now handled by the directive through ngClass.

- Dropped overthrow.toss.js

### v. 1.1.0-beta.21

- Fixes #53: Android devices bad rendering box model with %-based translate3d. Switched to fixed sidebars width and media-queries.

### v. 1.1.0-beta.20

_Sun May  11 12:54 2014_

- Drop angular.js dependencies
- grunt/grunt connect now serves both from "." and "site/output" simplifying demo testing

### v. 1.1.0-beta.19
_Sat May  10 15:10 2014_

- Changed css distribution policy. Now base.css includes .sm grid and desktop.css includes .md+ grid. No other styles are distributed.

### v. 1.1.0-beta.18

_Fri May  9 19:21 2014_

- Changed `bs-form-control` directive to obtain a flexible behaviour with grids
- Added responsive .sm+ grid style to desktop.css version (it won't affect containers, they stay always fluid).
- Improved form style to look consitently both in horizontal and vertical layout
- Switch now supports ng-change and ng-click (fixes #46)

### v. 1.1.0-beta.17

_Tue May  6 13:59 2014_

- Added this changelog :)
- Updated to latest bootstrap (3.1.1) and angular.js (1.2.17)
- Rewritten everything in vanilla js in the hope to have more people collaborating
- Rewritten toggle/toggleable directives in a more Angular.js fashion
- A lot of work to get rid of memory leaks
- Restructured .less code to be more understandable and use bootstrap vars and mixins whenever possible (you can now customize almost everything through less vars)
- Supporting different icons sets (added same style of .fa to .icon)
- Dropped support to iScroll (sorry too much work to maintain even this)
- Removed $swipe service from fastclick touch implementation (just use ngTouch for that)
- Included everything else in the same distribution file
- Renamed bsInput to bsFormControl
- Sidebars closes by default on outer clicks (customizable). Fix #45.
- Fixes bsFormControl label disappearing with jquery. Fix #42.