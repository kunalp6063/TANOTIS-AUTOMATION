const { HomePageLocators } = require('./HomePageLocators');

class HomePageActions {
  constructor(page) {
    this.page = page;
    this.locators = new HomePageLocators();
  }

  async goToHomePage() {
    await this.page.goto('https://www.tanotis.com');
    await this.page.waitForLoadState('domcontentloaded');
  }

  async verifyTitle(expectedTitle) {
    const actualTitle = await this.page.title();
    return actualTitle.includes(expectedTitle);
  }

  async navigateToHeadphones() {
    const menu = this.page.locator(`xpath=${this.locators.tvAndMobileMenu}`);
    const link = this.page.locator(`xpath=${this.locators.headphonesLink}`);
    
    await menu.click();
    await this.page.waitForTimeout(4000);
    await link.click({ force: true });
    await this.page.waitForTimeout(4000);
  }
}

module.exports = { HomePageActions };
