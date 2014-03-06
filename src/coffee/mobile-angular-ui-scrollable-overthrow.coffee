# Provides a scrollable implementation based on Overthrow
# Many thanks to pavei (https://github.com/pavei) to submit
# basic implementation

angular.module("mobile-angular-ui.scrollable", [])

.directive "scrollable", ->
  replace: false
  restrict: "C"
  link: (scope, element, attr) ->
    if(overthrow.support is "native") 
      element.attr("style", "overflow-y: auto; -webkit-overflow-scrolling: touch;")
    else
      element.addClass("overthrow")
      overthrow.forget()
      overthrow.set()
