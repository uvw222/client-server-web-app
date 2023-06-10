import { Fab, Tooltip } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

function AddTagButton({ PostId, onClick }) {
  return (
    <Fab
      variant='extended'
      size='small'
      disableRipple
      className='Badge'
      onClick={onClick}//click that opens the add tag menu
      postId={PostId}
    >
      <Tooltip title='add a tag' arrow placement='top'>
        <AddIcon color='action' />
      </Tooltip>
    </Fab>
  );
}

export default AddTagButton;
