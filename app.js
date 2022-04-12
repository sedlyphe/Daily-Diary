//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require('lodash');
const mongoose = require('mongoose');

const homeStartingContent = "Create, Read and Delete Blog Posts.";
const aboutContent = "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like).";
const contactContent = "There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable. If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything embarrassing hidden in the middle of text. All the Lorem Ipsum generators on the Internet tend to repeat predefined chunks as necessary, making this the first true generator on the Internet. It uses a dictionary of over 200 Latin words, combined with a handful of model sentence structures, to generate Lorem Ipsum which looks reasonable. The generated Lorem Ipsum is therefore always free from repetition, injected humour, or non-characteristic words etc.";

const app = express();

app.set('view engine', 'ejs');

app.use(express.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect('mongodb+srv://admin-robin:jkgf4ZaZcEZNxLvp@cluster0.qbqqf.mongodb.net/blogDB?retryWrites=true&w=majority',{useNewUrlParser:true, useUnifiedTopology:true});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function(){
  console.log("Successfully connected to database");
});

const postSchema = new mongoose.Schema({
  title: String,
  content: String
});

const Post = mongoose.model('Post', postSchema);

app.get("/", function(req,res){
  Post.find({},function(err, posts){
    res.render("home",{
      homePara: homeStartingContent,
      posts: posts
    });
  })
 });

app.post("/deletePost", function(req, res){
  const deletePostId = req.body.remove2;
  Post.findByIdAndRemove(deletePostId, function(err){
    if(!err){
      console.log("Successfully deleted the blog post");
      res.redirect("/");
    }
  })
})

app.get("/about", function(req,res){
  res.render("about",{aboutPara:aboutContent});
});

app.get("/contact",function(req,res){
  res.render("contact",{contactPara:contactContent});
});

app.get("/compose",function(req,res){
  res.render("compose",{});
});

app.post("/compose", function(req,res){
  const post = new Post({
    title: req.body.postTitle,
    content: req.body.postBody
  });
  post.save(function(err){
    if(!err){
      res.redirect("/");
    }
  });
});

app.get("/posts/:postId", function(req,res){
  const requestedPostId = req.params.postId;
  Post.findOne({_id:requestedPostId}, function(err,post){
    res.render("post",{
      postHead: post.title,
      postBody: post.content
    });
  })
});

let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}
app.listen(port, function() {
  console.log("Server started on port 3000");
});
