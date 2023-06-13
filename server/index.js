const express = require('express');
const { v4: uuidv4 } = require('uuid');
const cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
const cors = require('cors');

const { baseUrl, maxNumOfClapsPerUserPerPost } = require('../constants');
const { Posts } = require('./model/Posts');
const { Tags } = require('./model/Tags');
const { Users } = require('./model/Users');

const app = express();
const port = 3080;

const corsOptions = {
  origin: `${baseUrl.client}`,
  methods: ['GET', 'PUT', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
};

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
// app.use(cors());
app.use(cors(corsOptions));


///////////////// GETTERS //////////////////////
app.get('/', cors(corsOptions), (req, res) => {
  res.send('Welcome to your Wix Enter exam!');
});

app.get('/user', cors(corsOptions), (req, res) => {

  let userId = req.cookies?.userId;
  
  // If the userId cookie is not set, create a new user
  if (!userId) {
    userId = uuidv4();
    res.cookie('userId', userId, { httpOnly: true }).send({ id: userId, clappedPosts:[] });

    // Add the new user to the database
    Users.push(userId);
  } 
  else {
    res.send({ id: userId , clappedPosts:[]});
  }
});

app.get('/users', cors(corsOptions), (req, res) => {
  res.send({ Users });
});

app.get('/tags', cors(corsOptions), (req, res) => {
  res.send({ Tags });
});

/////////////// GET FILTTERED POSTS ///////////////
app.get('/posts', cors(corsOptions), (req, res) => {
  const { popularity, tag } = req.query;
  
  if (tag && popularity === 'undefined') {
    const filteredPosts = Posts.filter((post) => post.tags.includes(tag));
    res.send({ Posts: filteredPosts });
    return;
  }
  
  

  else if (popularity) {
    const filteredPosts = Posts.filter((post) => post.claps.length >= Number(popularity));
    res.send({ Posts: filteredPosts });
    return;
  }
  
  else if (popularity !== '' && tag) {
    const filteredPosts = Posts.filter((post) => (post.tags.includes(tag)) && (post.claps.length >= Number(popularity)));
    res.send({ Posts: filteredPosts });
    return;
  }

  // Return all posts if no filters applied
  else
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

//////////// GAIN CLAP ////////////////
app.put('/post/clap', cors(corsOptions), (req, res) => {
  const { postId, userId } = req.body;

  // Find the post with the specified postId
  const post = Posts.find((post) => post.id === postId);

  if (!post) {
    res.status(404).json({ message: 'Post not found' }).end();
    return;
  }

  // Check if the user has already clapped for this post
  if (post.claps.includes(userId)) {
    res.status(400).json({ message: 'User has already clapped for this post' }).end();
    return;
  }

  // Add the userId to the post's claps
  post.claps.push(userId);

  // Find the user with the specified userId
  const user = Users[userId];

  if (!user) {
    res.status(404).json({ message: 'User not found' }).end();
    return;
  }

  // Add the postId to the user's clappedPosts
  if (!user.clappedPosts.includes(postId)) {
    user.clappedPosts.push(postId);
  }

  res.status(200).json({ message: 'Clap added successfully' }).end();
});




