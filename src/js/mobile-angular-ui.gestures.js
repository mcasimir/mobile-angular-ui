/**
@module mobile-angular-ui.gestures
@position 100
@description

It has directives and services to support `touch`, `swipe` and `drag` gestures.

It does not need any `.css` to work.

<div class="alert alert-warning">
<p>
<i class="fa fa-warning"></i> This module will not work with `ngTouch` cause it is intended, among offering more features, to be a drop-in replacement for it.
</p>
<p>
Be aware that `ngTouch` is still not playing well with `fastclick.js` and its usage with `mobile-angular-ui` is currently discouraged anyway.
</p>
</div>

## Usage

`.gestures` module is not required by `mobile-angular-ui` module. It has no dependency on other modules and is intended to be used alone with any other angular framework.

You have to include `mobile-angular-ui.gestures.min.js` to your project in order to use it. Ie.

``` html
<script src="/dist/js/mobile-angular-ui.gestures.min.js"></script>
```

``` js
angular.module('myApp', ['mobile-angular-ui.gestures']);
```

*/
(function () {
   'use strict';

   angular.module('mobile-angular-ui.gestures', [
     'mobile-angular-ui.gestures.drag',
     'mobile-angular-ui.gestures.swipe',
     'mobile-angular-ui.gestures.transform'
   ]);

}());
