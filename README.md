# Mobile Angular UI with Bootstrap 3

## Angular &amp; Bootstrap 3 for Mobile web and applications

Maui glues together: 

- Angular 1.2+
- Bootstrap 3
- Angular directives for Bootstrap 3
- An essential set of Bootstrap 3 components for mobile (navbars, sidebars, switches ..)
- Icons with FontAwesome
- iScroll
- Some other mobile Web App best pratices and polyfills

Some features:

- Mobile only Bootstrap 3
- Scalable Icons with FontAwesome
- Base css stripped out of responsive media queries that are put apart in separate files (just include what you need)
- Angular JS module with `angular-touch` and `angular-animate` prepacked and preloaded
- Scrollable areas with `overflow: auto` polyfilled with [Overthrow](http://filamentgroup.github.io/Overthrow/) when necessary
- Slide-out/slide-in Sidebar
- Bottom Bar with Justified Buttons
- Customizable build workflow with Grunt

Some convenient implementation constraints:

- Be the less invasive we can: use things as they are when possible
- Keep Angular components in separate modules 
- Follow twitter bootstrap patterns for markup
- Use the same bootstrap variables
- Keep it lighter than Bootstrap 3 + Jquery + Angular Js

__NOTE__

This project is partially functional now but not ready yet. To test it and see what it is now just clone this repo:

``` sh
git clone https://github.com/mcasimir/maui.git
```

then you need `node`, `bower` and `grunt` so you can run `npm install` and use `grunt` to launch a local server that serves a demo app at `http://localhost:3000`

``` sh
grunt connect
```

### Differences with Bootstrap Javascript

We will only support:

- tabs
- dropdowns
- accordions
- collapsible
- modals
- dismissing alerts and modals

#### Tabs

Tabs can be triggered by any `.nav-tabs>[toggle-tab]` so we can take advantage of .button-group to reproduce ios7-like tab navigation

``` html
<div class="btn-group justified nav-tabs">
  <a class="btn btn-default active" toggle-tab href="#TabGroup1.Tab1">Tab1</a>
  <a class="btn btn-default"        toggle-tab href="#TabGroup1.Tab2">Tab2</a>
  <a class="btn btn-default"        toggle-tab href="#TabGroup1.Tab3">Tab3</a>
</div>

<div class="nav-content">
  <div class="tab-pane" id="TabGroup1.Tab1">...</div>
  <div class="tab-pane" id="TabGroup1.Tab2">...</div>
  <div class="tab-pane" id="TabGroup1.Tab3">...</div>
</div>
```

As you can see from the example above tabs component substantially keeps the original markup except that toggle="tab" is replaced by toggle-tab.

You should also notice that target ids are composed of a pair of arbitrary `tab-group-id` and `tab-id` separated by a dot. 

This way tab grouping does not depend on markup anymore and we can avoid to rely on DOM for things like activate/unactivate tabs using angular events instead. 

### Differences with Bootstrap CSS

Removed components:

- breadcrumbs and pagination: they are just not the best way to navigate a mobile app
- tooltips and popovers: unlikely to be useful with small screens, altough one of the two could be reintroduced bound to long-press event

## The Roadmap

- Reproduce all of the targeted twitter bootstrap basic functionalities
- Isolate scrolling polyfills and hide details through generic markup and angular directives
- Test and choose wise between iScroll and Overthrow or something else
- Add a switch component
- Add `contentFor` and `yield` directives to easily setup title and buttons by route
- Add some directives to simplify bootstrap markup for forms
- Support gestures for sidebars and switches
- Write a detailed documentation
