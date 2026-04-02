import * as adminService from "../services/admin.service.js";
import generateTokenSetCookies from "../utils/generateTokenSetCookies.js";

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    const user = await adminService.login(email, password);

    generateTokenSetCookies(res, user.id);

    res.json({ message: "Login successful", user });
  } catch (error) {
    res.status(401).json({ message: "Login Error: " + error.message });
    console.error(error);
  }
};

export const createBranch = async (req, res) => {
  try {
    const {
      name,
      city,
      region,
      manager_name,
      address,
      phone,
      status,
      username,
      password,
    } = req.body;

    // Validate input
    if (
      !name ||
      !city ||
      !region ||
      !manager_name ||
      !address ||
      !phone ||
      !status ||
      !username ||
      !password
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const branch = await adminService.createBranch({
      name,
      city,
      region,
      manager_name,
      address,
      phone,
      status,
      username,
      password,
    });

    res.status(201).json({ message: "Branch created successfully", branch });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating branch: " + error.message });
    console.error(error);
  }
};

export const updateBranch = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      city,
      region,
      manager_name,
      address,
      phone,
      status,
      password,
    } = req.body;

    // Validate input
    if (
      !name ||
      !city ||
      !region ||
      !manager_name ||
      !address ||
      !phone ||
      !status
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const branch = await adminService.updateBranch(id, {
      name,
      city,
      region,
      manager_name,
      address,
      phone,
      status,
      password,
    });

    res.json({ message: "Branch updated successfully", branch });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating branch: " + error.message });
    console.error(error);
  }
};

export const deleteBranch = async (req, res) => {
  try {
    const { id } = req.params;

    await adminService.deleteBranch(id);
    res.json({ message: "Branch deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting branch: " + error.message });
    console.error(error);
  }
};

export const createProduct = async (req, res) => {
  try {
    const { name, category, price, description, image_url } = req.body;

    // Validate input
    if (!name || !category || !price || !description || !image_url) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const product = await adminService.createProduct({
      name,
      category,
      price,
      description,
      image_url,
    });

    res.status(201).json({ message: "Product created successfully", product });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating product: " + error.message });
    console.error(error);
  }
};

export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      category,
      price,
      description,
      image_url,
      includes_unli_rice,
    } = req.body;

    if (!name || !category || !price || !description || !image_url) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const product = await adminService.updateProduct(id, {
      name,
      category,
      price,
      description,
      image_url,
      includes_unli_rice,
    });

    res.json({ message: "Product updated successfully", product });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating product: " + error.message });
    console.error(error);
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    await adminService.deleteProduct(id);
    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting product: " + error.message });
    console.error(error);
  }
};

export const getAllRequestInventory = async (req, res) => {
  try {
    const request_inventory = await adminService.getAllRequestInventory();

    res.status(200).json(request_inventory);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error getAllRequest Inventory: " + error.message });
    console.error(error);
  }
};

export const approveInventoryRequest = async (req, res) => {
  try {
    const { id } = req.params;

    // Call the static method from the class
    await adminService.approveRequestInventory(id);

    res.status(200).json({
      success: true,
      message: `Inventory Request #${id} has been approved and branch stock updated.`,
    });
  } catch (error) {
    console.error("Approve Error:", error.message);
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const declinedInventoryRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const { notes } = req.body;

    if (!notes) {
      return res.status(400).json({ message: "Please provide notes" });
    }

    await adminService.declinedRequestInventory(notes, id);

    res.status(200).json({
      success: true,
      message: "Inventory Request has been declined",
    });
  } catch (error) {
    console.error("Declined Error:", error.message);
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
