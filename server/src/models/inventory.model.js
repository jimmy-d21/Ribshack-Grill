import db from "../config/db.js";

class InventoryModel {
  static async getAllInventoryRequest() {
    const query = `
      SELECT 
        r.id AS request_id,
        b.name AS branch_name,
        r.priority,
        r.status,
        r.created_at AS request_date,
        r.notes,
        JSONB_AGG(
          JSONB_BUILD_OBJECT(
            'item_id', ri.id,
            'product_name', p.name,
            'quantity', ri.quantity,
            'unit_measure', ri.unit_measure
          )
        ) AS items
      FROM inventory_requests r
      JOIN branches b ON r.branch_id = b.id
      JOIN inventory_request_items ri ON r.id = ri.request_id
      JOIN products p ON ri.product_id = p.id
      GROUP BY r.id, b.name
      ORDER BY r.created_at DESC;
    `;

    const { rows } = await db.query(query);
    return rows;
  }
}

export default InventoryModel;
