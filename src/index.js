const express = require("express");
const morgan = require("morgan");
var cors = require('cors')

const app = express();

//settings
app.set("port", process.env.PORT || 8000);
app.use(cors())

//middlewares
app.use(morgan("dev"));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

//routes
app.use("/api/items", require("./routes/router"));

//static files

//starting server
app.listen(app.get("port"), () => {
  console.log("Server on port...", app.get("port"));
});
