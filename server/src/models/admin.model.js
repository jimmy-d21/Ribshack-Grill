import db from "../config/db.js";

class AdminModel {
  // Find admin by email
  static async findByEmail(email) {
    const { rows } = await db.query(
      "SELECT * FROM admin_users WHERE email = $1",
      [email],
    );
    return rows[0];
  }

  static async findByAdminId(adminId) {
    const { rows } = await db.query("SELECT * FROM admin_users WHERE id = $1", [
      adminId,
    ]);
    return rows[0];
  }
}

export default AdminModel;
