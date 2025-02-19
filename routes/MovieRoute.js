const express = require("express");
const route = express.Router();
const controller = require("../controllers/MovieController.js");
const upload = require("../middlewares/MovieMiddleware.js");

route.get('/', controller.HomeController);
route.get('/moviepage', controller.AddCntroller);
route.get('/updateMovies/:id', controller.EditController);
route.get('/deleteMovies/:id', controller.DeleteController);
route.get('/singleMovie/:id', controller.SingleController);
route.post('/movies', upload.single("posterimage") , controller.AddFromController);
route.post('/updateMovies/:id', upload.single("posterimage"), controller.EditFromController);

module.exports = route