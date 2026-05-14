import { http } from "../../../shared/api/http";
import type {
  Product,
  ProductFilters,
  ProductListResponse,
} from "../model/types";

export async function getProducts(
  page: number,
  filters: ProductFilters,
): Promise<ProductListResponse> {
  const response = await http.get<ProductListResponse>("/products", {
    params: {
      page,
      search: filters.search,
      status: filters.status,
      category: filters.category,
    },
  });

  return response.data;
}

export async function getProduct(id: string): Promise<Product> {
  const response = await http.get<Product>(`/products/${id}`);
  return response.data;
}

export async function createProduct(
  payload: Omit<Product, "id" | "createdAt">,
) {
  const response = await http.post<Product>("/products", payload);
  return response.data;
}

export async function updateProduct(id: string, payload: Partial<Product>) {
  const response = await http.patch<Product>(`/products/${id}`, payload);
  return response.data;
}
