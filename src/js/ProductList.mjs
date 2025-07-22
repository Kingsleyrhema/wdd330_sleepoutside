export default class ProductList {
  constructor(category, dataSource, listElement) {
    this.category = category;
    this.dataSource = dataSource;
    this.listElement = listElement;
  }

  productCardTemplate(product) {
    const isDiscounted = product.FinalPrice < product.SuggestedRetailPrice;
    // Use Image for the product image
    const imagePath = product.Image || "/images/noun_Tent_2517.svg";
    return `
      <li class="product-card${isDiscounted ? " discounted" : ""}">
        <a href="../product_pages/index.html?product=${product.Id}&category=${this.category}">
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

  async init() {
    const list = await this.dataSource.getData(this.category);
    this.listElement.innerHTML = list.map(this.productCardTemplate.bind(this)).join("");
  }
}
