import { observer } from "mobx-react-lite";
import { useEffect, useRef } from "react";
import { shipmentStore } from "../../entities/shipment/model/shipmentStore";
import { ShipmentTable } from "../../entities/shipment/ui/ShipmentTable";
import { QuickCreateShipment } from "../../features/create-shipment/ui/QuickCreateShipment";
import { ShipmentFiltersForm } from "../../features/filter-shipments/ui/ShipmentFiltersForm";
import styles from "./ShipmentsPage.module.css";

export const ShipmentsPage = observer(function ShipmentsPage() {
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    shipmentStore.loadShipments();
  }, [shipmentStore.page]);

  useEffect(() => {
    shipmentStore.filterLabel =
      shipmentStore.filters.status === "all"
        ? "All shipments"
        : `${shipmentStore.filters.status} shipments`;
  }, []);

  useEffect(() => {
    if (!sentinelRef.current) {
      return;
    }

    const observer = new IntersectionObserver(([entry]) => {
      if (
        entry.isIntersecting &&
        !shipmentStore.loading &&
        shipmentStore.hasMore
      ) {
        shipmentStore.nextPage();
      }
    });

    observer.observe(sentinelRef.current);
  });

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Shipment Control</h1>
          <p className={styles.summary}>
            {shipmentStore.filterLabel} · {shipmentStore.shipments.length}{" "}
            loaded · ${shipmentStore.visibleValue.toLocaleString()} visible
            value
          </p>
        </div>
      </header>

      <ShipmentFiltersForm
        filters={shipmentStore.filters}
        onChange={(filters) => shipmentStore.setFilters(filters)}
      />

      <QuickCreateShipment
        onCreate={(customer, destination) =>
          shipmentStore.quickCreate(customer, destination)
        }
      />

      {shipmentStore.error && (
        <div className={styles.error}>{shipmentStore.error}</div>
      )}

      <ShipmentTable
        shipments={shipmentStore.shipments}
        sort={shipmentStore.sort}
        onSort={(sort) => shipmentStore.setSort(sort)}
      />

      <div className={styles.sentinel} ref={sentinelRef} />

      {shipmentStore.loading && (
        <div className={styles.loading}>Loading shipments...</div>
      )}
    </div>
  );
});
