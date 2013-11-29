angular.module("maui.directives.tabs", [])

.directive('toggleTab',  [->
  restrict: "A"
  scope: {}
  link: (scope, elem, attrs) ->
    gid_id  = (attrs.toggleTab or attrs.target or attrs.href).split(".")
    myGid   = gid_id[0]
    myId    = gid_id[1]

    if myGid[0] is "#"
      myGid = myGid.slice(1)

    scope.$on "maui.tabs.activated", (e, gid, id) ->
      parent = elem.parent()
      if gid is myGid
        if id is myId
          elem.addClass("active")
          parent.addClass("active") unless parent.hasClass("nav-tabs")
        else
          elem.removeClass("active")
          parent.removeClass("active") unless parent.hasClass("nav-tabs")

    elem.on "click tap", (e) ->
      scope.$root.$broadcast("maui.tabs.activate", myGid, myId)
      e.preventDefault()
      false

])


.directive('tabPane',  [->
  restrict: "C"
  scope: {}
  link: (scope, elem, attrs) ->
    gid_id  = (attrs.tabPane or attrs.id).split(".")
    myGid   = gid_id[0]
    myId    = gid_id[1]

    # ensure elem gets the right style in all browsers
    # in case an expression is passed through class directive
    elem.addClass("tab-pane")

    # listen for events from tabs togglers
    scope.$on "maui.tabs.activate", (e, gid, id) ->
      if gid is myGid
        if id is myId
          elem.addClass("active")
          # Notices triggers the activation is happened
          scope.$root.$broadcast("maui.tabs.activated", myGid, myId)
        else
          elem.removeClass("active")

])

