import { getLocalStorage, setLocalStorage, alertMessage } from "./utils.mjs";
import ExternalServices from "./ExternalServices.mjs";

export default class CheckoutProcess {
  constructor(key, outputSelector) {
    this.key = key;
    this.outputSelector = outputSelector;
    this.list = [];
    this.itemTotal = 0;
    this.shipping = 0;
    this.tax = 0;
    this.orderTotal = 0;
    this.services = new ExternalServices();
  }

  init() {
    this.list = getLocalStorage(this.key) || [];
    console.log("Cart items:", this.list);
    this.calculateItemSubTotal();
    this.calculateOrderTotal();
  }

  calculateItemSubTotal() {
    this.itemTotal = this.list.reduce((sum, item) => {
      const quantity = item.quantity || 1;
      return sum + ((item.FinalPrice || 0) * quantity);
    }, 0);
    console.log("Item total calculated:", this.itemTotal);
    const subtotal = document.querySelector("#subtotal");
    if (subtotal) subtotal.innerText = `$${this.itemTotal.toFixed(2)}`;
  }

  calculateOrderTotal() {
    this.tax = this.itemTotal * 0.06;
    this.shipping = this.list.length > 0 ? 10 + (this.list.length - 1) * 2 : 0;
    this.orderTotal = this.itemTotal + this.tax + this.shipping;
    console.log("Calculations:", { itemTotal: this.itemTotal, tax: this.tax, shipping: this.shipping, orderTotal: this.orderTotal });
    this.displayOrderTotals();
  }

  displayOrderTotals() {
    const tax = document.querySelector("#tax");
    const shipping = document.querySelector("#shipping");
    const orderTotal = document.querySelector("#order-total");
    if (tax) tax.innerText = `$${this.tax.toFixed(2)}`;
    if (shipping) shipping.innerText = `$${this.shipping.toFixed(2)}`;
    if (orderTotal) orderTotal.innerText = `$${this.orderTotal.toFixed(2)}`;
  }

  packageItems(items) {
    return items.map(item => ({
      id: item.Id || item.id,
      name: item.Name || item.name,
      price: item.FinalPrice || item.price,
      quantity: item.quantity || 1
    }));
  }

  async checkout(form) {
    try {
      const formData = new FormData(form);
      const order = {};
      formData.forEach((value, key) => {
        order[key] = value;
      });
      order.orderDate = new Date().toISOString();
      order.orderTotal = this.orderTotal.toFixed(2);
      order.tax = this.tax.toFixed(2);
      order.shipping = this.shipping;
      order.items = this.packageItems(this.list);
      const response = await this.services.checkout(order);
      // Success: clear cart and redirect
      setLocalStorage(this.key, []);
      window.location.href = "/checkout/success.html";
      return response;
    } catch (err) {
      // Show error message using alertMessage
      let msg = "An error occurred.";
      if (err && err.name === "servicesError" && err.message) {
        if (typeof err.message === "object") {
          msg = Object.values(err.message).join("<br>");
        } else {
          msg = err.message;
        }
      } else if (err && err.message) {
        msg = err.message;
      }
      alertMessage(msg);
      throw err;
    }
  }
} 