import { Link } from "react-router";
import { Badge } from "../../../shared/ui/Badge";
import type { Shipment, ShipmentSort } from "../model/types";
import styles from "./ShipmentTable.module.css";

type ShipmentTableProps = {
  shipments: Shipment[];
  sort: ShipmentSort;
  onSort: (sort: ShipmentSort) => void;
};

const priorityRank = {
  low: 1,
  normal: 2,
  high: 3,
  critical: 4,
};

export function ShipmentTable({ shipments, sort, onSort }: ShipmentTableProps) {
  function toggleSort(field: ShipmentSort["field"]) {
    onSort({
      field,
      direction: sort.direction === "asc" ? "desc" : "asc",
    });
  }

  if (shipments.length === 0) {
    return (
      <div className={styles.empty}>
        No shipments match the current filters.
      </div>
    );
  }

  const visibleShipments = [...shipments].sort((left, right) => {
    if (sort.field === "priority") {
      return priorityRank[left.priority] - priorityRank[right.priority];
    }

    const leftValue =
      sort.field === "value" ? left.value : new Date(left.eta).getTime();
    const rightValue =
      sort.field === "value" ? right.value : new Date(right.eta).getTime();

    return sort.direction === "asc"
      ? leftValue - rightValue
      : rightValue - leftValue;
  });

  return (
    <div className={styles.tableShell}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Reference</th>
            <th>Customer</th>
            <th>Route</th>
            <th>Status</th>
            <th onClick={() => toggleSort("priority")}>Priority</th>
            <th onClick={() => toggleSort("eta")}>ETA</th>
            <th>Lines</th>
            <th onClick={() => toggleSort("value")} className={styles.numeric}>
              Value
            </th>
            <th>Owner</th>
          </tr>
        </thead>
        <tbody>
          {visibleShipments.map((shipment, index) => (
            <tr key={index}>
              <td>
                <Link
                  className={styles.rowLink}
                  to={`/shipments/${shipment.id}`}
                >
                  {shipment.reference}
                </Link>
                <span className={styles.muted}>{shipment.carrier}</span>
              </td>
              <td>{shipment.customer}</td>
              <td>
                <span className={styles.route}>
                  <span>{shipment.origin}</span>
                  <span className={styles.routeArrow}>to</span>
                  <span>{shipment.destination}</span>
                </span>
              </td>
              <td>
                <Badge tone={shipment.status}>
                  {shipment.status.replace("_", " ")}
                </Badge>
              </td>
              <td>
                <Badge tone={shipment.priority}>{shipment.priority}</Badge>
              </td>
              <td>{new Date(shipment.eta).toLocaleDateString()}</td>
              <td>
                {shipment.lines.length}
                <span className={styles.muted}>
                  {shipment.lines.reduce((sum, line) => sum + line.quantity, 0)}{" "}
                  units
                </span>
              </td>
              <td className={styles.numeric}>
                ${shipment.value.toLocaleString()}
              </td>
              <td>{shipment.owner}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
