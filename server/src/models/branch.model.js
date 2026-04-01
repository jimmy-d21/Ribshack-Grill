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
}

export default BranchModel;
