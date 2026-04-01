import db from "../config/db.js";

class ProductModel {
  static async findProductById(id) {
    const { rows } = await db.query("SELECT * FROM products WHERE id = $1", [
      id,
    ]);
    return rows[0];
  }

  static async createProducts(productData) {
    const { rows } = await db.query(
      "INSERT INTO products (name, category, price, description, image_url) VALUES ($1, $2, $3,$4,$5) RETURNING *",
      [
        productData.name,
        productData.category,
        productData.price,
        productData.description,
        productData.image_url,
      ],
    );
    return rows[0];
  }

  static async updateProduct(id, productData) {
    const { rows } = await db.query(
      "UPDATE products SET name = $1, category = $2, price = $3, description = $4, image_url = $5, includes_unli_rice = $6 WHERE id = $7 RETURNING *",
      [
        productData.name,
        productData.category,
        productData.price,
        productData.description,
        productData.image_url,
        productData.includes_unli_rice,
        id,
      ],
    );
    return rows[0];
  }
}

export default ProductModel;
