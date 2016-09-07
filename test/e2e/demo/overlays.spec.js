import OverlaysPage from './OverlaysPage';

describe('demo', function() {
  fdescribe('overlays page', function() {
    it('should show "Overlays" as title', async function() {
      let page = await OverlaysPage.get();
      expect(await page.heading.getText()).toBe('Overlays');
    });

    it('should not show a modal by default', async function() {
      let page = await OverlaysPage.get();
      expect(await page.modalDialog.isPresent()).toBe(false);
    });

    it('should show a modal by clicking on show modal', async function() {
      let page = await OverlaysPage.get();
      await browser.actions().mouseMove(page.openModalButton).click().perform();
      expect(await page.modalDialog.isDisplayed()).toBe(true);
    });

    it('should not show an overlay by default', async function() {
      let page = await OverlaysPage.get();
      expect(await page.overlayDialog.isPresent()).toBe(false);
    });

    it('should show an overlay by clicking on show overlay', async function() {
      let page = await OverlaysPage.get();
      await browser.actions().mouseMove(page.openOverlayButton).click().perform();
      expect(await page.overlayDialog.isDisplayed()).toBe(true);
    });

  });
});
