angular.module('mobile-angular-ui.directives.carousel', [])

.run(["$rootScope", ($rootScope) ->
  $rootScope.carouselPrev = (id) ->
    $rootScope.$emit("mobile-angular-ui.carousel.prev", id)

  $rootScope.carouselNext = (id) ->
    $rootScope.$emit("mobile-angular-ui.carousel.next", id)

  carouselItems = (id) ->
    elem = angular.element(document.getElementById(id))
    angular.element(elem.children()[0]).children()

  findActiveItemIndex = (items) ->
    idx = -1
    found = false
    for item in items
      idx += 1
      if angular.element(item).hasClass('active')
        found = true
        break

    if found then idx else -1

  $rootScope.$on "mobile-angular-ui.carousel.prev", (e, id) ->
    items = carouselItems(id)
    idx = findActiveItemIndex(items)
    lastIdx = items.length - 1
    
    if idx != -1
      angular.element(items[idx]).removeClass("active")

    if idx <= 0
      angular.element(items[lastIdx]).addClass("active")
    else
      angular.element(items[idx - 1]).addClass("active")

  $rootScope.$on "mobile-angular-ui.carousel.next", (e, id) ->
    items = carouselItems(id)
    idx = findActiveItemIndex(items)
    lastIdx = items.length - 1
    
    if idx != -1
      angular.element(items[idx]).removeClass("active")
  
    if idx == lastIdx
      angular.element(items[0]).addClass("active")
    else
      angular.element(items[idx + 1]).addClass("active")

  ])
