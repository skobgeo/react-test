export type ClientStatus = "active" | "paused" | "archived";

export type Client = {
  id: string;
  name: string;
  company: string;
  email: string;
  status: ClientStatus;
  revenue: number;
  createdAt: string;
  notes: string;
};

export type ClientListResponse = {
  items: Client[];
  page: number;
  pageSize: number;
  total: number;
};

export type ClientFilters = {
  search: string;
  status: "all" | ClientStatus;
};
