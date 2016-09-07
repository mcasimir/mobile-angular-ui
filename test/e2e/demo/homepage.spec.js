import HomePage from './HomePage';

describe('demo', function() {
  describe('home page', function() {
    it('should show "Mobile Angular UI" as title', async function() {
      let homePage = await HomePage.get();
      expect(await homePage.heading.getText()).toBe('Mobile Angular UI');
    });

    it('should load sidebar left', async function() {
      let homePage = await HomePage.get();
      expect(await homePage.sidebarLeft.isPresent()).toBe(true);
    });

    it('should display left sidebar on desktop', async function() {
      let homePage = await HomePage.get();
      await homePage.resize(1200, 800);
      expect(await homePage.sidebarLeft.isDisplayed()).toBe(true);
    });

    it('should not display left sidebar on mobile', async function() {
      let homePage = await HomePage.get();
      await homePage.resize(300, 800);
      expect(await homePage.sidebarLeft.isDisplayed()).toBe(false);
    });

    it('should not display right sidebar by default', async function() {
      let homePage = await HomePage.get();
      expect(await homePage.body.getAttribute('class')).not.toContain('sidebar-right-in');
    });

    it('should display right sidebar after clicking "toggleRightSidebarButton" button', async function() {
      let homePage = await HomePage.get();
      await homePage.resize(1200, 800);
      await browser.actions().mouseMove(homePage.toggleRightSidebarButton).click().perform();
      expect(await homePage.body.getAttribute('class')).toContain('sidebar-right-in');
    });
  });
});
