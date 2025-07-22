import { loadHeaderFooter } from "./utils.mjs";
import ProductData from "./ProductData.mjs";

loadHeaderFooter();

document.addEventListener("DOMContentLoaded", () => {
  const dataSource = new ProductData("tents");
  const productListElement = document.querySelector(".product-list");

  function productCardTemplate(product) {
    const isDiscounted = product.FinalPrice < product.SuggestedRetailPrice;
    // Use the image path directly, removing leading '..' if present
    const imagePath = product.Image.startsWith("..") ? product.Image.replace("..", "") : product.Image;
    return `
      <li class="product-card${isDiscounted ? " discounted" : ""}">
        <a href="product_pages/index.html?product=${product.Id}">
          <img src="${imagePath}" alt="${product.NameWithoutBrand}" onerror="this.onerror=null;this.src='/images/noun_Tent_2517.svg';" style="min-height:200px;object-fit:contain;background:#f8f8f8;" />
          <h3 class="card__brand">${product.Brand?.Name || ""}</h3>
          <h2 class="card__name">${product.NameWithoutBrand}</h2>
          <p class="product-card__price">$${product.FinalPrice.toFixed(2)}
            ${isDiscounted ? `<span class="old-price">$${product.SuggestedRetailPrice.toFixed(2)}</span> <span class="discount-badge">-${Math.round(100 * (1 - product.FinalPrice / product.SuggestedRetailPrice))}%</span>` : ""}
          </p>
        </a>
      </li>
    `;
  }

  dataSource.getData().then(products => {
    productListElement.innerHTML = products.map(productCardTemplate).join("");
  });
});
