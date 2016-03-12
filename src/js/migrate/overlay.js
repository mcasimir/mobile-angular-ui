(function() {
  'use strict';
  var module = angular.module('mobile-angular-ui.migrate.overlay', []);
  module.directive('overlay', ['$compile', function($compile) {

    return {
      compile: function(tElem) {
        var rawContent = tElem.html();
        tElem.remove();

        return function postLink(scope, elem, attrs) {
          var active = '';
          var body = rawContent;
          var id = attrs.overlay;

          if (attrs['default']) {
            active = 'default=\'' + attrs['default'] + '\'';
          }

          var html = '<div class="overlay" id="' + id + '"' +
            ' toggleable ' + active + ' active-class="overlay-show">' +
            '<div class="overlay-inner">' +
            '<div class="overlay-background"></div>' +
            '<a href="#' + id + '" toggle="off" class="overlay-dismiss">' +
            '<i class="fa fa-times-circle-o"></i>' +
            '</a>' +
            '<div class="overlay-content">' +
            '<div class="overlay-body">' +
            '' + body + '' +
            '</div>' +
            '</div>' +
            '</div>' +
            '</div>';

          var sameId = angular.element(document.getElementById(id));

          if (sameId.length > 0 && sameId.hasClass('overlay')) {
            sameId.remove();
          }

          body = angular.element(document.body);
          body.prepend($compile(html)(scope));

          if (attrs['default'] === 'active') {
            body.addClass('overlay-in');
          }
        };
      }
    };

  }]);
}());
