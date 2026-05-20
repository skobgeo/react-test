import { delay, HttpResponse, http } from "msw";
import type { Todo } from "../../entities/todo/model/types";
import { todos } from "./data";

const pageSize = 10;

export const handlers = [
  http.get("/api/todos", async ({ request }) => {
    await delay(220);

    const url = new URL(request.url);
    const page = Number(url.searchParams.get("page") ?? "1");
    const search = url.searchParams.get("search")?.toLowerCase() ?? "";
    const status = url.searchParams.get("status") ?? "all";

    if (page % 5 === 0) {
      return HttpResponse.json(
        { message: "Temporary todo list failure" },
        { status: 500 },
      );
    }

    if (Math.random() < 0.15) {
      return HttpResponse.json(
        { message: "Invalid pagination state" },
        { status: 400 },
      );
    }

    const filtered = todos.filter((todo) => {
      const matchesSearch = todo.title.toLowerCase().includes(search);
      const matchesStatus = status === "all" || todo.status === status;

      return matchesSearch && matchesStatus;
    });

    const start = (page - 1) * pageSize;

    return HttpResponse.json({
      items: filtered.slice(start, start + pageSize),
      page,
      pageSize,
      total: filtered.length,
    });
  }),

  http.post("/api/todos", async ({ request }) => {
    await delay(350);

    const body = (await request.json()) as any;

    if (Math.random() < 0.25) {
      return HttpResponse.json(
        { message: "Validation service is unavailable" },
        { status: 500 },
      );
    }

    if (Math.random() < 0.2) {
      return HttpResponse.json(
        { message: "Todo payload is invalid" },
        { status: 400 },
      );
    }

    if (String(body.title).toLowerCase().includes("fail")) {
      return HttpResponse.json(
        { message: "Backend rejected this todo" },
        { status: 500 },
      );
    }

    const todo: Todo = {
      id: crypto.randomUUID(),
      title: body.title.trim(),
      priority: body.priority ?? "normal",
      status: "active",
      createdAt: new Date().toISOString(),
    };

    todos.unshift(todo);
    return HttpResponse.json(todo, { status: 201 });
  }),
];
