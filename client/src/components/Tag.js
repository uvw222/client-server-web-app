import { Fab } from '@mui/material';
import { useState } from 'react';

function Tag({ tagName, postId, handleTagClick, selectedTagId }) {
  const dataTestId = postId ? `tag-${tagName}-${postId}` : `tag-${tagName}`;
  const [color, setColor] = useState('default');
  
  const handleClick = () => {
    handleTagClick(tagName, postId);
    setColor('primary'); // Change the color to 'secondary' when clicked
  };
  
  return (
    <Fab
      key={tagName}
      variant='extended'
      size='small'
      disableRipple
      className='Badge'
      onClick={handleClick}//, dataTestId
      color={color}
      data-testid={dataTestId}
    >
      {tagName}
    </Fab>
  );
}

export default Tag;
