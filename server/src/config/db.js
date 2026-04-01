import pg from "pg";
import ENV from "../utils/ENV.js";

const { Pool } = pg;

const db = new Pool({
  host: ENV.database.host,
  port: ENV.database.port,
  user: ENV.database.user,
  password: ENV.database.password,
  database: ENV.database.name,
});

const checkConnection = async () => {
  try {
    const client = await db.connect();
    console.log("Database connected successfully!");
    client.release();
  } catch (err) {
    console.error("Database connection failed!");
    console.error(`Reason: ${err.message}`);
  }
};

checkConnection();

export default db;
