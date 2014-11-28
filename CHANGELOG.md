# Mobile Angular Ui Changelog

### v. 1.2.0-beta.2

_Wed Nov 28 2014_

# Migrating to Mobile Angular UI 1.2

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

### $drag

`$drag` Service wraps `ngTouch`'s `$swipe` to extend its behavior moving one or more
target element through css transform according to the `$swipe` coords thus creating 
a drag effect.

$drag interface is similar to `$swipe`:

``` js
app.controller('MyController', function($drag, $element){
  $drag.bind($element, {
   start: function(coords, cancel, markers, e){},
   move: function(coords, cancel, markers, e){},
   end: function(coords, cancel, markers, e){},
   cancel: function(coords, markers, e){},
   transform: function(x, y, transform) {},
   adaptTransform: function(x, y, transform) {},
   constraint: fn or {top: y1, left: x1, bottom: y2, right: x2}
  });
});
```

Main differences with `$swipe` are:

 - coords param take into account css transform so you can easily detect collision with other elements.
 - start, move, end callback receive a cancel funcion that can be used to cancel the motion and reset
   the transform.
 - you can configure the transform behavior passing a transform function to options.
 - you can constraint the motion through the constraint option (setting relative movement limits) 
   or through the track option (setting absolute coords);
 - you can setup collision markers being watched and passed to callbacks.
 
Example (drag to dismiss):

``` js
 $drag.bind(e, {
   move: function(c, cancel, markers){
     if(c.left > markers.m1.left) {
       e.addClass('willBeDeleted');
     } else {
       e.removeClass('willBeDeleted');
     }
   },
   end: function(coords, cancel){
     if(c.left > markers.m1.left) {
       e.addClass('deleting');
       delete($scope.myModel).then(function(){
         e.remove();
       }, function(){
         cancel();
       });
     } else {
       cancel();
     }
   },
   cancel: function(){
     e.removeClass('willBeDeleted');
     e.removeClass('deleting');
   },
   constraint: { 
       minX: 0, 
       minY: 0, 
       maxY: 0 
    },
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

1. People would expect to already know them and how customize them with css.
2. Mobile Angular UI dependance on bootstrap is more loose so it does not need to be updated each time BS3 changes.

As a consequence i've reduced special style for panels/forms/modals to the bare minimum.

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