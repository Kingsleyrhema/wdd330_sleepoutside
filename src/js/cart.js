import { getLocalStorage, loadHeaderFooter } from "./utils.mjs";

loadHeaderFooter();

function renderCartContents() {
  const cartItems = getLocalStorage("so-cart") || [];
  const htmlItems = cartItems.map((item) => cartItemTemplate(item));
  document.querySelector(".product-list").innerHTML = htmlItems.join("");
  
  // Calculate and display total (including quantities)
  const total = cartItems.reduce((sum, item) => {
    const quantity = item.quantity || 1;
    return sum + ((item.FinalPrice || 0) * quantity);
  }, 0);
  const totalElement = document.getElementById("cart-total");
  if (totalElement) {
    totalElement.textContent = `Total: $${total.toFixed(2)}`;
  }
  
  // Dispatch event for live cart count updates
  window.dispatchEvent(new Event("cart-updated"));
}

function cartItemTemplate(item) {
  // Use the image path directly, removing leading '..' if present
  const imagePath = item.Image && item.Image.startsWith("..") ? item.Image.replace("..", "") : item.Image;
  const quantity = item.quantity || 1;
  const itemTotal = (item.FinalPrice || 0) * quantity;
  
  const newItem = `<li class="cart-card divider">
  <a href="#" class="cart-card__image">
    <img
      src="${imagePath}"
      alt="${item.Name}"
      onerror="this.onerror=null;this.src='/images/noun_Tent_2517.svg';"
      style="min-height:120px;object-fit:contain;background:#f8f8f8;"
    />
  </a>
  <a href="#">
    <h2 class="card__name">${item.Name}</h2>
  </a>
  <p class="cart-card__color">${item.Colors[0].ColorName}</p>
  <p class="cart-card__quantity">qty: ${quantity}</p>
  <p class="cart-card__price">$${itemTotal.toFixed(2)}</p>
</li>`;

  return newItem;
}

renderCartContents();
