<h1 align="center">🎬Movie Management System with Image Upload</h1>

📚 Project Description
The **Movie Management System** is a CRUD (Create, Read, Update, Delete) web application that allows users to manage a collection of movies, including the ability to upload movie posters. The application is developed using **Node.js**, **Express.js**, **MongoDB**, **EJS**, and **Multer**. Users can add new movies, view the list of all movies with their posters, edit movie details, and delete movies from the database.

---

## 💡Features
- 🌟**Add Movie:** Users can add new movies by providing information such as the movie title, description, release date, genre, rating, and uploading a movie poster.
- 📺**View Movies:** The application displays a list of all movies in the database, including their posters and details.
- 🔄**Edit Movie:** Users can update the details of any existing movie, including uploading a new poster if needed.
- ❌**Delete Movie:** Users can delete a movie and its associated poster from the database.

---

## 🤖Technologies Used
- 💻**Backend:** Node.js and Express.js for building the server-side logic and handling HTTP requests.
- 🌎**Frontend:** EJS (Embedded JavaScript) for rendering dynamic HTML pages.
- 📊**Database:** MongoDB for storing and managing movie data.
- 💎**File Upload:** Multer for handling image uploads, allowing users to upload movie posters.

---

## 🌟Project Workflow

1. **Home Page:** Displays a list of all movies with their posters.
2. **Add Movie Page:** A form to input new movie details, including an option to upload a poster image.
3. **Edit Movie Page:** A form pre-filled with the movie details, allowing users to update the information and change the poster image if needed.
4. **Delete Movie:** A button to delete a movie and its associated poster directly from the list.

<!--## Project Setup

```bash
# Clone the repository
git clone <repository-url>

# Navigate to the project folder
cd movie-management-system

# Install dependencies
npm install

# Start the application
npm start
```-->

---

## 📂Folder Structure

```
📦 Movie Management System

├── 📁 controllers
│   └── MovieController.js
├── 📁 db
├── 📁 middlewares
│   └── MovieMiddleware.js
├── 📁 models
│   └── MovieModel.js
├── 📁 public
├── 📁 routes
│   └── MovieRoute.js
├── 📁 uploads
│   └── (Uploaded images)
├── 📁 views
│   ├── addmovie.ejs
│   ├── editmovie.ejs
│   ├── index.ejs
│   └── singlemovie.ejs
├── 📄 package-lock.json
├── 📄 package.json
├── 📄 postcss.config.js
├── 📄 server.js
```

## 🔗Database connection (db.js)

```javascript
const mongoose = require("mongoose");

mongoose.connect("connection string in mongodb compass").then(() => {
    console.log("db is connected");
}).catch((err) => {
    console.log("err", err);
})

module.exports = mongoose
```
---

## 🏠Express App Setup (server.js)

```javascript
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
```

---
## 🏢MongoDB Schema (models/Movie.js)

```javascript
const mongoose = require("mongoose");

const MovieSchema = new mongoose.Schema({
  posterimage: {type: String,required: false},
  title: {type: String,required: true,},
  description: {type: String,required: true},
  releaseYear: {type: String, required: true},
  runningTime: {type: Number,required: true},
  quality: {type: String,required: true},
  country: {type: String,required: true},
  genre: {type: String,required: true},
  itemType: {type: String,required: true},
  videoUpload: {type: String,required: false},
  link: {type: String,required: true,},
  path :{type :String,required : true}
});

module.exports = mongoose.model("Movies", MovieSchema);
```
---

## 🗐 Routes (routes/movies.js)

```javascript
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

```
----

## 🎓Controllers (controllers/MovieController.js)
```javascript
const moviemodel = require("../models/MovieModel.js");
const fs = require("fs");

const HomeController = async (req,res) => {
    console.log("home page start");
    const MovieData = await moviemodel.find()
    res.render("index", {MovieData})
}

const AddCntroller = (req,res) => {
    console.log("add page start");
    res.render("addmovie")
}

const AddFromController = (req,res) => {
    const{posterimage, title, description, releaseYear, runningTime, quality, country, genre, itemType, videoUpload, link} = req.body
    const { path } = req.file;
    console.log("img path", path);
    const MovieDetail = new moviemodel({
        title,
        description,
        releaseYear,
        runningTime,
        quality,
        country,
        genre,
        itemType,
        link,
        path
    })
    console.log("movie Add");
    MovieDetail.save();
    res.redirect("/");
}

const EditController = async (req,res) => {
    const MovieData = await moviemodel.findById(req.params.id)
    console.log("edit page render");
    res.render("editmovie", {MovieData})
}

const EditFromController = async (req, res) => {
    const MovieData = await moviemodel.findById(req.params.id);
    if(req.file){
        const oldImage = MovieData.path
        fs.unlink(oldImage, (err) => {
            if(err){
                console.log("Old image not delete");
            }else{
                console.log("Old image delete");
            }
        })
        req.body.path = req.file.path
    }
    await moviemodel.findByIdAndUpdate(req.params.id, req.body);
    console.log("update movie");
    res.redirect("/")
}

const DeleteController = async (req,res) => {
    const MovieData = await moviemodel.findById(req.params.id)
    const imagePath = MovieData.path;

    fs.unlink(imagePath, (err) => {
        if (err) {
            console.error("Error deleting image:", err);
        } else {
            console.log("Image successfully deleted");
        }
    });

    await moviemodel.findByIdAndDelete(req.params.id)
    console.log("movie is deleted");
    res.redirect("/")
}

const SingleController = async(req,res) => {
    const MovieData = await moviemodel.findById(req.params.id)
    console.log("single view page render");
    res.render("singlemovie", {MovieData})
}

module.exports = {HomeController, AddCntroller, EditController, AddFromController, EditFromController, DeleteController, SingleController}
```

---

## Views

### Home Page (views/index.ejs)

```html
<section class="container py-5">
        <div class="d-flex justify-content-between align-items-center mb-4">
            <h1 class="h3">Movies</h1>
            <a href="/moviepage" class="btn btn-primary">Add Movie</a>
        </div>
        <div class="table-responsive">
            <table class="table table-bordered table-hover">
                <thead class="table-dark">
                    <tr class="text-center">
                        <th>Poster</th>
                        <th>Title</th>
                        <th>Description</th>
                        <th>Release Year</th>
                        <th>Running Time</th>
                        <th>Quality</th>
                        <th>Country</th>
                        <th>Genre</th>
                        <th>Item Type</th>
                        <th>Link</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    <% MovieData.forEach(movieItem => { %>
                        <tr class="text-center align-middle">
                            <td><img src="<%= movieItem.path %>" alt="<%= movieItem.title %>" width="200px" style="border-radius: 9px;">
                            </td>
                            <td><%= movieItem.title %></td>
                            <td><%= movieItem.description %></td>
                            <td><%= movieItem.releaseYear %></td>
                            <td><%= movieItem.runningTime %></td>
                            <td><%= movieItem.quality %></td>
                            <td><%= movieItem.country %></td>
                            <td><%= movieItem.genre %></td>
                            <td><%= movieItem.itemType %></td>
                            <td class="text-center"><a href="<%= movieItem.link %>" target="_blank" class="btn btn-sm btn-info">Watch</a></td>
                            <td class="text-center">
                                <a href="/singleMovie/<%= movieItem._id %>" class="btn btn-sm btn-danger">View</a>
                                <a href="/updateMovies/<%= movieItem._id %>" class="btn btn-sm btn-warning">Edit</a>
                                <a href="/deleteMovies/<%= movieItem._id %>" class="btn btn-sm btn-danger">Delete</a>
                            </td>
                        </tr>
                    <% }); %>
                </tbody>
            </table>
        </div>
</section>
```

---

## Learning Outcomes
- Implementing CRUD operations using Node.js, Express.js, and MongoDB.
- Handling image uploads using Multer in a Node.js application.
- Connecting and performing operations on a MongoDB database.
- Rendering dynamic pages using EJS.
- Managing file uploads and handling file storage on the server.

---

✨ Enjoy building your Movie Management System! 🚀 If you need any further improvements or additions, feel free to reach out!
