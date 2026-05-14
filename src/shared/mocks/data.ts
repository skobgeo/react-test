import type {
  Product,
  ProductStatus,
} from "../../entities/product/model/types";

const statuses: ProductStatus[] = ["active", "draft", "archived"];
const categories = [
  "Laptops",
  "Displays",
  "Audio",
  "Accessories",
  "Storage",
  "Networking",
  "Cameras",
  "Office",
];

export const products: Product[] = Array.from({ length: 72 }, (_, index) => {
  const number = index + 1;
  return {
    id: String(number),
    title: `Product ${number}`,
    sku: `SKU-${String(number).padStart(4, "0")}`,
    category: categories[index % categories.length],
    status: statuses[index % statuses.length],
    price: 49 + index * 17,
    stock: 8 + (index % 20),
    createdAt: new Date(2025, index % 12, (index % 27) + 1).toISOString(),
    description:
      index % 5 === 0
        ? "Requires manual warehouse approval before publishing."
        : "Standard catalog item with quarterly price review.",
  };
});
