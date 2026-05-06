import type { ClientStatus } from "../../../entities/client/model/types";

export const statusColor: Record<ClientStatus, string> = {
  active: "teal",
  paused: "yellow",
  archived: "gray",
};
