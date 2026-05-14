import { delay, HttpResponse, http } from "msw";
import type { Product } from "../../entities/product/model/types";
import { products } from "./data";

const pageSize = 12;

export const handlers = [
  http.get("/api/products", async ({ request }) => {
    await delay(250);

    const url = new URL(request.url);
    const page = Number(url.searchParams.get("page") ?? "1");
    const search = url.searchParams.get("search")?.toLowerCase() ?? "";
    const status = url.searchParams.get("status") ?? "all";
    const category = url.searchParams.get("category")?.toLowerCase() ?? "";

    if (search.includes("break")) {
      return HttpResponse.json(
        { message: "Search service is unavailable" },
        { status: 503 },
      );
    }

    const filtered = products.filter((product) => {
      const matchesSearch =
        product.title.toLowerCase().includes(search) ||
        product.sku.toLowerCase().includes(search);
      const matchesStatus = status === "all" || product.status === status;
      const matchesCategory =
        !category || product.category.toLowerCase().includes(category);

      return matchesSearch && matchesStatus && matchesCategory;
    });

    const start = (page - 1) * pageSize;
    const items = filtered.slice(start, start + pageSize);

    return HttpResponse.json({
      items,
      page,
      pageSize,
      total: filtered.length,
    });
  }),

  http.get("/api/products/:id", async ({ params }) => {
    await delay(200);

    const product = products.find((item) => item.id === params.id);
    if (!product) {
      return HttpResponse.json(
        { message: "Product not found" },
        { status: 404 },
      );
    }

    return HttpResponse.json(product);
  }),

  http.post("/api/products", async ({ request }) => {
    await delay(300);

    const body = (await request.json()) as {
      title?: string;
      sku?: string;
      category?: string;
      status?: string;
      price?: number;
      stock?: number;
      description?: string;
    };

    if (!body.title?.trim()) {
      return HttpResponse.json(
        { message: "Title is required" },
        { status: 400 },
      );
    }

    const duplicate = products.some(
      (product) => product.sku.toLowerCase() === body.sku?.trim().toLowerCase(),
    );

    if (duplicate) {
      return HttpResponse.json(
        { message: "Product with this SKU already exists" },
        { status: 409 },
      );
    }

    const product: Product = {
      id: crypto.randomUUID(),
      title: body.title.trim(),
      sku: body.sku?.trim() || "NO-SKU",
      category: body.category?.trim() || "Unsorted",
      status:
        body.status === "draft" || body.status === "archived"
          ? body.status
          : "active",
      price: Number(body.price ?? 0),
      stock: Number(body.stock ?? 0),
      createdAt: new Date().toISOString(),
      description: body.description ?? "",
    };

    if (product.title.toLowerCase().includes("server")) {
      return HttpResponse.json(
        { message: "Backend failed while saving product" },
        { status: 500 },
      );
    }

    products.unshift(product);
    return HttpResponse.json(product, { status: 201 });
  }),

  http.patch("/api/products/:id", async ({ params, request }) => {
    await delay(350);

    const index = products.findIndex((product) => product.id === params.id);
    if (index === -1) {
      return HttpResponse.json(
        { message: "Product not found" },
        { status: 404 },
      );
    }

    const body = (await request.json()) as Record<string, unknown>;

    if (
      String(body.title ?? "")
        .toLowerCase()
        .includes("fail")
    ) {
      return HttpResponse.json(
        { message: "Backend rejected this product title" },
        { status: 500 },
      );
    }

    products[index] = {
      ...products[index],
      ...body,
      id: products[index].id,
    };

    return HttpResponse.json(products[index]);
  }),
];
