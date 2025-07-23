const { ProductPageLocators } = require('./ProductPageLocators');
const { expect } = require('@playwright/test');
const { parsePrice } = require('../utils/priceUtil');

class ProductPageActions {
  constructor(page) {
    this.page = page;
    this.locators = new ProductPageLocators();
  }

  async openSortByDropdown() {
    const dropdown = this.page.locator(`xpath=${this.locators.sortByDropdown}`);
    await dropdown.click();
  }

  async selectSortOption(optionText) {
    const option = this.page.locator(`text=${optionText}`);
    await option.click();
    await this.page.waitForTimeout(2000); 
  }

  async verifyPricesAreSorted(order = "asc") {
    const prices = await this.page.$$eval('.productgrid--price span.price', elements =>
      elements.map(el => parseFloat(el.innerText.replace(/[₹,]/g, '')))
    );
    const sorted = [...prices].sort((a, b) => order === "asc" ? a - b : b - a);
    expect(prices).toEqual(sorted);
}

async openDisplayDropdown() {
  const dropdown = this.page.locator(`xpath=${this.locators.displayDropdown}`);
  await dropdown.click();
}

async selectDisplayOption(value) {
  const option = this.page.locator(this.locators.displayOption(value));
  await option.click();
  await this.page.waitForTimeout(3000); 
  await this.page.waitForSelector(this.locators.productCards, { timeout: 15000 });
}

async verifyItemCount(expectedCount) {
  await this.page.waitForTimeout(2000);
  return items.length === expectedCount;
}

async selectFirstProduct() {
  const firstProduct = this.page.locator("(//form[contains(@id,'product_form_id')])[1]");
  await firstProduct.scrollIntoViewIfNeeded();
  await this.page.waitForTimeout(1000);
}

async addToCart() {
  await this.page.locator(this.locators.addToCartButton).click();
  console.log(" Add to Cart button clicked");

  //  Wait for popup to appear (max 10s)
  try {
    await this.page.waitForSelector(this.locators.cartPopup, { timeout: 10000 });
    console.log(" Cart popup appeared in DOM after clicking");
  } catch (e) {
    console.log(" Cart popup did not appear in DOM after clicking Add to Cart");
  }
}

async verifyPopupVisible() {
  const popup = this.page.locator(this.locators.cartPopup);

  try {
    await this.page.waitForSelector(this.locators.cartPopup, { state: 'attached', timeout: 10000 });
    await popup.waitFor({ state: 'visible', timeout: 6000 });

    console.log("Cart popup is visible.");
    return true;

  } catch (error) {
    console.log(" Cart popup not visible or not found within timeout.");
    try {
      await this.page.screenshot({ path: "popup_debug.png", fullPage: true });
      console.log(" Debug screenshot saved: popup_debug.png");
    } catch (screenshotError) {
      console.log("Screenshot failed:", screenshotError.message);
    }
    return false;
  }
}
 async verifyPopupDetails(expectedTitle, expectedPrice) {
  await this.page.waitForSelector(this.locators.cartPopup, { timeout: 10000 });

  const titleLocator = this.page.locator(this.locators.popupProductTitle);

  //Check if title is visible
  const isTitleVisible = await titleLocator.isVisible();
  if (!isTitleVisible) {
    console.log(" Title not visible in popup. Taking screenshot...");
    await this.page.screenshot({ path: "title_not_visible.png", fullPage: true });
    throw new Error("Title not visible in cart popup");
  }

  //  Get and verify title
  const title = await titleLocator.textContent();
  console.log(" Cart popup title:", title);
  expect(title.trim()).toContain(expectedTitle);

  // Price
  const priceLocator = this.page.locator(this.locators.popupProductPrice);
  const price = await priceLocator.textContent();
  const cleanedPrice = price.replace(/[^0-9.]/g, "");
  console.log(" Cart popup price:", cleanedPrice);
  expect(cleanedPrice).toBe(expectedPrice);

  //  Quantity
const qtyLocator = this.page.locator(this.locators.popupQuantityInput);
await qtyLocator.waitFor({ state: 'visible', timeout: 5000 });
const qty = await qtyLocator.getAttribute("value");  
console.log("Cart popup quantity:", qty);
expect(Number(qty)).toBe(1);
 }
 async clickViewCart() {
    await this.page.click(this.locators.viewCartButton);
    await this.page.waitForURL(/cart/);
    console.log("Navigated to View Cart page");

}
 async verifyCartPageDetails(expectedTitle, expectedPrice) {
    await this.page.waitForSelector(this.locators.cartPageProductTitle);
    const cartTitle = await this.page.textContent(this.locators.cartPageProductTitle);
    expect(cartTitle.trim()).toContain(expectedTitle);

    const cartPrice = await this.page.textContent(this.locators.cartPagePrice);
    const cleanedCartPrice = cartPrice.replace(/[^0-9.]/g, "");
    expect(cleanedCartPrice).toBe(expectedPrice);

    const qtyValue = await this.page.getAttribute(this.locators.cartPageQuantityInput, "value");
    expect(Number(qtyValue)).toBe(1);
    console.log(" Cart page details verified");
}
async updateQuantity(newQty) {
    console.log(" Changing quantity...");
    const qtyInput = this.page.locator("td.line-item__quantity input.quantity-selector__value");
    await qtyInput.waitFor({ state: 'visible', timeout: 5000 });
    await qtyInput.fill(newQty.toString());
    await qtyInput.press('Enter');
    await this.page.waitForLoadState('networkidle');
    const qtyValue = await qtyInput.getAttribute("value");
    console.log(" Updated quantity:", qtyValue);
    expect(Number(qtyValue)).toBe(newQty);
}
//  Verify price increase after quantity change
async verifyPriceIncrease(newQty) {
    newQty = parseInt(newQty);
    console.log("Final newQty after parseInt:", newQty);

    // Unit price
    const unitPriceLocator = this.page.locator("//span[contains(@class,'line-item__price--highlight')]");
    await unitPriceLocator.waitFor({ state: 'visible', timeout: 10000 });

    const unitPriceText = await unitPriceLocator.textContent();
    const unitPrice = parsePrice(unitPriceText);
    console.log("Unit Price from cart:", unitPrice);

    // Total price
    const totalPriceLocator = this.page.locator("//td[contains(@class,'line-item__line-price table__cell--right hidden-phone')]/span");
    await totalPriceLocator.waitFor({ state: 'visible', timeout: 10000 });

    const totalPriceText = await totalPriceLocator.textContent();
    const totalPrice = parsePrice(totalPriceText);
    console.log("Updated Total Price:", totalPrice);

    // Expected price calculation
    const expectedPrice = Number((unitPrice * newQty).toFixed(2));
    console.log(`Expected Price: ${expectedPrice}, Actual Price: ${totalPrice}`);

    expect(Math.round(totalPrice)).toBe(Math.round(expectedPrice));
}

// Remove all items & verify empty cart
async removeItemsAndVerifyEmpty() {
    console.log(" Removing all items from cart...");

    const removeBtns = this.page.locator("//td[@class='line-item__quantity table__cell--center hidden-phone']//*[text()='Remove']");

    // Loop until visible remove button is found
    while (await removeBtns.filter({ hasText: 'Remove' }).first().isVisible()) {
        console.log(" Clicking Remove button...");
        await removeBtns.first().click({ force: true });

        // Wait for cart to update (AJAX or page reload)
        await this.page.waitForLoadState('networkidle');
        await this.page.waitForTimeout(1000);
    }
    // Wait for empty cart message
    await this.page.waitForSelector("//p[@class='empty-state__heading heading h1']", { timeout: 10000 });
    const emptyMsg = await this.page.textContent("//p[@class='empty-state__heading heading h1']");
    console.log(" Cart is empty:", emptyMsg);
    expect(emptyMsg).toContain("Your cart is empty");
}
// Click "Shop our products" and verify navigation
async clickShopOurProducts() {
    console.log(" Clicking on Shop our products button...");
    await this.page.click(this.locators.shopProductsButton);
    await this.page.waitForLoadState("domcontentloaded");
    expect(await this.page.url()).toContain("/collections");
    console.log("Shop our products page loaded successfully");
}
}

module.exports = { ProductPageActions };
