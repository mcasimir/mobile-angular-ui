import FormsPage from './FormsPage';

describe('demo', function() {
  describe('forms page', function() {
    it('should show "Forms" as title', async function() {
      let formsPage = await FormsPage.get();
      expect(await formsPage.heading.getText()).toBe('Forms');
    });

    it('should display me@example.com in email field', async function() {
      let formsPage = await FormsPage.get();
      expect(await formsPage.emailInput.getAttribute('value')).toBe('me@example.com');
    });

    it('should allow to enter value in email field', async function() {
      let formsPage = await FormsPage.get();
      await formsPage.emailInput.sendKeys(' something');
      expect(await formsPage.emailInput.getAttribute('value')).toBe('me@example.com something');
    });

    it('should display empty password field', async function() {
      let formsPage = await FormsPage.get();
      expect(await formsPage.passwordInput.getAttribute('value')).toBe('');
    });

    it('should allow to enter value in password field', async function() {
      let formsPage = await FormsPage.get();
      await formsPage.passwordInput.sendKeys('something');
      expect(await formsPage.passwordInput.getAttribute('value')).toBe('something');
    });

    it('should have active switch', async function() {
      let formsPage = await FormsPage.get();
      expect(await formsPage.uiSwitch.getAttribute('class')).toContain('active');
    });

    it('should switch off by tapping on switch element', async function() {
      let formsPage = await FormsPage.get();
      await browser.actions().mouseMove(formsPage.uiSwitch).click().perform();
      expect(await formsPage.uiSwitch.getAttribute('class')).not.toContain('active');
    });

    it('should switch off by tapping on switch handle', async function() {
      let formsPage = await FormsPage.get();
      await browser.actions().mouseMove(formsPage.uiSwitchHandle).click().perform();
      expect(await formsPage.uiSwitch.getAttribute('class')).not.toContain('active');
    });
  });
});
