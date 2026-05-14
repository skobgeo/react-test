export type ProductStatus = "draft" | "active" | "archived";

export type Product = {
  id: string;
  title: string;
  sku: string;
  category: string;
  status: ProductStatus;
  price: number;
  stock: number;
  createdAt: string;
  description: string;
};

export type ProductListResponse = {
  items: Product[];
  page: number;
  pageSize: number;
  total: number;
};

export type ProductFilters = {
  search: string;
  status: "all" | ProductStatus;
  category: string;
};
