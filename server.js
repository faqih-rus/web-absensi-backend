require('dotenv').config();
const express = require("express");
const cors = require("cors");
const port = 8000;

// Database
const sequelize = require("./db.config");
sequelize.sync().then(() => console.log("Database ready")).catch((err) => console.error("Unable to connect to the database:", err));

// Endpoint
const userEndpoint = require("./routes/usersRoutes");
const absensiEndpoint = require("./routes/absensiRoutes");

// Inisialisasi express
const app = express();
app.use(cors({
  origin: 'http://localhost:3000', 
  methods: 'GET,POST,PUT,DELETE',
  allowedHeaders: 'Content-Type,Authorization',
}));
app.use(express.json());

app.use("/users", userEndpoint);
app.use("/absensi", absensiEndpoint);

app.listen(port, () => {
  console.log(`Running server on port ${port}`);
});
