const express = require("express");
const dotenv = require("dotenv");
const covid = require("./routes/api/covid");
const User = require("./routes/api/user");
dotenv.config();
const app = express();
app.use(express.json());
app.use("/api", covid);
app.use("", User);
require("./mongoodb_connect")()
  .then(() => {
    app.listen(1337, () => {
      console.log("I am Listening on port 1337");
    });
  })
  .catch(console.log);
