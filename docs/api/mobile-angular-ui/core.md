---
title: "mobile-angular-ui.core"
name: "core"
type: "module"
src: "src/js/mobile-angular-ui.core.js"
path: "mobile-angular-ui/core"
---

It has all the core functionalities of Mobile Angular UI. It aims to act as a common base 
for an UI framework providing services and directives to create components and implement 
UI interactions with angular.

<div class="alert alert-success">
  <b>NOTE</b>
  <ul>
    <li>It has no dependency on Bootstrap.</li>
    <li>It is not related to mobile apps only.</li>
    <li>It is not requiring CSS support.</li>
    <li><b>You can use it on any Angular Application and with any CSS framework.</b></li>
  </ul>
</div>

## Standalone Usage

Although `.core` module is required by `mobile-angular-ui` by default you can use it alone.

```
angular.module('myApp', ['mobile-angular-ui.core']);
```