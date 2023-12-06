const express = require("express");
const cors = require("cors");
const app = express();

require("dotenv").config();
const { mongoConnection } = require("./database/mongodb.connection");
const { userRouter } = require("./routes/user.routes");
const { dentistRouter } = require("./routes/dentist.routes");
const { errorHandler } = require("./errors/errorHandler");
const { productRouter } = require("./routes/product.routes");
const { appointmentRouter } = require("./routes/appointment.routes");
// ^ middlewares

app.use(cors());
app.use(express.json());
app.use("/user", userRouter);
app.use("/dentist", dentistRouter);
app.use("/product", productRouter);
app.use("/appointment", appointmentRouter);

//~ Centralized Error handler
app.use(errorHandler); // * will be used at the end

//home route
app.get("/", async (req, res) => {
  try {
    return res.status(200).json({
      message: "home route",
      success: true,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
});

app.listen(process.env.PORT, async () => {
  try {
    console.log("checking redis , db and server status");
    await mongoConnection;
    console.log("connected to db ");
  } catch (err) {
    console.log("error | connection", err);
  }
  console.log(`server started @ http://localhost:${process.env.PORT}`);
});
