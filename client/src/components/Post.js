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

function Post({
  postId,
  postTitle,
  postContent,
  Tags,
  handleAddTagClick,
  userId,
  handleTagClick,
  selectedTagId,
  //gainClap,
}) {
  const getTagsByPostId = (postId) => {
    const tagsArr = [];
    for (const tagName in Tags) {
      if (Tags[tagName][postId]) {
        tagsArr.push(tagName);
      }
    }
    return tagsArr;
  };

  const tagsNameArr = getTagsByPostId(postId);
  const isTag = tagsNameArr.length > 0 ? true : false;
  const didUserClappedOnPost = false;



  
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
            tagsNameArr.map((tagName) => (
              <Tag
                tagName={tagName}
                postId={postId}
                handleTagClick={()=>{
                  setTags((prevItems) => [...prevItems, clickedObject]);}}
                //selectedTagId={selectedTagId}
              />
            ))}
          <IconButton
            aria-label='clapping'
            size='small'
            data-testid={`postClapsBtn-${postId}`}
          >
            <ClappingIcon
              didUserClappedOnPost={didUserClappedOnPost}
              dataTestId={`postClappingIcon-${postId}`}
              onChange={(event, newValue) => {
                const didUserClappedOnPost = newValue === "clap";
                //gainClap(postId, didUserClappedOnPost);
              }}
            />
          </IconButton>
          <Typography variant='string' data-testid={`postClapsNum-${postId}`}>
            0
          </Typography>
        </CardActions>
      </Card>
    </ListItem>
  );
}

export default Post;
