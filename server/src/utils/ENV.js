import dotenv from "dotenv";
dotenv.config();

const ENV = {
  database: {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    name: process.env.DB_NAME,
  },
  server: {
    port: process.env.PORT || 3000,
  },
  jwtSecret: process.env.JWT_SECRET,
};

export default ENV;
