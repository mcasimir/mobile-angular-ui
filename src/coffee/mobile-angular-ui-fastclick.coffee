# 
# Prevents click/tap actions on disabled elements
# Polyfills for pointer-events: none
# 

angular.module('mobile-angular-ui.fastclick', [])

.run(['$window', '$document', ($window, $document) -> 

  $window.addEventListener "load", (->
    FastClick.attach $document[0].body
  ), false

])