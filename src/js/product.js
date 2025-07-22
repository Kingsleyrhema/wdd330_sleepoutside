import { getParam } from "./utils.mjs";
import ProductData from "./ProductData.mjs";
import ProductDetails from "./ProductDetails.mjs";

const productId = getParam("product");
const category = getParam("category");
const dataSource = new ProductData();

const product = new ProductDetails(productId, dataSource, category);
product.init();
