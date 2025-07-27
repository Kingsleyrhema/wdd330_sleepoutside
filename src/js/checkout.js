import { loadHeaderFooter } from "./utils.mjs";
import CheckoutProcess from "./CheckoutProcess.mjs";

loadHeaderFooter();

const checkout = new CheckoutProcess("so-cart", "");
checkout.init();

const form = document.getElementById("checkout-form");
const zipInput = document.getElementById("zip");

// Calculate order total when zip is entered (as specified in instructions)
if (zipInput) {
  zipInput.addEventListener("blur", () => {
    checkout.calculateOrderTotal();
  });
}

if (form) {
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    checkout.calculateOrderTotal();
    try {
      await checkout.checkout(form);
      // Success: user is redirected to success page in CheckoutProcess
    } catch (err) {
      // Error is already handled by alertMessage in CheckoutProcess
    }
  });
} 