const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const covid = require("./routes/api/covid");
const User = require("./routes/api/user");
const { sendMessage } = require("./mail");
dotenv.config();
const PORT = process.env.PORT || 1337;
const app = express();
app.use(cors());
app.use(express.json());
app.use("/api", covid);
app.use("", User);

require("./mongoodb_connect")()
  .then(() => {
    app.listen(PORT, () => {
      console.log("I am Listening on port ", PORT);
    });
  })
  .catch(console.log);
