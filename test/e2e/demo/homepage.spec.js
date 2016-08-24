import HomePage from './HomePage';

describe('demo', function() {
  describe('sidebar left', function() {
    it('should display the sidebar on desktop', async function() {
      let homePage = await HomePage.get();
      await homePage.resize(1200, 800);
      expect(await homePage.hasSidebarLeft()).toBe(true);
    });

    it('should not display the sidebar on mobile', async function() {
      let homePage = await HomePage.get();
      await homePage.resize(300, 800);
      expect(await homePage.hasSidebarLeft()).toBe(false);
    });
  });
});
