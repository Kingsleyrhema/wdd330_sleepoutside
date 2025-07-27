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
    
    // Check if item already exists in cart
    const existingItemIndex = cart.findIndex(item => item.Id === this.product.Id);
    
    if (existingItemIndex !== -1) {
      // Item exists, increment quantity
      if (!cart[existingItemIndex].quantity) {
        cart[existingItemIndex].quantity = 1;
      }
      cart[existingItemIndex].quantity += 1;
      alert(`Quantity updated! Now have ${cart[existingItemIndex].quantity} of this item in cart.`);
    } else {
      // Item doesn't exist, add it with quantity 1
      this.product.quantity = 1;
      cart.push(this.product);
      alert("Added to cart!");
    }
    
    setLocalStorage("so-cart", cart);
    
    // update cart count (total items including quantities)
    const cartCount = cart.reduce((total, item) => total + (item.quantity || 1), 0);
    const cartCountElement = document.querySelector(".cart-count");
    if (cartCountElement) {
      cartCountElement.textContent = cartCount;
    }
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
