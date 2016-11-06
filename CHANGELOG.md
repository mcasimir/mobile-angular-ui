<a name="v1.3.4"></a>
# [v1.3.4](https://github.com/mcasimir/mobile-angular-ui/compare/v1.3.3...v1.3.4)

## Fixes

- bug preventing to configure thresholds on touch ([af89f55](https://github.com/mcasimir/mobile-angular-ui/commits/af89f55bee62fe684512ad421d7eee5422aa2bed))

<a name="v1.3.3"></a>
# [v1.3.3](https://github.com/mcasimir/mobile-angular-ui/compare/v1.3.2...v1.3.3)

<a name="v1.3.2"></a>
# [v1.3.2](https://github.com/mcasimir/mobile-angular-ui/compare/v1.3.1...v1.3.2)

## Fixes

- added fontawesome.woff2 to bower json ([bdafc03](https://github.com/mcasimir/mobile-angular-ui/commits/bdafc038c4888fe4b697352f7b0f708904bbb6c0))
- bolder default font-weight ([c21438b](https://github.com/mcasimir/mobile-angular-ui/commits/c21438b0e99c2eeec9aead729ba987dc3d7e79c5), [0a8030c](https://github.com/mcasimir/mobile-angular-ui/commits/0a8030c9ff8199236cce07b902aa4e3994417413))
- active links not working  ([15564fb](https://github.com/mcasimir/mobile-angular-ui/commits/15564fba1b2a2ec6dc4727583603f24eb2ff19a6))
- touch-move-default broken with scrollable ([60a807c](https://github.com/mcasimir/mobile-angular-ui/commits/60a807c09db2519e0fba3969e0442c9497b7a3b9))

<a name="v1.3.1"></a>
# [v1.3.1](https://github.com/mcasimir/mobile-angular-ui/compare/v1.3.0...v1.3.1)

## Fixes

- removed webdriver postinstall hook ([2a43565](https://github.com/mcasimir/mobile-angular-ui/commits/2a4356537ed4b2522fb4eb2d2dfd08f7f7a405a5))

<a name="v1.3.0"></a>
# [v1.3.0](https://github.com/mcasimir/mobile-angular-ui/compare/1.2.1...v1.3.0)

## Features

- added `ui-shared-state` and **deprecated** `ui-state` so it does not clash with ui-router ([9ad2f57](https://github.com/mcasimir/mobile-angular-ui/commits/9ad2f578a3fb0c68c22a29ee415b04113251ce4f))
- activeLinks module supports html5Mode ([d3cbbbf](https://github.com/mcasimir/mobile-angular-ui/commits/d3cbbbf07c74dc4e3631f0ad3cd22bbc3c3d7b20))
- updated fastclick to version 1.0.6 ([03060e2](https://github.com/mcasimir/mobile-angular-ui/commit/03060e2786800cdfc43c1586da889dffeb9b19e3))
- updated font-awesome to version 4.6.3 ([9f7424c](https://github.com/mcasimir/mobile-angular-ui/commit/9f7424c6c1e5103d8d3c5a195bdc0bd16fe66494))

## Fixes

- Implemented workaround for jQuery event normalization ([a3bb0e7](https://github.com/breeze4/mobile-angular-ui/commit/a3bb0e77c70fa2bac94de7da1f37abbacc1b6740))
- scrollTo behavior when `scrollableHeader` is present ([54b0e41](https://github.com/mcasimir/mobile-angular-ui/commit/54b0e41df668c6dba5c401e53c47dd704a6ea702))

<a name="1.2.1"></a>
## 1.2.1 (2016-03-06)

* Added support tu ui.router ([27c34a4](https://github.com/mcasimir/mobile-angular-ui/commit/27c34a4))
* fix docs for gestures ([d5eeb6e](https://github.com/mcasimir/mobile-angular-ui/commit/d5eeb6e))
* removed beta version ([db00a9e](https://github.com/mcasimir/mobile-angular-ui/commit/db00a9e))
* Revert "Added support tu ui.router" ([2368518](https://github.com/mcasimir/mobile-angular-ui/commit/2368518))
* use sauce for ci tests ([c961675](https://github.com/mcasimir/mobile-angular-ui/commit/c961675))



<a name="1.2.0-rc.3"></a>
# 1.2.0-rc.3 (2015-08-04)

* 1.2.0-rc.3 ([35b9c81](https://github.com/mcasimir/mobile-angular-ui/commit/35b9c81))
* build+bump ([d44ef94](https://github.com/mcasimir/mobile-angular-ui/commit/d44ef94))



<a name="1.2.0-rc.2"></a>
# 1.2.0-rc.2 (2015-08-04)

* 1.2.0-rc.2 ([464f323](https://github.com/mcasimir/mobile-angular-ui/commit/464f323))



<a name="1.2.0-rc.1"></a>
# 1.2.0-rc.1 (2015-08-04)

* $drag prevents outer $swipes from being triggered ([fc374d3](https://github.com/mcasimir/mobile-angular-ui/commit/fc374d3))
* 1.2.0-rc.1 ([e284aa4](https://github.com/mcasimir/mobile-angular-ui/commit/e284aa4))
* adapted test exit code to fail in travis ([07dc3bc](https://github.com/mcasimir/mobile-angular-ui/commit/07dc3bc))
* added .gitignore, .travis.yml, .jshintrc ([ccefb42](https://github.com/mcasimir/mobile-angular-ui/commit/ccefb42))
* added .gitignore, .travis.yml, .jshintrc ([fb428a2](https://github.com/mcasimir/mobile-angular-ui/commit/fb428a2))
* added back ng-swipe to demo ([0c637c3](https://github.com/mcasimir/mobile-angular-ui/commit/0c637c3))
* Added Gitter badge ([bd6c13c](https://github.com/mcasimir/mobile-angular-ui/commit/bd6c13c))
* added overscroll workaround, fix #192 ([3498a94](https://github.com/mcasimir/mobile-angular-ui/commit/3498a94)), closes [#192](https://github.com/mcasimir/mobile-angular-ui/issues/192)
* added pre-interpolation to SharedState ([bef33ee](https://github.com/mcasimir/mobile-angular-ui/commit/bef33ee))
* Allow nested property names in uiScopeContext, using dot notation in Strings ([e861686](https://github.com/mcasimir/mobile-angular-ui/commit/e861686))
* Assign noop correctly to allow switch to be properly destroyed ([a78ab20](https://github.com/mcasimir/mobile-angular-ui/commit/a78ab20))
* Fastclick fix: mcasimir/mobile-angular-ui#230 ([f2ffd65](https://github.com/mcasimir/mobile-angular-ui/commit/f2ffd65))
* fix #187, fix #191 ([5fe06cd](https://github.com/mcasimir/mobile-angular-ui/commit/5fe06cd)), closes [#187](https://github.com/mcasimir/mobile-angular-ui/issues/187) [#191](https://github.com/mcasimir/mobile-angular-ui/issues/191)
* fix #282 ([dd41223](https://github.com/mcasimir/mobile-angular-ui/commit/dd41223)), closes [#282](https://github.com/mcasimir/mobile-angular-ui/issues/282)
* fix 205 ([367a0b9](https://github.com/mcasimir/mobile-angular-ui/commit/367a0b9))
* Fix display table in Firefox ([2ec32e4](https://github.com/mcasimir/mobile-angular-ui/commit/2ec32e4))
* fix ui-set pre-interpolation ([7786474](https://github.com/mcasimir/mobile-angular-ui/commit/7786474))
* fixed active links without href ([0e83b7a](https://github.com/mcasimir/mobile-angular-ui/commit/0e83b7a))
* fixed package for travis ([81ba4c2](https://github.com/mcasimir/mobile-angular-ui/commit/81ba4c2))
* fixed swipe implementation over $touch ([a7e7bd2](https://github.com/mcasimir/mobile-angular-ui/commit/a7e7bd2))
* improved doc comments; moved doc task to website repo ([bb91246](https://github.com/mcasimir/mobile-angular-ui/commit/bb91246))
* linted fastclick + gulpfile ([5d3ce75](https://github.com/mcasimir/mobile-angular-ui/commit/5d3ce75))
* major gesture module changes and improvements ([2cb11ca](https://github.com/mcasimir/mobile-angular-ui/commit/2cb11ca))
* moved nobounce to preventTouchmoveDefaults directive; ui-switch support $drag if present ([d773374](https://github.com/mcasimir/mobile-angular-ui/commit/d773374))
* parsing docs ok ([03756b8](https://github.com/mcasimir/mobile-angular-ui/commit/03756b8))
* readded dist ([3c629d2](https://github.com/mcasimir/mobile-angular-ui/commit/3c629d2))
* Remove moot `version` property from bower.json ([dcf57ff](https://github.com/mcasimir/mobile-angular-ui/commit/dcf57ff))
* removed unneeded global variable ([d939ab1](https://github.com/mcasimir/mobile-angular-ui/commit/d939ab1))
* started supporting ci ([8705b86](https://github.com/mcasimir/mobile-angular-ui/commit/8705b86))
* Update README.md ([79eee3b](https://github.com/mcasimir/mobile-angular-ui/commit/79eee3b))
* updated gulp less; fix #284 ([66732cf](https://github.com/mcasimir/mobile-angular-ui/commit/66732cf)), closes [#284](https://github.com/mcasimir/mobile-angular-ui/issues/284)
* use gulp, jsdoc+ngdoc, refactored tests, gestures ([3b8a273](https://github.com/mcasimir/mobile-angular-ui/commit/3b8a273))
* Fixes: #187  Overthrow / fastclick error ([637c129](https://github.com/mcasimir/mobile-angular-ui/commit/637c129))



<a name="1.2.0-beta.11"></a>
# 1.2.0-beta.11 (2014-12-20)

* introduced ui-scope-context ([8370918](https://github.com/mcasimir/mobile-angular-ui/commit/8370918))
* updated changelog ([aa585ea](https://github.com/mcasimir/mobile-angular-ui/commit/aa585ea))



<a name="1.2.0-beta.10"></a>
# 1.2.0-beta.10 (2014-12-19)

* fix #183 ([35d2147](https://github.com/mcasimir/mobile-angular-ui/commit/35d2147)), closes [#183](https://github.com/mcasimir/mobile-angular-ui/issues/183)



<a name="1.2.0-beta.9"></a>
# 1.2.0-beta.9 (2014-12-19)

* Drag Fixes and Demo improvements ([7605f16](https://github.com/mcasimir/mobile-angular-ui/commit/7605f16))
* gestures module improvements ([ed2e946](https://github.com/mcasimir/mobile-angular-ui/commit/ed2e946))



<a name="1.2.0-beta.8"></a>
# 1.2.0-beta.8 (2014-12-18)

* fix #177, ui-* now fires after ng-click ([7cab55f](https://github.com/mcasimir/mobile-angular-ui/commit/7cab55f)), closes [#177](https://github.com/mcasimir/mobile-angular-ui/issues/177)



<a name="1.2.0-beta.7"></a>
# 1.2.0-beta.7 (2014-12-18)

* completed migrate to be compatible with old demo ([d57a318](https://github.com/mcasimir/mobile-angular-ui/commit/d57a318))
* Fix missing styling of input type "password" ([393a551](https://github.com/mcasimir/mobile-angular-ui/commit/393a551))



<a name="1.2.0-beta.6"></a>
# 1.2.0-beta.6 (2014-12-18)

* Added ng-swipe-left/ng-swipe-right directives ([2a57076](https://github.com/mcasimir/mobile-angular-ui/commit/2a57076))



<a name="1.2.0-beta.5"></a>
# 1.2.0-beta.5 (2014-12-16)

* fixed  exception with insertRule ([5a0a9d6](https://github.com/mcasimir/mobile-angular-ui/commit/5a0a9d6))
* fixed  exception with insertRule ([f78c726](https://github.com/mcasimir/mobile-angular-ui/commit/f78c726))



<a name="1.2.0-beta.4"></a>
# 1.2.0-beta.4 (2014-12-16)

* fixed  exception with insertRule ([71ca20e](https://github.com/mcasimir/mobile-angular-ui/commit/71ca20e))



<a name="1.2.0-beta.3"></a>
# 1.2.0-beta.3 (2014-12-16)

* Fixes #179 ([8298d85](https://github.com/mcasimir/mobile-angular-ui/commit/8298d85)), closes [#179](https://github.com/mcasimir/mobile-angular-ui/issues/179)
* started tests; fix #179 ([b3443f5](https://github.com/mcasimir/mobile-angular-ui/commit/b3443f5)), closes [#179](https://github.com/mcasimir/mobile-angular-ui/issues/179)



<a name="1.2.0-beta.2"></a>
# 1.2.0-beta.2 (2014-12-12)

* 1.2 first beta ([41d6222](https://github.com/mcasimir/mobile-angular-ui/commit/41d6222))
* 1.2.0-beta.0 ([db52011](https://github.com/mcasimir/mobile-angular-ui/commit/db52011))
* Cosmetic fixes ([00b8ed5](https://github.com/mcasimir/mobile-angular-ui/commit/00b8ed5))
* fix #171, completed migration module ([77bd63f](https://github.com/mcasimir/mobile-angular-ui/commit/77bd63f)), closes [#171](https://github.com/mcasimir/mobile-angular-ui/issues/171)
* fixed 1.2 pre-release to reflect https://gist.github.com/mcasimir/824b28d14ca1e09d03c6#migrating-to- ([c6b17a6](https://github.com/mcasimir/mobile-angular-ui/commit/c6b17a6)), closes [https://gist.github.com/mcasimir/824b28d14ca1e09d03c6#migrating-to-mobile-angular-ui-12](https://github.com/https://gist.github.com/mcasimir/824b28d14ca1e09d03c6/issues/migrating-to-mobile-angular-ui-12)
* fixed demo for ui-switch, discontinued pointerEvents ad moved to migrate.disabled ([5c195c5](https://github.com/mcasimir/mobile-angular-ui/commit/5c195c5))
* fixed sidebar names in demo ([08bc975](https://github.com/mcasimir/mobile-angular-ui/commit/08bc975))
* Fixes before releasing 1.2-beta ([48eeb56](https://github.com/mcasimir/mobile-angular-ui/commit/48eeb56))
* merged 1.2 ([aae7661](https://github.com/mcasimir/mobile-angular-ui/commit/aae7661))
* moved util services to plain private functions; merged ui and sharedState ([5dab837](https://github.com/mcasimir/mobile-angular-ui/commit/5dab837))
* reorganized modules ([28a97e2](https://github.com/mcasimir/mobile-angular-ui/commit/28a97e2))



<a name="1.1.0-beta.30"></a>
# 1.1.0-beta.30 (2014-09-18)

* fix #127, fix #126, fix #125 ([8868550](https://github.com/mcasimir/mobile-angular-ui/commit/8868550)), closes [#127](https://github.com/mcasimir/mobile-angular-ui/issues/127) [#126](https://github.com/mcasimir/mobile-angular-ui/issues/126) [#125](https://github.com/mcasimir/mobile-angular-ui/issues/125)
* fix #82, hide the right sidebar ([87b2948](https://github.com/mcasimir/mobile-angular-ui/commit/87b2948)), closes [#82](https://github.com/mcasimir/mobile-angular-ui/issues/82)
* updated bower deps ([0983b7e](https://github.com/mcasimir/mobile-angular-ui/commit/0983b7e))
* updated favicon ([d4fd386](https://github.com/mcasimir/mobile-angular-ui/commit/d4fd386))



<a name="1.1.0-beta.29"></a>
# 1.1.0-beta.29 (2014-07-27)

* fixed navbar-top height without buttons in desktop mode ([90b1528](https://github.com/mcasimir/mobile-angular-ui/commit/90b1528))



<a name="1.1.0-beta.28"></a>
# 1.1.0-beta.28 (2014-07-27)

* fix #100, keeping border radius for c controls ([3092071](https://github.com/mcasimir/mobile-angular-ui/commit/3092071)), closes [#100](https://github.com/mcasimir/mobile-angular-ui/issues/100)
* fixed README ([49f5b55](https://github.com/mcasimir/mobile-angular-ui/commit/49f5b55))
* fixed README ([04026e5](https://github.com/mcasimir/mobile-angular-ui/commit/04026e5))
* Update README.md ([3608ab7](https://github.com/mcasimir/mobile-angular-ui/commit/3608ab7))



<a name="1.1.0-beta.27"></a>
# 1.1.0-beta.27 (2014-07-18)

* fix #98 ([b46a3ce](https://github.com/mcasimir/mobile-angular-ui/commit/b46a3ce)), closes [#98](https://github.com/mcasimir/mobile-angular-ui/issues/98)



<a name="1.1.0-beta.26"></a>
# 1.1.0-beta.26 (2014-07-09)

* fix #77 directives in overlays, closes #78 ([be39011](https://github.com/mcasimir/mobile-angular-ui/commit/be39011)), closes [#77](https://github.com/mcasimir/mobile-angular-ui/issues/77) [#78](https://github.com/mcasimir/mobile-angular-ui/issues/78)



<a name="1.1.0-beta.25"></a>
# 1.1.0-beta.25 (2014-07-08)

* split :hover css in separate file, fix #75 ([11d3f6a](https://github.com/mcasimir/mobile-angular-ui/commit/11d3f6a)), closes [#75](https://github.com/mcasimir/mobile-angular-ui/issues/75)



<a name="1.1.0-beta.24"></a>
# 1.1.0-beta.24 (2014-07-08)

* clean website stuffs ([399f324](https://github.com/mcasimir/mobile-angular-ui/commit/399f324))
* fix #74 ([a3c6ff0](https://github.com/mcasimir/mobile-angular-ui/commit/a3c6ff0)), closes [#74](https://github.com/mcasimir/mobile-angular-ui/issues/74)



<a name="1.1.0-beta.23"></a>
# 1.1.0-beta.23 (2014-07-06)

* added demo to bower ([c2ce776](https://github.com/mcasimir/mobile-angular-ui/commit/c2ce776))
* added demo to bower download ([076c6bb](https://github.com/mcasimir/mobile-angular-ui/commit/076c6bb))



<a name="1.1.0-beta.22"></a>
# 1.1.0-beta.22 (2014-05-25)

* 1.1.0-beta.22 ([dc0f6e9](https://github.com/mcasimir/mobile-angular-ui/commit/dc0f6e9))
* added ngClass and $apply to switch-directive's template to stay in sync with ngModel ([70ecf8f](https://github.com/mcasimir/mobile-angular-ui/commit/70ecf8f))
* deleted iScroll stuffs ([a7e4d49](https://github.com/mcasimir/mobile-angular-ui/commit/a7e4d49))
* fix #60, fix #64, dropped overthrow.toss.js ([d02d020](https://github.com/mcasimir/mobile-angular-ui/commit/d02d020)), closes [#60](https://github.com/mcasimir/mobile-angular-ui/issues/60) [#64](https://github.com/mcasimir/mobile-angular-ui/issues/64)
* Fix contentFor directive: Do not compile already compiled content ([259e495](https://github.com/mcasimir/mobile-angular-ui/commit/259e495))
* Fixed main path ([99c98da](https://github.com/mcasimir/mobile-angular-ui/commit/99c98da))



<a name="1.1.0-beta.21"></a>
# 1.1.0-beta.21 (2014-05-15)

* drop angular.js deps ([dea4314](https://github.com/mcasimir/mobile-angular-ui/commit/dea4314))
* fix #51, fix #54 ([095e472](https://github.com/mcasimir/mobile-angular-ui/commit/095e472)), closes [#51](https://github.com/mcasimir/mobile-angular-ui/issues/51) [#54](https://github.com/mcasimir/mobile-angular-ui/issues/54)
* Fixed malformed bower.json ([f2ed8df](https://github.com/mcasimir/mobile-angular-ui/commit/f2ed8df))
* Fixes #53 ([a9a20c7](https://github.com/mcasimir/mobile-angular-ui/commit/a9a20c7)), closes [#53](https://github.com/mcasimir/mobile-angular-ui/issues/53)



<a name="1.1.0-beta.19"></a>
# 1.1.0-beta.19 (2014-05-10)

* distribution policy changed. Base now targets xs and sm screens, while desktop is for  md and lg. Re ([98313e5](https://github.com/mcasimir/mobile-angular-ui/commit/98313e5))



<a name="1.1.0-beta.18"></a>
# 1.1.0-beta.18 (2014-05-10)

* changes for 1.1.0-beta.17 ([14b4558](https://github.com/mcasimir/mobile-angular-ui/commit/14b4558))
* fix #46, improve form style and bs-form-control behavior, responsive grid added in desktop.css ([54b8657](https://github.com/mcasimir/mobile-angular-ui/commit/54b8657)), closes [#46](https://github.com/mcasimir/mobile-angular-ui/issues/46)



<a name="1.1.0-beta.17"></a>
# 1.1.0-beta.17 (2014-05-06)

* Fix #45, Fix #42. Moving from coffee to js. Refactoring code. ([2e449fd](https://github.com/mcasimir/mobile-angular-ui/commit/2e449fd)), closes [#45](https://github.com/mcasimir/mobile-angular-ui/issues/45) [#42](https://github.com/mcasimir/mobile-angular-ui/issues/42)



<a name="1.1.0-beta.16"></a>
# 1.1.0-beta.16 (2014-05-03)

* ignore crash.log and Gemfile.lock for site ([09f9cc1](https://github.com/mcasimir/mobile-angular-ui/commit/09f9cc1))
* reverted scrollable to be css based. Fix #44, fix #30, fix #36 ([bbf31da](https://github.com/mcasimir/mobile-angular-ui/commit/bbf31da)), closes [#44](https://github.com/mcasimir/mobile-angular-ui/issues/44) [#30](https://github.com/mcasimir/mobile-angular-ui/issues/30) [#36](https://github.com/mcasimir/mobile-angular-ui/issues/36)



<a name="1.1.0-beta.15"></a>
# 1.1.0-beta.15 (2014-05-01)

* default value for overlays; build process improvements; website and docs improvements ([39c791c](https://github.com/mcasimir/mobile-angular-ui/commit/39c791c))



<a name="1.1.0-beta.14"></a>
# 1.1.0-beta.14 (2014-04-30)

* added default state for overlays ([a17be42](https://github.com/mcasimir/mobile-angular-ui/commit/a17be42))



<a name="1.1.0-beta.13"></a>
# 1.1.0-beta.13 (2014-04-30)

* add default state of overlay ([e585d2b](https://github.com/mcasimir/mobile-angular-ui/commit/e585d2b)), closes [#37](https://github.com/mcasimir/mobile-angular-ui/issues/37)
* added default state for overlays ([1647575](https://github.com/mcasimir/mobile-angular-ui/commit/1647575))



<a name="1.1.0-beta.12"></a>
# 1.1.0-beta.12 (2014-04-29)

* re-added tooltips and modals style ([79286d0](https://github.com/mcasimir/mobile-angular-ui/commit/79286d0))



<a name="1.1.0-beta.11"></a>
# 1.1.0-beta.11 (2014-04-24)

* Fixes #19, Fixes #30. Scrollable not readjusted after window.resize ([b9e0547](https://github.com/mcasimir/mobile-angular-ui/commit/b9e0547)), closes [#19](https://github.com/mcasimir/mobile-angular-ui/issues/19) [#30](https://github.com/mcasimir/mobile-angular-ui/issues/30)



<a name="1.1.0-beta.10"></a>
# 1.1.0-beta.10 (2014-04-20)

* Fix css for panel-group headers ([612f5d7](https://github.com/mcasimir/mobile-angular-ui/commit/612f5d7))



<a name="1.1.0-beta.9"></a>
# 1.1.0-beta.9 (2014-04-20)

* Switch transition delayed to avoid flikering on default true ([5fbe670](https://github.com/mcasimir/mobile-angular-ui/commit/5fbe670))



<a name="1.1.0-beta.8"></a>
# 1.1.0-beta.8 (2014-04-19)

* Fixed odd behaviours combining position:absolute and transform3d; Added switch component; Added dona ([8ed7d65](https://github.com/mcasimir/mobile-angular-ui/commit/8ed7d65))
* references #21 of the original repository. a directive looks wrong ([0a11917](https://github.com/mcasimir/mobile-angular-ui/commit/0a11917))



<a name="1.1.0-beta.7"></a>
# 1.1.0-beta.7 (2014-04-04)

* move toggle.toggled to be fired after classes are applied ([ed25983](https://github.com/mcasimir/mobile-angular-ui/commit/ed25983))



<a name="1.1.0-beta.6"></a>
# 1.1.0-beta.6 (2014-04-04)

* fixes #18 ([da36fdf](https://github.com/mcasimir/mobile-angular-ui/commit/da36fdf)), closes [#18](https://github.com/mcasimir/mobile-angular-ui/issues/18)



<a name="1.1.0-beta.5"></a>
# 1.1.0-beta.5 (2014-04-03)

* fixes #15 ([0f8b5ab](https://github.com/mcasimir/mobile-angular-ui/commit/0f8b5ab)), closes [#15](https://github.com/mcasimir/mobile-angular-ui/issues/15)



<a name="1.1.0-beta.4"></a>
# 1.1.0-beta.4 (2014-03-10)

* Added carousels; ([55eb6d3](https://github.com/mcasimir/mobile-angular-ui/commit/55eb6d3))
* demo improvements ([f8eb120](https://github.com/mcasimir/mobile-angular-ui/commit/f8eb120))
* demo improvements ([f259ba2](https://github.com/mcasimir/mobile-angular-ui/commit/f259ba2))
* demo improvements ([f3f4319](https://github.com/mcasimir/mobile-angular-ui/commit/f3f4319))



<a name="1.1.0-beta.3"></a>
# 1.1.0-beta.3 (2014-03-08)

* Scrollables now autosizing with overthrow ([e8adab4](https://github.com/mcasimir/mobile-angular-ui/commit/e8adab4))



<a name="1.1.0-beta.2"></a>
# 1.1.0-beta.2 (2014-03-08)

* Smoother transitions for sidebars ([57e6cdb](https://github.com/mcasimir/mobile-angular-ui/commit/57e6cdb))



<a name="1.1.0-beta.1"></a>
# 1.1.0-beta.1 (2014-03-08)

* Fixed release task ([b5e6b62](https://github.com/mcasimir/mobile-angular-ui/commit/b5e6b62))



<a name="1.1.0-beta.0"></a>
# 1.1.0-beta.0 (2014-03-08)

* fixed css for sidebars with height: auto; added task for releases ([7ad5669](https://github.com/mcasimir/mobile-angular-ui/commit/7ad5669))



<a name="1.0.21-beta"></a>
## 1.0.21-beta (2014-03-07)

* fix #10; both sidebars can now coexist; changed scrollable style, now its relative; added directives ([aa2ecdf](https://github.com/mcasimir/mobile-angular-ui/commit/aa2ecdf)), closes [#10](https://github.com/mcasimir/mobile-angular-ui/issues/10)



<a name="1.0.20-beta"></a>
## 1.0.20-beta (2014-03-06)

* reverted to overflow:auto for scrollable and overthrow ([732a792](https://github.com/mcasimir/mobile-angular-ui/commit/732a792))



<a name="1.0.19-beta"></a>
## 1.0.19-beta (2014-03-06)

* fix #9 ([8d722fd](https://github.com/mcasimir/mobile-angular-ui/commit/8d722fd)), closes [#9](https://github.com/mcasimir/mobile-angular-ui/issues/9)



<a name="1.0.18-beta"></a>
## 1.0.18-beta (2014-03-06)

* fix #8: body with overflow:auto; also fixes some other desktop related issues. ([52d71e8](https://github.com/mcasimir/mobile-angular-ui/commit/52d71e8)), closes [#8](https://github.com/mcasimir/mobile-angular-ui/issues/8)



<a name="1.0.15-beta"></a>
## 1.0.15-beta (2014-03-06)

* fix #7; added implementation of scrollable based on overthrow.js; fastclick now supporting ngSwipeLe ([a00a9c1](https://github.com/mcasimir/mobile-angular-ui/commit/a00a9c1)), closes [#7](https://github.com/mcasimir/mobile-angular-ui/issues/7)



<a name="1.0.14-beta"></a>
## 1.0.14-beta (2014-03-05)

* restructured distribution to make it modular ([388f1a7](https://github.com/mcasimir/mobile-angular-ui/commit/388f1a7))



<a name="1.0.13-beta"></a>
## 1.0.13-beta (2014-03-01)

* fix duplicated overlays ([6376b3d](https://github.com/mcasimir/mobile-angular-ui/commit/6376b3d))



<a name="1.0.12-beta"></a>
## 1.0.12-beta (2014-02-28)

* updated to IScroll 5 ([8c6202e](https://github.com/mcasimir/mobile-angular-ui/commit/8c6202e))



<a name="1.0.11-beta"></a>
## 1.0.11-beta (2014-02-28)

* using translate3d to force hardware acceleration-a ([f3b2162](https://github.com/mcasimir/mobile-angular-ui/commit/f3b2162))



<a name="1.0.10-beta"></a>
## 1.0.10-beta (2014-02-27)

* fix #5 ([6db3f65](https://github.com/mcasimir/mobile-angular-ui/commit/6db3f65)), closes [#5](https://github.com/mcasimir/mobile-angular-ui/issues/5)
* reverted transform3d to test with devices ([e4dcab3](https://github.com/mcasimir/mobile-angular-ui/commit/e4dcab3))



<a name="1.0.9-beta"></a>
## 1.0.9-beta (2014-02-26)

* fix desktop sidebar with translate3d ([27153fa](https://github.com/mcasimir/mobile-angular-ui/commit/27153fa))



<a name="1.0.8-beta"></a>
## 1.0.8-beta (2014-02-26)

* fix #3 ([3fdf1c1](https://github.com/mcasimir/mobile-angular-ui/commit/3fdf1c1)), closes [#3](https://github.com/mcasimir/mobile-angular-ui/issues/3)



<a name="1.0.7-beta"></a>
## 1.0.7-beta (2014-02-24)

* fix #2 ([9933e56](https://github.com/mcasimir/mobile-angular-ui/commit/9933e56)), closes [#2](https://github.com/mcasimir/mobile-angular-ui/issues/2)
* fixed README-a ([da448db](https://github.com/mcasimir/mobile-angular-ui/commit/da448db))



<a name="1.0.6-beta"></a>
## 1.0.6-beta (2014-02-12)

* First Beta ([ceaadda](https://github.com/mcasimir/mobile-angular-ui/commit/ceaadda))



<a name="1.0.5-alpha"></a>
## 1.0.5-alpha (2014-01-07)

* Fix for iscroll and forms, validation css added ([ecac7b9](https://github.com/mcasimir/mobile-angular-ui/commit/ecac7b9))



<a name="1.0.4-alpha"></a>
## 1.0.4-alpha (2013-12-29)

* moved to iScroll ([2b714c6](https://github.com/mcasimir/mobile-angular-ui/commit/2b714c6))



<a name="1.0.3-alpha"></a>
## 1.0.3-alpha (2013-12-27)

* added site, minify by default, fixed Readme ([d9e703b](https://github.com/mcasimir/mobile-angular-ui/commit/d9e703b))
* many changes ([35e8f9b](https://github.com/mcasimir/mobile-angular-ui/commit/35e8f9b))



<a name="1.0.2-alpha"></a>
## 1.0.2-alpha (2013-12-25)

* added angular-route as dependency, renamed toggle commands ([06b6024](https://github.com/mcasimir/mobile-angular-ui/commit/06b6024))



<a name="1.0.1-alpha"></a>
## 1.0.1-alpha (2013-12-25)

* prerelease ([2cd360c](https://github.com/mcasimir/mobile-angular-ui/commit/2cd360c))



<a name="1.0.0-alpha"></a>
# 1.0.0-alpha (2013-12-25)

* added capture directives and bspanels ([9037654](https://github.com/mcasimir/mobile-angular-ui/commit/9037654))
* Cleaned up dependencies, grunt commit now committing after minify distributed assets ([38aca0d](https://github.com/mcasimir/mobile-angular-ui/commit/38aca0d))
* first complete release ([719c1eb](https://github.com/mcasimir/mobile-angular-ui/commit/719c1eb))
* Grunt Git task added ([0862a2a](https://github.com/mcasimir/mobile-angular-ui/commit/0862a2a))
* removed git hooks; added tabs; added polifil for pointer-events:none ([09e7a2c](https://github.com/mcasimir/mobile-angular-ui/commit/09e7a2c))
* switched name ([d6caeab](https://github.com/mcasimir/mobile-angular-ui/commit/d6caeab))
