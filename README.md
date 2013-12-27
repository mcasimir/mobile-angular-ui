# Mobile Angular UI with Bootstrap 3

## Angular &amp; Bootstrap 3 for Mobile web and applications

![](http://mobileangularui.com/logo.png)

Angular Ui Mobile glues together: 

- Angular 1.2+
- Bootstrap 3
- Angular directives for Bootstrap 3
- An essential set of Bootstrap 3 components for mobile (navbars, sidebars, switches ..)
- Icons with FontAwesome
- Overthrow js `overflow: auto` polyfill
- Some other mobile Web App best pratices and polyfills

### Some features:

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


### Test with your devices

``` sh
git clone https://github.com/mcasimir/mobile-angular-ui.git
```

then you need `node`, `bower` and `grunt` so you can run `npm install` and use `grunt` to launch a local server that serves a demo app at `http://localhost:3001/demo`

``` sh
grunt connect
```

### Differences with Bootstrap 3

1. It uses font-awesome in place of glyphicons

2. responsive css rules for *-sm, *-md, *-lg are moved out of the default bundle

3. removed/unsupported components:

  - breadcrumbs and pagination: they are just not the best way to navigate a mobile app
  - tooltips: unlikely to be useful with small screens and touch devices, popovers should be enough
  - carousels
  - modals: are replaced by overlays

4. All of the Bootstrap Javascript features are obtained with just two angular directives: `toggle` and `toggleable`. Read the [docs](http://mobileangularui.com/) for more.
