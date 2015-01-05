/**

@module mobile-angular-ui.core

@description

**Stand alone usage**

`.core` module is required by `mobile-angular-ui`, anyway you can use it alone.

```
angular.module('myApp', ['mobile-angular-ui.core']);
```

**Description**

It has all the core functionalities of Mobile Angular UI. It aims to act as a common base for a UI framework providing services and directives to create components and implement UI interactions with angular.

<div class="alert alert-success">
  <b>NOTE</b>
  <ul>
    <li>It has no dependency on Bootstrap.</li>
    <li>It is not related to mobile apps only.</li>
    <li>It is not requiring CSS support.</li>
    <li><b>You can use it on any Angular Application and with any CSS framework.</b></li>
  </ul>
</div>

*/
(function () {
  'use strict';
  angular.module('mobile-angular-ui.core', [
    'mobile-angular-ui.core.fastclick',
    'mobile-angular-ui.core.activeLinks',
    'mobile-angular-ui.core.capture',
    'mobile-angular-ui.core.outerClick',
    'mobile-angular-ui.core.sharedState'
  ]);
}());