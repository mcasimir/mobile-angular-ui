# Provides a scrollable implementation based on Overthrow
# Many thanks to pavei (https://github.com/pavei) to submit
# basic implementation

angular.module("mobile-angular-ui.scrollable", [])

.directive "scrollable", ->
  replace: false
  restrict: "C"
  link: (scope, element, attr) ->
    console.log overthrow.support
    if(overthrow.support is "native") 
      element.attr("style", "overflow: auto; -webkit-overflow-scrolling: touch;")
    else
      element.addClass("overthrow")
      overthrow.forget()
      overthrow.set()
