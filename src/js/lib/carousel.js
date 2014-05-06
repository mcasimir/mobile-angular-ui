angular.module('mobile-angular-ui.directives.carousel', [])

.run(["$rootScope", function($rootScope) {
    
    $rootScope.carouselPrev = function(id) {
      $rootScope.$emit("mobile-angular-ui.carousel.prev", id);
    };
    
    $rootScope.carouselNext = function(id) {
      $rootScope.$emit("mobile-angular-ui.carousel.next", id);
    };
    
    var carouselItems = function(id) {
      var elem = angular.element(document.getElementById(id));
      var res = angular.element(elem.children()[0]).children();
      elem = null;
      return res;
    };

    var findActiveItemIndex = function(items) {
      var idx = -1;
      var found = false;

      for (var _i = 0; _i < items.length; _i++) {
        item = items[_i];
        idx += 1;
        if (angular.element(item).hasClass('active')) {
          found = true;
          break;
        }
      }

      if (found) {
        return idx;
      } else {
        return -1;
      }

    };

    $rootScope.$on("mobile-angular-ui.carousel.prev", function(e, id) {
      var items = carouselItems(id);
      var idx = findActiveItemIndex(items);
      var lastIdx = items.length - 1;

      if (idx !== -1) {
        angular.element(items[idx]).removeClass("active");
      }

      if (idx <= 0) {
        angular.element(items[lastIdx]).addClass("active");
      } else {
        angular.element(items[idx - 1]).addClass("active");
      }

      items = null;
      idx = null;
      lastIdx = null;
    });

    $rootScope.$on("mobile-angular-ui.carousel.next", function(e, id) {
      var items = carouselItems(id);
      var idx = findActiveItemIndex(items);
      var lastIdx = items.length - 1;
      
      if (idx !== -1) {
        angular.element(items[idx]).removeClass("active");
      }
      
      if (idx === lastIdx) {
        angular.element(items[0]).addClass("active");
      } else {
        angular.element(items[idx + 1]).addClass("active");
      }
      
      items = null;
      idx = null;
      lastIdx = null;
    });
  }
]);
