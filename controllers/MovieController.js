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