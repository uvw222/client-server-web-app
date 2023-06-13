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
import FloatingMenuPopularity from './components/FloatingMenuPopularity';
import Post from './components/Post';

function App() {
  const baseURL = 'http://localhost:3080';
  const popularityOptions = [1, 5, 20, 100];

  const [userId, setUserId] = useState('');
  const [users, setUsers] = useState('');

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
      })
      .catch((error) => {
        handleAlert(error.message, true, 'error');
      });
  }, []);

  const getUsers = useCallback(() => {
    axios
      .get(`${baseURL}/users`)
      .then((response) => {
        setUsers([...response.data['Users']]);
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

  const getFilteredPosts = ( tag, popularity) => {
  const popularityParam = popularity !== '' ? `popularity=${popularity}` : '';
  const tagParam = tag ? `tag=${tag}` : '';
  const queryParams = [popularityParam, tagParam].filter(Boolean).join('&');
  const url = `${baseURL}/posts${queryParams ? `?${queryParams}` : ''}`;
  setSelectedTagQuery(tag);
  setSelectedPopularityQuery(popularityParam);

  axios
    .get(url)
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
    getUsers();
  }, [getPosts, getTags, getUser, getUsers]);


  ///////////////////// post request /////////////////////
  const addPost = (id, title, content, selectedTag) => {
    axios
      .post(
        `${baseURL}/posts`,
        {
          post: {
            
            id,
            title,
            content,
            selectedTag,
            userId,
            claps: new Set() // Initialize the claps set for the new post
            
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
        window.alert('Post added successfully!');
        window.location.href = 'http://localhost:3000/';
      })
      .catch((error) => {
        console.log(error);
        window.alert('Please fill all required fields');
      });
  };

  const addNewTag = (tagName) => {
    axios
      .post(`${baseURL}/tags/tagName/${tagName}`)
      .then((response) => {
        if (response.data && response.data.Tags) {
          setTags({ ...response.data.Tags });
          const tagsList = Object.keys(response.data.Tags);
          setTagsList(tagsList);
          handleAlert('Tag was added successfully', true, 'success');
          setTimeout(() => {
            window.location.reload();
          }, 100);
        } else {
          handleAlert('Error adding new tag', true, 'error');
        }
      })
      .catch((error) => {
        handleAlert(error.message, true, 'error');
      });
  };





//////////////// add a tag to a post ////////////////////
  // const addPostTag = (postId, tagName) => {
  //   axios
  //   .put(`${baseURL}/posts/${postId}/tags/${tagName}`)
  //   .then((response) => {
  //     const updatedPosts = allPosts.map((post) => {
  //       if (post.id === postId) {
  //         return {
  //           ...post,
  //           tags: [...post.tags, tagName],
  //         };
  //       }
  //       return post;
  //     });
  //     setAllPosts(updatedPosts);
  //     handleAlert('Tag was added successfully', true, 'success');
  //   })
  //   .catch((error) => {
  //     handleAlert(error.message, true, 'error');
  //   });
  // };


  const addPostTag = (postId, tagName ) => {

    axios
    .put(`${baseURL}/posts/${postId}/tags/${tagName}`, { withCredentials: true })
      .then((response) => {
        const updatedPosts = allPosts.map((post) => {
          if (post.id === postId) {
            return {
              ...post,
              tags: [...post.tags, tagName],
            };
          }
          return post;
        });
        setAllPosts(updatedPosts);
        handleAlert('Tag was added successfully', true, 'success');
        setTimeout(() => {
          window.location.reload();
        }, 500);
      })
      .catch((error) => {
        handleAlert(error.message, true, 'error');
      });
  };



//////////// gain Clap ///////////
const gainClap = (postId, userId)=>{
 
  axios
  .put(`${baseURL}/post/clap`, { postId, userId }, { withCredentials: true })
  .then((response) => {
    const updatedPosts = allPosts.map((post) => {
      if (post.id === postId) {
        return {
          ...post,
          claps: [...post.claps, userId],
        };
      }
      return post;
    });
    setAllPosts(updatedPosts);
    const updatedUsers = users.map((user) => {
      if (user.id === userId) {
        if (!user.clappedPosts.includes(postId)) {
          return {
            ...user,
            clappedPosts: [...user.clappedPosts, postId],
          };
        }
      }
      return user;
    });
    setUsers(updatedUsers);
    handleAlert('Clap was added successfully', true, 'success');
    setTimeout(() => {
      window.location.reload();
    }, 100);
  })
  .catch((error) => {
    handleAlert(error.message, true, 'error');
  });

};



  ///////////////////////////////////// handle click events /////////////////////////////////////
  const handlePopularityClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = (selectedOption) => {
    setAnchorEl(null);
    filterPostsByPopularity(selectedOption);
    setSelectedPopularityQuery(selectedOption);
  };

  const handleHomeClick = () => {
    setFilteredPosts(allPosts);
    setSelectedPopularityQuery('');
    setSelectedTagId('');
  };

  ///////////////////////////////////// filters /////////////////////////////////////
  const filterPostsByPopularity = (minClapsNum) => {
    setSelectedPopularityQuery(minClapsNum);
    getFilteredPosts(selectedTagQuery,minClapsNum );
    
  };


  const filterPostsByTags = (tagName) => {
    setSelectedTagId(tagName); // Update the selected tag
  
    const filteredPosts = allPosts.filter((post) => {
      return post.tags.includes(tagName);
    });
  
    setFilteredPosts(filteredPosts); // Update the filtered posts
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
              {selectedPopularityQuery ==''?'filter by Popularity':selectedPopularityQuery}
            </Button>
          </ButtonGroup>
          <FloatingMenuPopularity
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
      {renderToolBar()} {showAlert && (<Snackbar open={true} data-testid='alert-snackbar'>
          <Alert severity={alertType} data-testid='alert'> {alertMsg}  </Alert>
        </Snackbar>
      )}
      <Router>
        <Routes>
          <Route path='/add-new-post'  element={<AddNewPost handleAddPost={addPost} TagsList={tagsList} />} />
          <Route  path='/'  element={ <Home  
                Posts={filteredPosts} 
                Tags={tags} 
                tagsList={tagsList}
                handleAddNewTag={addNewTag}
                selectedTagId={selectedTagId}
                selectedPopularityQuery={selectedPopularityQuery}
                userId={userId}
                handleAddPostTag={addPostTag}
                handleFilteredPosts={getFilteredPosts}
                users={users}
                gainClap={gainClap}
              />
            }
          />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
