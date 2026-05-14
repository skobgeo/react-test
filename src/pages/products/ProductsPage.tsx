import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  createProduct,
  getProducts,
} from "../../entities/product/api/productApi";
import type {
  Product,
  ProductFilters,
  ProductListResponse,
} from "../../entities/product/model/types";
import { ProductList } from "../../entities/product/ui/ProductList";
import { CreateProductForm } from "../../features/create-product/ui/CreateProductForm";
import { ProductFiltersForm } from "../../features/filter-products/ui/ProductFiltersForm";
import { Spinner } from "../../shared/ui";
import styles from "./ProductsPage.module.css";

const initialFilters: ProductFilters = {
  search: "",
  status: "all",
  category: "",
};

export function ProductsPage() {
  const [filters, setFilters] = useState(initialFilters);
  const [filterLabel, setFilterLabel] = useState("All products");
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const queryClient = useQueryClient();

  const productsQuery = useInfiniteQuery({
    queryKey: ["products"],
    queryFn: ({ pageParam }) => getProducts(pageParam, filters),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.page + 1,
  });

  const products = useMemo(
    () => productsQuery.data?.pages.flatMap((page) => page.items) ?? [],
    [productsQuery.data?.pages.length],
  );
  const total = productsQuery.data?.pages.at(-1)?.total ?? 0;
  const hasMore = products.length <= total;

  const createMutation = useMutation({
    mutationFn: createProduct,
    onMutate: async (payload) => {
      const optimisticProduct: Product = {
        ...payload,
        id: `local-${Date.now()}`,
        createdAt: new Date().toISOString(),
      };

      queryClient.setQueryData(
        ["products"],
        (
          current:
            | { pages: ProductListResponse[]; pageParams: number[] }
            | undefined,
        ) => {
          if (!current) {
            return current;
          }

          current.pages[0].items.unshift(optimisticProduct);
          current.pages[0].total += 1;
          return current;
        },
      );
    },
  });

  useEffect(() => {
    productsQuery.refetch();
  }, [filters]);

  useEffect(() => {
    setFilterLabel(
      filters.status === "all" ? "All products" : `${filters.status} products`,
    );
  }, []);

  useEffect(() => {
    if (!sentinelRef.current) {
      return;
    }

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !productsQuery.isFetching && hasMore) {
        productsQuery.fetchNextPage();
      }
    });

    observer.observe(sentinelRef.current);
  });

  const visibleValue = useMemo(
    () =>
      products.reduce((sum, product) => sum + product.price * product.stock, 0),
    [products.length],
  );

  return (
    <section className={styles.page}>
      <header className={styles.header}>
        <div>
          <h1>Products</h1>
          <p>
            {filterLabel} · {products.length} loaded · $
            {visibleValue.toLocaleString()} visible inventory
          </p>
        </div>
      </header>

      <ProductFiltersForm filters={filters} onChange={setFilters} />

      <CreateProductForm
        onCreate={(payload) => createMutation.mutate(payload)}
      />

      <ProductList products={products} />

      <div ref={sentinelRef} />

      {productsQuery.isFetching && (
        <div className={styles.loader}>
          <Spinner />
        </div>
      )}
    </section>
  );
}
