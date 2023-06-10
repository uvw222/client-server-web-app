import {
  Card,
  CardContent,
  CardActions,
  Typography,
  FormControl,
  InputLabel,
  OutlinedInput,
  MenuItem,
  TextField,
  Button,
  Select,
  FormHelperText,
} from '@mui/material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';



function AddNewPost({ handleAddPost,  TagsList}) {
  const tagsList = TagsList;//changed from mock data to real-time tags list

  const navigate = useNavigate();
  // const routeChange = () =>{ 
  //   let homePagePath = `http://localhost:3000/`; 
  //   navigate(homePagePath);
  // }
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [titleError, setTitleError] = useState(false);
  const [contentError, setContentError] = useState(false);

  const [selectedTag, setSelectedTag] = useState('');


  const handleTitleChange = (event) => {
    const value = event.target.value;
    setTitle(value);
    setTitleError(value.length > 100 || value.length < 1);
  };
  
  const handleContentChange = (event) => {
    const contentValue = event.target.value;
    setContent(contentValue);
    setContentError(contentValue.length < 1);
  };

  return (
    <div className='container'>
      <Card component='form' className='form' data-testid='addNewPost-card'>
        <CardContent className='formFields'>
          <Typography
            variant='h5'
            component='div'
            className='formTitle'
            data-testid='addNewPost-title'
          >
            Add A New Post
          </Typography>
          <Typography
            gutterBottom
            variant='caption'
            component='div'
            data-testid='addNewPost-required'
          >
            *Required
          </Typography>
          <FormControl sx={{ minWidth: '100%' }} TitleError={titleError}>
            <InputLabel
              required
              htmlFor='title-field'
              data-testid='addNewPost-postTitleLabel'
            >
              Title
            </InputLabel>
            <OutlinedInput
              error= {titleError===true}
              id='addNewPost-postTitleInput'
              label='Title'
              fullWidth
              value={title}
              onChange={
                handleTitleChange
              }
              data-testid='addNewPost-postTitle'
            />
            {titleError &&
            (
              <FormHelperText>
                {title.length < 1 ? 'Error: Title is required' : 'Error: Title must be 100 characters or less'}
              </FormHelperText>
            )}
          </FormControl>
          <TextField
            id='addNewPost-postContentInput'
            label='Content'
            multiline
            rows={4}
            fullWidth
            required
            error={contentError}
            value={content}
            onChange={
              // (event) => {setContent(event.target.value);}
              handleContentChange
          }
            data-testid='addNewPost-postContent'
            helperText={contentError && 'Error: Content is required'}
          />
          <FormControl sx={{ m: 1, minWidth: 'max-content', width: '200px' }}>
            <InputLabel
              id='select-tag-label'
              data-testid='addNewPost-postTagLabel'
            >
              Tag
            </InputLabel>
            <Select
              labelId='select-tag-label'
              id='addNewPost-postTagSelect'
              value={selectedTag}
              label='Tag'
              onChange={
                (event) => {setSelectedTag(event.target.value);
              }}
              data-testid='addNewPost-postTag'
            >
              {tagsList.map((option) => (
                <MenuItem
                  key={option}
                  value= {option}
                  data-testid={`addNewPost-postTagOption-${option}`}
                >
                  {option}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </CardContent>
        <CardActions>
          <Button
            variant='contained'
            size='large'
            data-testid='addNewPost-submitBtn'
            onClick={(e) => handleAddPost( title, content, selectedTag)}
          >
            submit
          </Button>
        </CardActions>
      </Card>
    </div>
  );
}

export default AddNewPost;
