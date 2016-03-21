'use strict';

describe('core', function() {
  fdescribe('activeLinks', function() {
    var $rootScope;
    var setupActiveLinks;
    describe('run', function() {
      beforeEach(function() {
        module('mobile-angular-ui.core.activeLinks', function($provide) {
          $provide.value('setupActiveLinks', jasmine.createSpy('setupActiveLinks'));
        });

        inject(function(_$rootScope_, _setupActiveLinks_) {
          $rootScope = _$rootScope_;
          setupActiveLinks = _setupActiveLinks_;
        });
      });

      it('should call setupActiveLinks on locationChangeSuccess', function() {
        $rootScope.$broadcast('$locationChangeSuccess', {});
        expect(setupActiveLinks).toHaveBeenCalled();
      });

      it('should call setupActiveLinks on includeContentLoaded', function() {
        $rootScope.$broadcast('$includeContentLoaded', {});
        expect(setupActiveLinks).toHaveBeenCalled();
      });
    });

    describe('setupActiveLinks', function() {
      it('sets class active if link href is window.location.href', function() {
        var link = testSetupActiveLinks(
          'http://example.com/#/hello',
          'http://example.com/#/hello',
          '/hello'
        );
        expect(link.attr('class')).toContain('active');
      });
    });
  });

  function testSetupActiveLinks(linkHref, windowLocationHref, $locationUrl) {
    var setupActiveLinks;
    var fakeDocument = angular.element('<div></div>');
    var link = angular.element('<a href="' + linkHref + '"></a>');
    fakeDocument.links = [link[0]];

    module('mobile-angular-ui.core.activeLinks', function($provide) {
      $provide.value('$window', {
        location: {
          href: windowLocationHref
        },
        document: fakeDocument,
        navigator: {
          userAgent: {}
        }
      });

      $provide.value('$location', {
        url: function() {
          return $locationUrl;
        }
      });
    });

    inject(function(_setupActiveLinks_) {
      setupActiveLinks = _setupActiveLinks_;
    });
    setupActiveLinks();
    return link;
  }

});
