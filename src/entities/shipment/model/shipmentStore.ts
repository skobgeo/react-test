import { makeAutoObservable, runInAction } from "mobx";
import {
  createShipment,
  getShipment,
  getShipments,
  updateShipment,
} from "../api/shipmentApi";
import type { Shipment, ShipmentFilters, ShipmentSort } from "./types";

const defaultFilters: ShipmentFilters = {
  search: "",
  status: "all",
  priority: "all",
  delayedOnly: false,
};

const defaultSort: ShipmentSort = {
  field: "eta",
  direction: "asc",
};

export class ShipmentStore {
  shipments: Shipment[] = [];
  selectedShipment: Shipment | null = null;
  filters = defaultFilters;
  sort = defaultSort;
  page = 1;
  total = 0;
  loading = false;
  saving = false;
  error = "";
  filterLabel = "All shipments";

  constructor() {
    makeAutoObservable(this);
  }

  get hasMore() {
    return this.shipments.length <= this.total;
  }

  get visibleValue() {
    return this.shipments.reduce((sum, shipment) => sum + shipment.value, 0);
  }

  setFilters(filters: ShipmentFilters) {
    this.filters = filters;
    this.page = 1;
    this.shipments = [];
  }

  setSort(sort: ShipmentSort) {
    this.sort = sort;
    this.page = 1;
  }

  nextPage() {
    this.page = this.page + 1;
  }

  async loadShipments() {
    this.loading = true;
    this.error = "";

    try {
      const response = await getShipments(this.page, this.filters, this.sort);

      runInAction(() => {
        if (this.page === 1) {
          this.shipments = response.items;
        } else {
          this.shipments = [...this.shipments, ...response.items];
        }
        this.total = response.total;
      });
    } catch {
      runInAction(() => {
        this.error = "Could not load shipments";
      });
    } finally {
      runInAction(() => {
        this.loading = false;
      });
    }
  }

  async loadShipment(id: string) {
    this.loading = true;
    const shipment = await getShipment(id);

    runInAction(() => {
      this.selectedShipment = shipment;
      this.loading = false;
    });
  }

  updateDraft(patch: Partial<Shipment>) {
    if (!this.selectedShipment) {
      return;
    }

    this.selectedShipment = {
      ...this.selectedShipment,
      ...patch,
    };
  }

  async saveSelected() {
    if (!this.selectedShipment) {
      return;
    }

    this.saving = true;
    const updated = await updateShipment(
      this.selectedShipment.id,
      this.selectedShipment,
    );
    runInAction(() => {
      this.selectedShipment = updated;
      this.saving = false;
    });
  }

  async quickCreate(customer: string, destination: string) {
    const created = await createShipment({
      reference: `EXP-${Date.now()}`,
      customer,
      origin: "Chicago, IL",
      destination,
      carrier: "Unassigned",
      status: "draft",
      priority: "normal",
      eta: new Date().toISOString(),
      value: 0,
      owner: "Ops Desk",
      notes: "",
      lines: [],
      checkpoints: [],
    });

    this.shipments.unshift(created);
  }
}

export const shipmentStore = new ShipmentStore();
