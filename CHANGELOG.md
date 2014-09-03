# Mobile Angular Ui Changelog

### 1.1.0-beta.30

- Fix #92
- Fix #73 
- Fix #82, hide the right sidebar

### 1.1.0-beta.29
_Mon Jul 28 2014_

- fixed navbar-top height without buttons in desktop mode


### 1.1.0-beta.28
_Sat Jul 19 2014_

- fix #100
- keeping border radius for controls


### 1.1.0-beta.27
_Wed Jul 09 2014_

- fix #98


### 1.1.0-beta.26
_Wed Jul 09 2014_

- fix #77 directives in overlays
- closes #78


### 1.1.0-beta.25
_Wed Jul 09 2014_

- split :hover css in separate file
- fix #75


### 1.1.0-beta.24

_"Mon Jul 07 2014"_

- fix #74

### 1.1.0-beta.23

_"Mon Jul 07 2014"_

- added demo to bower


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