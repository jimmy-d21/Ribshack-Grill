import db from "../config/db.js";

class InventoryModel {
  static async findRequestById(id) {
    const { rows } = await db.query(
      `SELECT * FROM inventory_requests WHERE id = $1`,
      [id],
    );

    return rows[0];
  }

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

  static async executeApproval(requestId) {
    const client = await db.connect();
    try {
      await client.query("BEGIN");

      await client.query(
        "UPDATE inventory_requests SET status = 'Approved', updated_at = NOW() WHERE id = $1",
        [requestId],
      );

      const { rows: items } = await client.query(
        `SELECT r.branch_id, ri.product_id, ri.quantity, ri.unit_measure, ri.type 
         FROM inventory_request_items ri 
         JOIN inventory_requests r ON ri.request_id = r.id 
         WHERE ri.request_id = $1`,
        [requestId],
      );

      for (const item of items) {
        const upsertQuery = `
          INSERT INTO inventory (branch_id, product_id, current_stock_value, unit_measure, type)
          VALUES ($1, $2, $3, $4, $5)
          ON CONFLICT (branch_id, product_id) 
          DO UPDATE SET 
            current_stock_value = inventory.current_stock_value + EXCLUDED.current_stock_value,
            updated_at = NOW();
        `;
        await client.query(upsertQuery, [
          item.branch_id,
          item.product_id,
          item.quantity,
          item.unit_measure,
          item.type,
        ]);
      }

      await client.query("COMMIT");
      return true;
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  }
}

export default InventoryModel;
