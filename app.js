console.log('Blog app to node');

//Require pkgs
const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const mongoose = require('mongoose');

//Init express
const app = express();

//APP CONFIG
//Demand serving content of public file
app.use(express.static('public'));

//Demand the use of body-parser
app.use(bodyParser.urlencoded({ extended: true }));

//Set view engine
app.set('view engine', 'ejs');

//Connect mongoose
mongoose.connect('mongodb://localhost/blog_app');

//MONGOOSE/MODEL CONFIG
const blogSchema = new mongoose.Schema({
  title: String,
  image: String,
  body: String,
  author: { type: String, default: 'Anonimus'},
  created: { type: Date, default: Date.now() }
});

//Compile the Schema into a model
const BlogPost = mongoose.model('BlogPost', blogSchema);

//test
/*BlogPost.create({
  title: 'My test post 3',
  image: 'https://placeimg.com/900/480/arch',
  body: 'When you enter into any new area of science, you almost always find'
}, function (error, blogPost) {
  if (error) {
    console.log(error);
  } else {
    console.log('New post created!');
    console.log(blogPost);
  }
});*/

//RESTFUL ROUTES
//root
app.get('/', function (req, res) {
  res.redirect('/index');
});

//index
app.get('/index', function (req, res) {
  BlogPost.find({}, function (error, allPosts) {
    if (error) {
      console.log(error);
    } else {
      res.render('index', { posts: allPosts });
    }
  })
});

//new
app.get('/index/new', function (req, res) {
    res.render('new');
  });

//create
app.post('/index', function (req, res) {
  BlogPost.create(req.body.post, function (error, newllyPost) {
    if (error) {
      console.log(error);
      res.render('new');
    } else {
      res.redirect('/index');
    }
  });

});

//show
app.get('/index/:postId', function (req, res) {
  BlogPost.findById(req.params.postId, function (error, foundPost) {
    if (error) {
      console.log(error);
      res.redirect('/index');
    } else {
      res.render('show', { post: foundPost });
    }
  });

});

//Responding to all the rest of requests
app.get('*', function (req, res) {
  res.send('Sorry, page not found!');
});

//Initializing the server: Specify the port of listening
app.listen(3000, function () {
  console.log('Engines on!');
});
