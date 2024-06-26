const express = require("express");
const app = express();
const bodyParser = require("body-parser");

app.use(bodyParser.json());

const PostsController = require('../controllers/postsController')

app.get('/posts', PostsController.getPosts)

app.post('/save-photo', PostsController.savePhoto);

app.put('/care-plant-post', PostsController.carePlant);

app.get('/image/:id', PostsController.getImage);

app.delete('/deletePostByAdmin', PostsController.deletePostByAdmin);
 
module.exports = app;
