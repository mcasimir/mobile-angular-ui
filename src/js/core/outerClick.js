(function () {
   'use strict';

   var isAncestorOrSelf = function(element, target) {
     var parent = element;
     while (parent.length > 0) {
       if (parent[0] === target[0]) {
         parent = null;
         return true;
       }
       parent = parent.parent();
     }
     parent = null;
     return false;
   };

   angular.module('mobile-angular-ui.core.outerClick', [])

   .factory('bindOuterClick', [
     '$document',
     '$timeout',
     function ($document, $timeout) {
       
       return function (scope, element, outerClickFn, outerClickIf) {
         var handleOuterClick = function(event){
           if (!isAncestorOrSelf(angular.element(event.target), element)) {
             scope.$apply(function() {
               outerClickFn(scope, {$event:event});
             });
           }
         };

         var stopWatching = angular.noop;
         var t = null;

         if (outerClickIf) {
           stopWatching = scope.$watch(outerClickIf, function(value){
             $timeout.cancel(t);

             if (value) {
               // prevents race conditions 
               // activating with other click events
               t = $timeout(function(scope) {
                 $document.on('click tap', handleOuterClick);
               }, 0);

             } else {
               $document.unbind('click tap', handleOuterClick);    
             }
           });
         } else {
           $timeout.cancel(t);
           $document.on('click tap', handleOuterClick);
         }

         scope.$on('$destroy', function(){
           stopWatching();
           $document.unbind('click tap', handleOuterClick);
         });
       };
     }
   ])

   .directive('uiOuterClick', [
     'bindOuterClick', 
     '$parse',
     function(bindOuterClick, $parse){
       return {
         restrict: 'A',
         compile: function(elem, attrs) {
           var outerClickFn = $parse(attrs.uiOuterClick);
           var outerClickIf = attrs.uiOuterClickIf;
           return function(scope, elem) {
             bindOuterClick(scope, elem, outerClickFn, outerClickIf);
           };
         }
       };
     }
   ]);
}());