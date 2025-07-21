import { setLocalStorage, getLocalStorage, getParam } from "./utils.mjs";
import ProductData from "./ProductData.mjs";

export default class ProductDetails {
  constructor(productId, dataSource) {
    this.productId = productId;
    this.product = {};
    this.dataSource = dataSource;
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
    document.getElementById("price").textContent = `$${this.product.ListPrice}`;
    document.getElementById("color").textContent = this.product.Color || "";
    document.getElementById("description").textContent = this.product.Description || "";
  }
}

// Bootstrap the page if loaded directly
const productId = getParam("product");
if (productId) {
  const dataSource = new ProductData("tents");
  const product = new ProductDetails(productId, dataSource);
  product.init();
} 