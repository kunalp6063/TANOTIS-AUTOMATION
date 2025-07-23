class ProductPageLocators {
  constructor() {
    this.sortByDropdown = "(//button[@class='value-picker-button'])[2]"; 
    this.displayDropdown = "(//button[@class='value-picker-button'])[1]";
    this.productCards = "//div[@class='collection']//div[contains(@class, 'card')]";
    this.displayOption = (value) => `text=${value}`;
    this.firstProduct = "(//form[contains(@action, '/cart/add')])[1]";
    this.addToCartButton = "(//form[contains(@id,'product_form_id')])[1]//button[contains(text(),'Add to cart')]";
    this.cartPopup = "//form[@id='mini-cart' and @aria-hidden='false']";
    this.cartPopup = "//form[@id='mini-cart' and @aria-hidden='false']";
    this.popupProductTitle = "//form[@id='mini-cart']//a[contains(@class, 'mini-cart__product-title')]";
    this.popupProductPrice = "//form[@id='mini-cart']//span[contains(@class, 'price')]";
    this.popupQuantityInput = "//form[@id='mini-cart']//input[contains(@class,'quantity-selector__value')]";
    this.viewCartButton = "//a[contains(@class,'button--secondary') and normalize-space(text())='View cart']";

    // Cart Page locators
    this.cartPageProductTitle = "//div[contains(@class,'line-item__meta')]//a[@class='line-item__title link text--strong']";
    this.cartPagePrice = "//div[@class='card']//span[@class='line-item__price']";
    this.cartPageQuantityInput = "//td[@class='line-item__quantity table__cell--center hidden-phone']//input[contains(@class,'quantity-selector__value')]";
    this.updateCartButton = "//input[@name='update']";
    this.removeItemButton = "(//td[@class='line-item__quantity table__cell--center hidden-phone']//*[text()='Remove']";
    this.emptyCartMessage = "//p[@class='empty-state__heading heading h1']";
    this.shopProductsButton = "//a[contains(text(),'Shop our products')]";


  }
}

module.exports = { ProductPageLocators };
