const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const app = express();
app.set("view engine","ejs");
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/wikiDB");

const articleSchema = new mongoose.Schema({
  title: String,
  content: String
});

const Article = mongoose.model("Article", articleSchema);

app.route("/articles")

.get(function(req,res){
  Article.find(function(err, foundArticles){
    if (err) res.send (err);
    else res.send(foundArticles);
  });
})

.post(function(req,res){
  const newArticle = new Article({
    title: req.body.title,
    content: req.body.content
  });

  newArticle.save(function(err){
    if(!err) res.send("Successfully added article");
    else res.send(err);
  });
})

.delete(function(req,res){
  Article.deleteMany(function(err){
    if(!err) res.send ("Successfully deleted all articles");
    else res.send(err);
  });
});

app.route("/articles/:articleTitle")

.get(function(req,res){
  Article.findOne({title: req.params.articleTitle}, function(err, foundArticle){
    if(foundArticle) res.send(foundArticle);
    else res.send("No Article Found");
  });
})

.put(function(req,res){
    Article.updateOne(
      {title: req.params.articleTitle},
      {title: req.body.title, content: req.body.content},
      function(err){
        if(!err) res.send("Successfully Updated!");
      }
    )
})

.patch(function(req,res){
  Article.updateOne(
    {title: req.params.articleTitle},
    {title: req.body.title, content: req.body.content},
    function(err){
      if(!err) res.send("Successfully Updated!");
    }
  )
})

.delete(function(req,res){
  Article.deleteOne({title: req.params.articleTitle}, function(err){
    if(!err) res.send("Successfully Deleted");
  });
});

app.listen(3000, function(){
  console.log("Server Running On Port 3000");
});
