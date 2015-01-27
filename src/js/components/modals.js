/**
 * This module will provide directives to create modals and overlays components.
 * 
 * @module mobile-angular-ui.components.modals
 */
(function () {
  'use strict';
  angular.module('mobile-angular-ui.components.modals', [])

  /**
   * A directive to create modals and overlays components.
   * 
   * Modals are basically the same of Bootstrap 3 but you have to use uiState 
   * with `ngIf/uiIf` or `ngHide/uiHide` to `activate/dismiss` it.
   * 
   * By default both modals and overlay are made always showing up by 
   * css rule `.modal {display:block}`, so you can use it with 
   * `ngAnimate` and other angular directives in a simpler way.
   *
   * Overlay are a style of modal that looks more native in mobile devices providing a blurred
   * overlay as background.
   * 
   * You can create an overlay adding `.modal-overlay` class to a modal.
   * 
   * ### Note
   * 
   * For modals and overlays to cover the entire page you have to attach them 
   * as child of `body` element. To achieve this from a view is a common use for
   * `contentFor/yieldTo` directives contained from 
   * [capture module](/docs/module:mobile-angular-ui/module:core/module:capture):
   * 
   * ``` html
   * <body ng-app="myApp">
   * 
   *   <!-- ... -->
   *   <!-- Modals and Overlays -->
   *   <div ui-yield-to="modals"></div>
   * 
   * </body>
   * ```
   * 
   * Then you can wrap your modals and overlays in `contentFor`:
   * 
   * ``` html
   * <div ui-content-for="modals">
   * * <div class="modal"><!-- ... --></div>
   * </div>
   * ```
   * 
   * **Example.** Create a Modal.
   * 
   * ``` html
   * <div ui-content-for="modals">
   *   <div class="modal" ui-if="modal1" ui-state='modal1'>
   *     <div class="modal-backdrop in"></div>
   *     <div class="modal-dialog">
   *       <div class="modal-content">
   *         <div class="modal-header">
   *           <button class="close" 
   *                   ui-turn-off="modal1">&times;</button>
   *           <h4 class="modal-title">Modal title</h4>
   *         </div>
   *         <div class="modal-body">
   *           <p>Lorem ipsum ...</p>
   *         </div>
   *         <div class="modal-footer">
   *           <button ui-turn-off="modal1" class="btn btn-default">Close</button>
   *           <button ui-turn-off="modal1" class="btn btn-primary">Save changes</button>
   *         </div>
   *       </div>
   *     </div>
   *   </div>
   * </div>
   * ```
   * 
   * **Example.** Create an Overlay.
   * 
   * ``` html
   * <div ui-content-for="modals">
   *   <div class="modal modal-overlay" ui-if='modal2' ui-state='modal2'>
   *     <div class="modal-dialog">
   *       <div class="modal-content">
   *         <div class="modal-header">
   *           <button class="close"
   *                   ui-turn-off="modal2">&times;</button>
   *           <h4 class="modal-title">Modal title</h4>
   *         </div>
   *         <div class="modal-body">
   *           <p>Lorem ipsum ...</p>
   *         </div>
   *         <div class="modal-footer">
   *           <button ui-turn-off="modal2" class="btn btn-default">Close</button>
   *           <button ui-turn-off="modal2" class="btn btn-primary">Save changes</button>
   *         </div>
   *       </div>
   *     </div>
   *   </div>
   * </div>
   * ```
   * 
   * @directive modal
   * @restrict C
   */
  .directive('modal', [
    '$rootElement',
    function($rootElement) {
      return {
        restrict: 'C',
        link: function(scope, elem) {
          $rootElement.addClass('has-modal');
          elem.on('$destroy', function(){
            $rootElement.removeClass('has-modal');
          });
          scope.$on('$destroy', function(){
            $rootElement.removeClass('has-modal');
          });

          if (elem.hasClass('modal-overlay')) {
            $rootElement.addClass('has-modal-overlay');
            elem.on('$destroy', function(){
              $rootElement.removeClass('has-modal-overlay');
            });
            scope.$on('$destroy', function(){
              $rootElement.removeClass('has-modal-overlay');
            });            
          }
        }
      };
  }]);
}());