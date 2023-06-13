import { MenuItem, Menu } from '@mui/material';

function FloatingMenuPopularity({ menuOptions,anchorElement, handleMenuClose}) {
  const open = Boolean(anchorElement);

  const handleClick = (selectedOption, optionId) => {
    const option = menuOptions.includes(selectedOption) ? selectedOption : '';
    handleMenuClose(option);
    
  };

  return (
    <Menu
      id='positioned-menu'
      data-testid='positioned-menu'
      aria-labelledby='positioned-button'
      anchorEl={anchorElement}
      open={open}
      onClose={handleClick}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'left',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'left',
      }}
    >
      {menuOptions.map((option) => {
        const optionId = `positioned-menu-${option}`;
        // const optionObject = optionObjects.find((obj) => obj.name === option);

        return (
          <MenuItem
            selected={false}
            key={option}
            value={option}
            onClick={() => handleClick(option, optionId)}

        >
            {option}
          </MenuItem>
        );
      })}
    </Menu>
  );
}

export default FloatingMenuPopularity;
