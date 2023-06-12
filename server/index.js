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

///////////////// GETTERS //////////////////////
app.get('/', cors(corsOptions), (req, res) => {
  res.send('Welcome to your Wix Enter exam!');
});

app.get('/user', cors(corsOptions), (req, res) => {
  const userId = req.cookies?.userId || uuidv4();
  res.cookie('userId', userId).send({ id: userId });
});

app.get('/tags', cors(corsOptions), (req, res) => {
  res.send({ Tags });
});

/////////////// GET FILTTERED POSTS ////////////////
app.get('/posts', cors(corsOptions), (req, res) => {
  const { popularity, tag } = req.query;
  
  if (popularity) {
    const filteredPosts = Posts.filter((post) => post.claps.length>=Number(popularity));
    res.send({ Posts: filteredPosts });
    return;
  }

  if (tag) {
    const filteredPosts = Posts.filter((post) => post.tags.includes(tag));
    res.send({ Posts: filteredPosts });
    return;
  }

  // Return all posts if no filters applied
  res.send({ Posts });
});


/////////// ADD A NEW POST //////////////
app.post('/posts', cors(corsOptions), (req, res) => {
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

  const {id, title, content, selectedTag } = post;
  if (!(title)) {
      res.status(400).json({message: 'No title'}).end();
      return;
  }
  if (!(content)) {
    res.status(400).json({message: 'No content'}).end();
    return;
  }
  if (!(id)) {
    res.status(400).json({message: 'Bad request'}).end();
    return;
  }
  
  const tags = [];
  if (selectedTag) {
    tags.push(selectedTag);
  }

  const newPost = {
    id, title, content, userId:userId, tags, claps: [] // Initialize the claps set for the new post
  }
  Posts.push(newPost);
  res.send({post: newPost}).status(200).end()
});

/////////// ADD A NEW TAG //////////////
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
  Tags[tagName] = {postId: ""};
  res.send({ Tags }).status(200).end();
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);

});


////////////////// PUT A TAG ON A POST //////////////////

app.put('/posts/:postId/tags/:tagName', cors(corsOptions), (req, res) => {
  const { postId, tagName } = req.params;

  // Find the post with the specified postId
  const post = Posts.find((post) => post.id === postId);

  if (!post) {
    res.status(404).json({ message: 'Post not found' }).end();
    return;
  }

  // Check if the tagName already exists in the post's tags
  if (post.tags.includes(tagName)) {
    res.status(400).json({ message: 'Tag already exists' }).end();
    return;
  }

  // Add the tagName to the post's tags
  post.tags.push(tagName);

  // Update the Tags object with the postId and tagName
  Tags[tagName] = { postId };

  res.status(200).json({ message: 'Tag added successfully' }).end();
});






