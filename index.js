const express = require("express");
const dontenv = require("dotenv");
const cors = require("cors");
const { connectDB } = require("./config/db");

const app = express();
dontenv.config();
connectDB();
const PORT = process.env.PORT;
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.use("/auth", require("./routes/userRoutes"));
app.use("/restaurant", require("./routes/restaurantRoutes"));
app.use("/category", require("./routes/categoriesRoutes"));
app.use("/order", require("./routes/orderRoutes"));
app.use("/pay", require("./routes/paymentRoutes"));

app.listen(5000, () => {
  console.log("Server is running on port 5000");
});
