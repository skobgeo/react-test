import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, useParams } from "react-router";
import {
  getProduct,
  updateProduct,
} from "../../entities/product/api/productApi";
import type { Product } from "../../entities/product/model/types";
import { ProductEditForm } from "../../features/edit-product/ui/ProductEditForm";
import { Badge, Button, Spinner } from "../../shared/ui";
import { statusTone } from "../products/model/statusTone";
import styles from "./ProductDetailsPage.module.css";

export function ProductDetailsPage() {
  const { productId } = useParams();
  const queryClient = useQueryClient();

  const productQuery = useQuery({
    queryKey: ["product", productId],
    queryFn: () => getProduct(productId ?? ""),
  });

  const updateMutation = useMutation({
    mutationFn: (product: Product) => updateProduct(product.id, product),
    onMutate: async (product) => {
      queryClient.setQueryData(["product", product.id], product);
    },
  });

  const product = productQuery.data;

  function handleSave() {
    if (!product) {
      return;
    }

    updateMutation.mutate(product);
  }

  if (productQuery.isLoading) {
    return (
      <div className={styles.center}>
        <Spinner />
      </div>
    );
  }

  if (!product) {
    return <p>Product not found</p>;
  }

  return (
    <section className={styles.page}>
      <header className={styles.header}>
        <div>
          <Link to="/" className={styles.back}>
            Back to products
          </Link>
          <h1>{product.title}</h1>
          <Badge tone={statusTone[product.status]}>{product.status}</Badge>
        </div>
        <Button loading={updateMutation.isPending} onClick={handleSave}>
          Save
        </Button>
      </header>

      <ProductEditForm
        product={product}
        onChange={(nextProduct) =>
          queryClient.setQueryData(["product", product.id], nextProduct)
        }
      />
    </section>
  );
}
