import { setLocalStorage, getLocalStorage, getParam, loadHeaderFooter } from "./utils.mjs";
import ProductData from "./ProductData.mjs";

loadHeaderFooter();

export default class ProductDetails {
  constructor(productId, dataSource, category) {
    this.productId = productId;
    this.product = {};
    this.dataSource = dataSource;
    this.category = category;
  }

  async init() {
    // Fetch product details
    this.product = await this.dataSource.findProductById(this.productId);
    this.renderProductDetails();
    // Add event listener for Add to Cart
    document.getElementById("addToCart")
      .addEventListener("click", this.addProductToCart.bind(this));
  }

  addProductToCart() {
    let cart = getLocalStorage("so-cart") || [];
    cart.push(this.product);
    setLocalStorage("so-cart", cart);
    alert("Added to cart!");
  }

  renderProductDetails() {
    if (!this.product) return;
    document.getElementById("brand").textContent = (this.product.Brand && this.product.Brand.Name) ? this.product.Brand.Name : "";
    document.getElementById("name").textContent = this.product.NameWithoutBrand || "";
    document.getElementById("image").src = this.product.Image;
    document.getElementById("image").alt = this.product.NameWithoutBrand || "Product Image";
    document.getElementById("image").onerror = function() { this.onerror=null; this.src='/images/noun_Tent_2517.svg'; };
    document.getElementById("price").textContent = `$${this.product.FinalPrice.toFixed(2)}`;
    document.getElementById("color").textContent = this.product.Color || "";
    document.getElementById("description").textContent = this.product.Description || "";

    // Discount indicator
    const discountDiv = document.getElementById("discount-indicator");
    if (this.product.FinalPrice < this.product.SuggestedRetailPrice) {
      const percent = Math.round(100 * (1 - this.product.FinalPrice / this.product.SuggestedRetailPrice));
      discountDiv.innerHTML = `<span class="old-price">$${this.product.SuggestedRetailPrice.toFixed(2)}</span> <span class="discount-badge">-${percent}%</span>`;
    } else {
      discountDiv.innerHTML = "";
    }
  }
}
