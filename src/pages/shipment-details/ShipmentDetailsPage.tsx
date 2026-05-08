import { observer } from "mobx-react-lite";
import { useEffect } from "react";
import { Link, useParams } from "react-router";
import { shipmentStore } from "../../entities/shipment/model/shipmentStore";
import { ShipmentEditForm } from "../../features/edit-shipment/ui/ShipmentEditForm";
import { Badge } from "../../shared/ui/Badge";
import { Button } from "../../shared/ui/Button";
import styles from "./ShipmentDetailsPage.module.css";

export const ShipmentDetailsPage = observer(function ShipmentDetailsPage() {
  const { shipmentId } = useParams();

  useEffect(() => {
    if (!shipmentId) {
      return;
    }

    shipmentStore.loadShipment(shipmentId);
  }, [shipmentId]);

  if (shipmentStore.loading && !shipmentStore.selectedShipment) {
    return <div className={styles.loading}>Loading shipment...</div>;
  }

  if (!shipmentStore.selectedShipment) {
    return <div className={styles.notFound}>Shipment not found</div>;
  }

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div>
          <Link className={styles.backLink} to="/">
            Back to shipments
          </Link>
          <h1 className={styles.title}>
            {shipmentStore.selectedShipment.reference}
          </h1>
          <div className={styles.meta}>
            <Badge tone={shipmentStore.selectedShipment.status}>
              {shipmentStore.selectedShipment.status.replace("_", " ")}
            </Badge>
            <span>{shipmentStore.selectedShipment.customer}</span>
          </div>
        </div>
        <Button
          type="button"
          disabled={shipmentStore.saving}
          onClick={() => shipmentStore.saveSelected()}
        >
          {shipmentStore.saving ? "Saving..." : "Save"}
        </Button>
      </header>

      <ShipmentEditForm
        shipment={shipmentStore.selectedShipment}
        onChange={(patch) => shipmentStore.updateDraft(patch)}
      />
    </div>
  );
});
