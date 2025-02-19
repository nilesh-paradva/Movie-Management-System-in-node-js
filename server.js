const express = require("express");
const app = express();
const port = 3004;
const db = require("./db/db.js")
const route = require("./routes/MovieRoute.js")
const path = require("path");

app.set("view engine", "ejs");
app.use(express.urlencoded({extended: true}))
app.use("/uploads", express.static(path.join(__dirname, "uploads")))

app.use("/", route)

app.listen(port, (err) => {
    console.log("server is start", `http://localhost:${port}`);
})