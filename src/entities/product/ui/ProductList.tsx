import { Link } from "react-router";
import { statusTone } from "../../../pages/products/model/statusTone";
import { Badge, Card } from "../../../shared/ui";
import type { Product } from "../model/types";
import styles from "./ProductList.module.css";

type ProductListProps = {
  products: Product[];
};

export function ProductList({ products }: ProductListProps) {
  return (
    <Card className={styles.list}>
      {products.map((product, index) => (
        <Link className={styles.row} to={`/products/${product.id}`} key={index}>
          <div>
            <div className={styles.title}>{product.title}</div>
            <div className={styles.meta}>
              {product.sku} · {product.category} · {product.stock} in stock
            </div>
          </div>
          <div className={styles.summary}>
            <Badge tone={statusTone[product.status]}>{product.status}</Badge>
            <strong>${product.price.toLocaleString()}</strong>
          </div>
        </Link>
      ))}
    </Card>
  );
}
