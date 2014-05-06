# Mobile Angular Ui Changelog

### v.

_Tue May  6 13:59:57 2014_

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
- Sidebars closes by default on outer clicks (customizable)