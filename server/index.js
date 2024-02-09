const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
require("dotenv").config();
const app = express();
const { MONGO_URL } = process.env;
const PORT = 4000;

const authRoute = require("./Routes/AuthRoute");
const userRoute = require("./Routes/UserRoute");
const activityRoute = require("./Routes/ActivityRoute");
const impactRoute = require("./Routes/ImpactRoute");
const registerFormRoute = require("./Routes/RegisterFormRoute");
const feedbackFormRoute = require("./Routes/FeedbackFormRoute");
const responseRoute = require("./Routes/ResponseRoute");
const sessionRoute = require("./Routes/SessionRoute");

mongoose
  .connect(MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB is connected successfully"))
  .catch((err) => console.error(err));

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});

app.use(
  cors({
    origin: ["http://localhost:3000"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);
app.use(cookieParser());

app.use(express.json());

app.use("/", authRoute);
app.use("/activities", activityRoute);
app.use("/user", userRoute);
app.use("/impact", impactRoute);
app.use("/register-form", registerFormRoute);
app.use("/feedback-form", feedbackFormRoute);
app.use("/response", responseRoute);
app.use("/session", sessionRoute);