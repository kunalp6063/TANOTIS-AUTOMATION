const { test, expect } = require('@playwright/test');
const { HomePageActions } = require('../pages/HomePageActions');
const { ProductPageActions } = require('../pages/ProductPageActions');
const testData = require('../data/testData.json');

test('Navigate to Headphones and verify sort orders', async ({ page }) => {
  const home = new HomePageActions(page);
  const productPage = new ProductPageActions(page);

  await home.goToHomePage();
  expect(await home.verifyTitle(testData.expectedTitle)).toBeTruthy();

  await home.navigateToHeadphones();

  //  Sort by Price Low to High
  await productPage.openSortByDropdown();
  await productPage.selectSortOption("Price, low to high");
  await productPage.verifyPricesAreSorted("asc");

  //  Sort by Price High to Low
  await productPage.openSortByDropdown();
  await productPage.selectSortOption("Price, high to low");
  await productPage.verifyPricesAreSorted("desc");

  //  Display dropdown item count validation
await productPage.openDisplayDropdown();
await productPage.selectDisplayOption("24 per page");
await productPage.selectFirstProduct();
await productPage.addToCart();
expect(await productPage.verifyPopupVisible()).toBeTruthy();
await productPage.verifyPopupDetails("Violectric DHA V226 Headphone Amplifier, Preamp, and DAC", "239240.00");
await productPage.clickViewCart();
await productPage.verifyCartPageDetails("Violectric DHA V226 Headphone Amplifier, Preamp, and DAC", "239240.00");
await productPage.updateQuantity(2);
await productPage.verifyPriceIncrease(2);
await productPage.removeItemsAndVerifyEmpty();
await productPage.clickShopOurProducts();


});
