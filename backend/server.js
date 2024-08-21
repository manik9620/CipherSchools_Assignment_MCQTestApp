require("dotenv").config();
require("./config/db.js");
const express = require("express");
const authRouter = require("./routes/authRoutes.js");
const testRouter=require("./routes/testRoutes.js")
const cors = require("cors");
const colors=require("colors");

const app = express();

app.use(cors({ origin: true }));
app.use(express.json());
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/test",testRouter);

app.get("/", (req, res) => {
    res.send("App is running");
});


app.listen(process.env.PORT, () => {
  console.log("Server is running on port 5000" .bgMagenta.white);
});
