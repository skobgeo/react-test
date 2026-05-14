import type { ProductStatus } from "../../../entities/product/model/types";

export const statusTone: Record<ProductStatus, "green" | "yellow" | "gray"> = {
  active: "green",
  draft: "yellow",
  archived: "gray",
};
