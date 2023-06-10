const express = require('express');
const { v4: uuidv4 } = require('uuid');
const cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
const cors = require('cors');

const { baseUrl, maxNumOfClapsPerUserPerPost } = require('../constants');
const { Posts } = require('./model/Posts');
const { Tags } = require('./model/Tags');

const app = express();
const port = 3080;

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors());

const corsOptions = {
  origin: `${baseUrl.client}`,
  credentials: true,
};

app.get('/', cors(corsOptions), (req, res) => {
  res.send('Welcome to your Wix Enter exam!');
});

app.get('/user', cors(corsOptions), (req, res) => {
  const userId = req.cookies?.userId || uuidv4();
  res.cookie('userId', userId).send({ id: userId });
});

///////////////////////////////////// Posts /////////////////////////////////////
app.get('/posts', cors(corsOptions), (req, res) => {
  if (req.query.popularity) {
    // TODO - implement popularity filter functionality here
    const popularity = Number(req.query.popularity);
    res.send({ Posts });
    return;
    // End of TODO
  }
  res.send({ Posts });
});

app.post('/posts', cors(corsOptions), (req, res) => {
  // TODO - add the add-new-post functionality here

  const userId = req.cookies?.userId;
  if (!userId) {
      res.status(403).end();
      return;
  }

  const {post} = req.body;
  if (!post) {
      res.status(400).json({message: 'Post is missing'}).end();
      return;
  }

  const {title, content} = post;
  if (!(title)) {
      res.status(400).json({message: 'Bad request'}).end();
      return;
  }
  

  const newPost = {
       title, content: content, id: uuidv4()
  }
  Posts.push(newPost);
  res.send({post: newPost}).status(200).end()
});

///////////////////////////////////// Tags /////////////////////////////////////
app.get('/tags', cors(corsOptions), (req, res) => {
  res.send({ Tags });
});

////////////////// put a tag on a post ///////////////////
app.put('/posts/:postId/tags/:tagName', (req, res) => {
  const { postId, tagName } = req.params;
  
  // Here, you would typically update your data store (e.g., database) with the new tag
  // For simplicity, let's assume you have a postsData array as an example data store
  const post = postsData.find((post) => post.id === postId);
  if (post) {
    post.tags.push(tagName);
    res.status(200).json({ message: 'Tag added successfully' });
  } else {
    res.status(404).json({ message: 'Post not found' });
  }
});
////////////////// put a tag on a post ///////////////////


app.post('/tags/tagName/:tagName', cors(corsOptions), (req, res) => {
  const userId = req.cookies?.userId;
  if (!userId) {
    res.status(403).end();
    return;
  }
  const { tagName } = req.params;
  if (Tags[tagName]) {
    res.status(400).end();
    return;
  }
  Tags[tagName] = {};
  res.send({ Tags }).status(200).end();
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);

});


