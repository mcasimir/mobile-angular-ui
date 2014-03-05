# 
# Prevents click/tap actions on disabled elements
# Polyfills for pointer-events: none
# 

angular.module('mobile-angular-ui.pointer-events', [])

.run(['$document', ($document) -> 

  angular.element($document).on "click tap", (e) ->
    target = angular.element(e.target)
    if target.hasClass("disabled")
      e.preventDefault()
      e.stopPropagation()
      return false
    else
      return true

])