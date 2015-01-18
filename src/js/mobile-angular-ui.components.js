/**
@module mobile-angular-ui.components

@description

It has directives and services providing mobile friendly 
components like navbars and sidebars. 
It requires `mobile-angular-ui.base.css` 
in order to work properly.

## Standalone Usage

Although `.components` module is required by `mobile-angular-ui` by default 
you can use it alone. Some submodules requires `mobile-angular-ui.core` to work,
so be sure its sources are available.

``` js
angular.module('myApp', ['mobile-angular-ui.components']);
```

*/
(function() {
  'use strict';

  angular.module('mobile-angular-ui.components', [
    'mobile-angular-ui.components.modals',
    'mobile-angular-ui.components.navbars',
    'mobile-angular-ui.components.sidebars',
    'mobile-angular-ui.components.scrollable',
    'mobile-angular-ui.components.switch'
  ]);
}());