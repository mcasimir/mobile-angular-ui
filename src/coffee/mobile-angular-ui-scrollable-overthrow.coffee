# Provides a scrollable implementation based on Overthrow
# Many thanks to pavei (https://github.com/pavei) to submit
# basic implementation

angular.module("mobile-angular-ui.scrollable", [])

.directive( "scrollableContent", [ ->
    replace: false
    restrict: "C"
    link: (scope, element, attr) ->
      if(overthrow.support isnt "native") 
        element.addClass("overthrow")
        overthrow.forget()
        overthrow.set()
])
