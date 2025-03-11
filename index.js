const express = require("express");
require("dotenv").config();
const bodyParser = require("body-parser");
const app = express();
const port = process.env.PORT;

const userRoute = require("./src/routes/userRoute");
const courseRoute = require("./src/routes/course.route");
const { connectionDB } = require("./src/db/connectiondb");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use("/api/v1", userRoute);
app.use("/api/v1/", courseRoute);

app.listen(port, () => {
  console.log(`Server started on http://localhost:7860`);
  connectionDB();
});
