import {
  ListItem,
  ListItemButton,
  IconButton,
  Card,
  CardContent,
  CardActions,
  Typography,
} from '@mui/material';
import ClappingIcon from './assets/ClappingIcon';
import AddTagButton from './AddTagButton';
import Tag from './Tag';
import { useState } from 'react';
import axios from 'axios';

function Post({
  postId,
  postTitle,
  postContent,
  postClaps,
  postTags,
  Tags,
  handleAddTagClick,
  userId,
  handleTagClick,
  selectedTagId,
  handleAddPostTag,
  setUser,
  postClapsNum,
  users,
  gainClap,

}) {
  const baseURL = 'http://localhost:3080';

  const isTag = postTags.length > 0 ? true : false;
  const [didUserClappedOnPost, setDidUserClappedOnPost] = useState(false);
  const [clapCounter, setClapCounter] = useState(postClapsNum);

  const updateClapCounter = (postId, isGain) => {
    if(isGain){
      setClapCounter(prevCounter => prevCounter + 1);
    }
    else{
      setClapCounter(prevCounter => prevCounter - 1);
    }
    
  };
  const handleAddingTag_Post = (postId, tagName)=>{
    handleAddPostTag(postId, tagName)
  };
  
  const [selectedTag, setSelectedTag] = useState('');

//update clapps
const updateClappedPostsArray = (postId) => {
  axios
    .post(`${baseURL}/user/clapped-posts`, { postId })
    .then((response) => {
      // Handle the response if needed
      console.log('Clapped posts array updated on the server');
    })
    .catch((error) => {
      // Handle the error if needed
      console.log('Failed to update clapped posts array on the server:', error);
    });
};


  
  return (
    <ListItem
      alignItems='flex-start'
      key={postId}
      className='post'
      data-testid={`post-${postId}`}
    >
      <Card className='post'>
        <ListItemButton disableGutters>
          <CardContent>
            <Typography
              variant='h5'
              gutterBottom
              data-testid={`postTitle-${postId}`}
            >
              {postTitle}
            </Typography>
            <Typography
              variant='body1'
              gutterBottom
              data-testid={`postContent-${postId}`}
            >
              {postContent}
            </Typography>
          </CardContent>
        </ListItemButton>
        <CardActions>
          <AddTagButton dataTestId={`postAddTagBtn-${postId}`}  onClick={(e) => handleAddTagClick(e, postId)} />
          {isTag &&
          postTags.map((tagName) => (
            <Tag
                tagName={tagName}
                postId={postId}
                handleTagClick={handleTagClick}
                selectedTagId={selectedTagId}
              />
            ))}
          <IconButton
            aria-label='clapping'
            size='small'
            data-testid={`postClapsBtn-${postId}`}
            onClick={() => {
              if (!didUserClappedOnPost) {
                gainClap(postId, userId);
                setDidUserClappedOnPost(true);
                updateClapCounter(!didUserClappedOnPost);
              }
              else{
                //i want to add decreasing a clap
                setDidUserClappedOnPost(false);
                updateClapCounter();
              }
            }}
          >
            <ClappingIcon
              didUserClappedOnPost={didUserClappedOnPost}
              dataTestId={`postClappingIcon-${postId}`}
              // onChange={() => {

              //   // gainClap(postId, userId)
                
              //   // setDidUserClappedOnPost(!didUserClappedOnPost);
              //   // setUser(prevUser => ({
              //   //   ...prevUser,
              //   //   clappedPosts: [...prevUser.clappedPosts, postId]
              //   // }));
              //   // updateClappedPostsArray(postId);
              //   // updateClapCounter(postId);
              // }}
            />
          </IconButton>
          <Typography variant='string' data-testid={`postClapsNum-${postId}`}>
           {postClaps.length}
          </Typography>
        </CardActions>
      </Card>
    </ListItem>
  );
}

export default Post;
