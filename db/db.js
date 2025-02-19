const mongoose = require("mongoose");

mongoose.connect("mongodb+srv://nileshparadva97:0p3qJynZuFL61L26@booktopic.sqm3s.mongodb.net/film-archive").then(() => {
    console.log("db is connected");
}).catch((err) => {
    console.log("err", err);
})

module.exports = mongoose