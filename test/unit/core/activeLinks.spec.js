'use strict';

describe('core', function() {
  describe('activeLinks', function() {
    let $rootScope;
    let setupActiveLinks;
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
      it('sets active if link href matches with $location.path()', function() {
        let link = testSetupActiveLinks('#/hello', '/hello');
        expect(link.attr('class')).toContain('active');
      });

      it('sets active if link href matches with $location.path() with a hashbang hashPrefix', function() {
        let link = testSetupActiveLinks('#!/hello', '/hello', false, '!');
        expect(link.attr('class')).toContain('active');
      });

      it('sets active if link href matches with $location.path() with a custom hashPrefix', function() {
        let link = testSetupActiveLinks('#@/hello', '/hello', false, '@');
        expect(link.attr('class')).toContain('active');
      });

      it('removes active if hashPrefix is present but not configured', function() {
        let link = testSetupActiveLinks('#!/hello', '/hello');
        expect(link.attr('class')).not.toContain('active');
      });

      it('removes active if hashPrefix does not match', function() {
        let link = testSetupActiveLinks('#!/hello', '/hello', false, '@');
        expect(link.attr('class')).not.toContain('active');
      });

      it('sets active if link href matches with $location.path() except hash', function() {
        let link = testSetupActiveLinks('#/hello#abc', '/hello');
        expect(link.attr('class')).toContain('active');
      });

      it('sets active if link href matches with $location.path() except query string', function() {
        let link = testSetupActiveLinks('#/hello?abc', '/hello');
        expect(link.attr('class')).toContain('active');
      });

      it('removes active if link href is not $location.path()', function() {
        let link = testSetupActiveLinks('#/hello', '/hi');
        expect(link.attr('class')).not.toContain('active');
      });

      it('removes active if link href is subset of $location.path()', function() {
        let link = testSetupActiveLinks('#/hello', '/helloworld');
        expect(link.attr('class')).not.toContain('active');
      });

      it('removes active if link href is superset of $location.path()', function() {
        let link = testSetupActiveLinks('#/helloworld', '/hello');
        expect(link.attr('class')).not.toContain('active');
      });

      it('removes active if href is null', function() {
        let link = testSetupActiveLinks(null, '/hello');
        expect(link.attr('class')).not.toContain('active');
      });

      it('removes active if href is relative', function() {
        let link = testSetupActiveLinks('hello', '/hello');
        expect(link.attr('class')).not.toContain('active');
      });

      it('removes active if href is plain hash', function() {
        let link = testSetupActiveLinks('#hello', '/hello');
        expect(link.attr('class')).not.toContain('active');
      });

      it('removes active if href matches $location.path() but html5Mode is disabled and hashbang is not present', function() {
        let link = testSetupActiveLinks('/hello', '/hello');
        expect(link.attr('class')).not.toContain('active');
      });

      it('should set active if link href matches $location.path() and html5Mode is enabled', function() {
        let link = testSetupActiveLinks('/hello', '/hello', true);
        expect(link.attr('class')).toContain('active');
      });

      it('removes active if link href matches current url but has hashbang and html5Mode is enabled', function() {
        let link = testSetupActiveLinks('#/hello', '/hello', true);
        expect(link.attr('class')).not.toContain('active');
      });
    });
  });

  function testSetupActiveLinks(linkHref, $locationUrl, html5Mode, hashPrefix) {
    let setupActiveLinks;
    let link;
    if (linkHref) {
      link = angular.element('<a href="' + linkHref + '" class="active"></a>');
    } else {
      link = angular.element('<a class="active"></a>');
    }

    let fakeDocument = [{
      links: [
        link[0]
      ]
    }];

    module('mobile-angular-ui.core.activeLinks', function($provide) {
      $provide.value('$document', fakeDocument);

      $provide.value('$location', {
        path: function() {
          return $locationUrl;
        }
      });
    });

    angular.module('mobile-angular-ui.core.activeLinks').config(function($locationProvider) {
      $locationProvider.html5Mode(Boolean(html5Mode));
      $locationProvider.hashPrefix(hashPrefix || '');
    });

    inject(function(_setupActiveLinks_) {
      setupActiveLinks = _setupActiveLinks_;
    });
    setupActiveLinks();
    return link;
  }

});
