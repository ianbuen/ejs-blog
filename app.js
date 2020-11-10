//jshint esversion:6

const express = require("express");
const mongoose = require('mongoose');
const ejs = require('ejs');
const _ = require("lodash");


const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const app = express();
app.set('view engine', 'ejs');

app.use(express.urlencoded({extended: true}));
app.use(express.static("public"));


// Variables and constants for blog specific purposes
const posts = [];

// options to fix deprecation warnings
const options = { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false };

// connect to MongoDB using Mongoose
const local = process.env.LOCAL;
const atlas = process.env.ATLAS;
mongoose.connect(atlas, options);

// define schema
const postSchema = mongoose.Schema({
  title: { type: String, required: true },
  body: { type: String, required: true },
  date: String
});

// create model
const Post = mongoose.model("Post", postSchema);


// ROOT ROUTE
app.get("/", (req, res) => {

  // get all posts from DB
  Post.find({}, (err, posts) => {
      if (err)
          console.log(error);
      else
          res.render("home", {main: homeStartingContent, posts: posts });
  });

});


// OTHER ROUTE (GET)
app.get("/about", (req, res) => {
  res.render("about", {content: aboutContent});
});


app.get("/contact", (req, res) => {
  res.render("contact", {content: contactContent});
});


app.get("/compose", (req, res) => {
  res.render("compose");
});

app.get("/posts/:postName", (req, res) => {

  Post.findOne({ _id: req.params.postName }, (err, post) => {
    if (!err)
        res.render("post", { post : post});
  })

});

// POST METHOD
app.post("/compose", (req, res) => {
  const post = new Post({
    title: req.body.txtTitle,
    body: req.body.txtPost,
    date: new Date().toLocaleDateString("en-US", { hour: 'numeric', minute: 'numeric' })
  });

  post.save((err) => {
    if (!err)
        res.redirect("/");
  });
});

app.post("/delete", (req, res) => {

  const postID = req.body.deleteID;

  Post.findOneAndDelete({ _id: postID }, (err) => {
    if (!err)
        res.redirect("/");
  });
});


app.listen(process.env.PORT, function() {
  console.log("Server started on port 80");
});
