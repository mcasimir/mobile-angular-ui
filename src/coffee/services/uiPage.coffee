angular.module("mobile-angular-ui.services.page", [])

.factory "Page", ->
  title = ""
  title: ->
    title

  setTitle: (newTitle) ->
    title = newTitle
