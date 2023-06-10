import axios from 'axios';
import './App.css';
import Home from './pages/Home';
import AddNewPost from './pages/AddNewPost';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState, useEffect, useCallback } from 'react';
import {
  Typography,
  AppBar,
  Toolbar,
  Button,
  ButtonGroup,
  Alert,
  Snackbar,
} from '@mui/material';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import HomeIcon from '@mui/icons-material/Home';
import FloatingMenu from './components/FloatingMenu';
// import Post from './components/Post';

function App() {
  const baseURL = 'http://localhost:3080';
  const popularityOptions = [1, 5, 20, 100];

  const [userId, setUserId] = useState('');
  const [userClapNum, setUserClapNum] = useState(0);

  const [selectedPopularityQuery, setSelectedPopularityQuery] = useState('');
  const [selectedTagQuery, setSelectedTagQuery] = useState('');

  const [allPosts, setAllPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);

  const [tags, setTags] = useState({});
  const [tagsList, setTagsList] = useState([]);
  const [selectedTagId, setSelectedTagId] = useState('');

  const [anchorEl, setAnchorEl] = useState(null);

  const [alertMsg, setAlertMsg] = useState('');
  const [showAlert, setShowAlert] = useState(false);
  const [alertType, setAlertType] = useState('');

  useEffect(() => {
    if (showAlert) {
      setTimeout(() => {
        handleAlert('', false, '');
      }, 1500);
    }
  }, [showAlert]);

  const handleAlert = (message, isShow, type) => {
    setAlertMsg(message);
    setShowAlert(isShow);
    setAlertType(type);
  };

  ///////////////////////////////////// data request /////////////////////////////////////
  axios.defaults.withCredentials = true;
  ///////////////////// get request /////////////////////

  // sets a userId cookie
  const getUser = useCallback(() => {
    axios
      .get(`${baseURL}/user`)
      .then((response) => {
        setUserId(response.data.id);
        setUserClapNum();//adding a users counter to count the claps each time the user clicks clap
      })
      .catch((error) => {
        handleAlert(error.message, true, 'error');
      });
  }, []);

  const getPosts = useCallback(() => {
    axios
      .get(`${baseURL}/posts`)
      .then((response) => {
        setAllPosts([...response.data['Posts']]);
        setFilteredPosts([...response.data['Posts']]);
      })
      .catch((error) => {
        handleAlert(error.message, true, 'error');
      });
  }, []);

  const getFilteredPosts = (popularity, tag) => {
    const url = popularity !== '' ? `popularity=${popularity}` : '';
    axios
      .get(`${baseURL}/posts?${url}`)
      .then((response) => {
        setFilteredPosts([...response.data['Posts']]);
      })
      .catch((error) => {
        handleAlert(error.message, true, 'error');
      });
  };

  const getTags = useCallback(() => {
    axios
      .get(`${baseURL}/tags`)
      .then((response) => {
        setTags({ ...response.data['Tags'] });
        const tagsList = [];
        for (const tagName in response.data['Tags']) {
          tagsList.push(tagName);
        }
        setTagsList(tagsList);
      })
      .catch((error) => {
        handleAlert(error.message, true, 'error');
      });
  }, []);

  useEffect(() => {
    getPosts();
    getTags();
    getUser();
  }, [getPosts, getTags, getUser]);


  ///////////////////// post request /////////////////////
  const addPost = (id, title, content, claps) => {
    axios
      .post(
        `${baseURL}/posts`,
        {
          post: {
            
            id,
            title,
            content,
            claps,
            
          },
        },
        {
          headers: {
            // to send a request with a body as json you need to use this 'content-type'
            'content-type': 'application/x-www-form-urlencoded',
          },
        }
      )
      .then((response) => {
        setAllPosts([...allPosts, response.data.post]);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const addNewTag = (tagName) => {
    axios
      .post(`${baseURL}/tags/tagName/${tagName}`)
      .then((response) => {
        setTags({ ...response.data['Tags'] });
        const tagsList = [];
        for (const tagName in response.data['Tags']) {
          tagsList.push(tagName);
        }
        setTagsList(tagsList);
        handleAlert('Tag was added successfully', true, 'success');
      })
      .catch((error) => {
        handleAlert(error.message, true, 'error');
      });
  };
//////////////// add a tag to a post ////////////////////
  const addPostTag = (postId, tagName) => {
    axios
      .put(`${baseURL}/posts/${tagName}`)
      .then((response) => {
        setAllPosts((prevPosts) =>
        prevPosts.map((post) =>
        post.id === postId ? { ...post } : post
        ));
        
        
        
        const tagsList = [];
        for (const tagName in response.data['Tags']) {
          tagsList.push(tagName);
        }
        setTagsList(tagsList);
        handleAlert('Tag was added successfully', true, 'success');
      })
      .catch((error) => {
        handleAlert(error.message, true, 'error');
      });
  };



//////////// gain Clap ///////////
// const gainClap = (postId, isClap)=>{
 
//   axios
//   .post(`${baseURL}/post/clap`,
//   {
//     post: { id:postId, clap: done },
//   },
//   {
//     headers: {
//       "content-type": "application/x-www-form-urlencoded",
//     },
//   }
// )
// .then((response) =>  {
//   if (response.status === 200) {//checking response status
//     const updatedTodo = response.data.done;
//     setTodos((prevTodos) =>
//       prevTodos.map((todo) =>
//         todo.id === id ? { ...todo, done: updatedTodo } : todo
//       )
//     );
//     getTodos();
//   } else {
//     // Handle other status codes if needed
//     console.log("Unexpected status code:", response.status);
//   }
// })
// .catch((error) => {
//   console.log(error);
// });
// };



  ///////////////////////////////////// handle click events /////////////////////////////////////
  const handlePopularityClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = (selectedOption) => {
    setAnchorEl(null);
    filterPostsByPopularity(selectedOption);
  };

  const handleHomeClick = () => {
    setFilteredPosts(allPosts);
    setSelectedPopularityQuery('');
    setSelectedTagId('');
  };

  ///////////////////////////////////// filters /////////////////////////////////////
  const filterPostsByPopularity = (minClapsNum) => {
    setSelectedPopularityQuery(`${minClapsNum}`);
    getFilteredPosts(minClapsNum, selectedTagQuery);
  };

  ///////////////////////////////////// render components /////////////////////////////////////
  const renderToolBar = () => {
    return (
      <AppBar position='sticky' color='inherit'>
        <Toolbar>
          <ButtonGroup variant='text' aria-label='text button group'>
            <Button
              href='/'
              size='large'
              onClick={handleHomeClick}
              startIcon={<HomeIcon />}
            >
              Home
            </Button>
            <Button
              href='/add-new-post'
              size='large'
              startIcon={<AddCircleIcon />}
            >
              Add A New Post
            </Button>
          </ButtonGroup>
          <Typography variant='h6' component='div' sx={{ flexGrow: 1 }}>
            Enter 2023 Blog Exam
          </Typography>
          <ButtonGroup variant='text' aria-label='text button group'>
            <Button
              size='large'
              startIcon={<FilterAltIcon />}
              onClick={(e) => handlePopularityClick(e)}
              data-testid='popularityBtn'
              className={
                window.location.href !== 'http://localhost:3000/add-new-post'
                  ? ''
                  : 'visibilityHidden'
              }
            >
              filter by Popularity
            </Button>
          </ButtonGroup>
          <FloatingMenu
            menuOptions={popularityOptions}
            anchorElement={anchorEl}
            handleMenuClose={handleMenuClose}
          />
        </Toolbar>
      </AppBar>
    );
  };

  return (
    <div className='App'>
      {renderToolBar()}
      {showAlert && (
        <Snackbar open={true} data-testid='alert-snackbar'>
          <Alert severity={alertType} data-testid='alert'>
            {alertMsg}
          </Alert>
        </Snackbar>
      )}
      <Router>
        <Routes>
          <Route
            path='/add-new-post'
            element={<AddNewPost handleAddPost={addPost} />}
          />
          <Route
            path='/'
            element={
              <Home
                Posts={filteredPosts}
                Tags={tags}
                tagsList={tagsList}
                handleAddNewTag={addNewTag}
                // handleAddPost={addPost}
                selectedTagId={selectedTagId}
                selectedPopularityQuery={selectedPopularityQuery}
                userId={userId}
                handleAddPostTag={addPostTag}
              />
            }
          />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
