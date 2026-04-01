import db from "../config/db.js";

class BranchModel {
  static async createBranch(branchData) {
    const { rows } = await db.query(
      "INSERT INTO branches (name, city, region, manager_name, address, phone, status, username, password) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *",
      [
        branchData.name,
        branchData.city,
        branchData.region,
        branchData.manager_name,
        branchData.address,
        branchData.phone,
        branchData.status,
        branchData.username,
        branchData.password,
      ],
    );
    return rows[0];
  }

  static async updateBranchWithPassword(id, branchData) {
    const { rows } = await db.query(
      "UPDATE branches SET name = $1, city = $2, region = $3, manager_name = $4, address = $5, phone = $6, status = $7, password = $8 WHERE id = $9 RETURNING *",
      [
        branchData.name,
        branchData.city,
        branchData.region,
        branchData.manager_name,
        branchData.address,
        branchData.phone,
        branchData.status,
        branchData.password,
        id,
      ],
    );
    return rows[0];
  }

  static async updateBranchWithoutPassword(id, branchData) {
    const { rows } = await db.query(
      "UPDATE branches SET name = $1, city = $2, region = $3, manager_name = $4, address = $5, phone = $6, status = $7 WHERE id = $8 RETURNING *",
      [
        branchData.name,
        branchData.city,
        branchData.region,
        branchData.manager_name,
        branchData.address,
        branchData.phone,
        branchData.status,
        id,
      ],
    );
    return rows[0];
  }
}

export default BranchModel;
