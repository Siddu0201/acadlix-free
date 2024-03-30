import { Box, Button, Menu, MenuItem } from "@mui/material";
import React from "react";
import { FaAngleDown, FaFolderOpen } from "react-icons/fa";

const ListItemResource = () => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleClick = (e) => {
    setAnchorEl(e.currentTarget);
  };

  return (
    <Box>
      <Button
        variant="outlined"
        size="small"
        id="basic-button"
        aria-haspopup="true"
        aria-controls={open ? "basic-menu" : undefined}
        aria-expanded={open ? "true" : undefined}
        onClick={handleClick}
      >
        <FaFolderOpen style={{
            paddingRight: 5,
            fontSize: 16,
        }} />
        Resources
        <FaAngleDown style={{
            paddingLeft: 5,
        }} />
      </Button>
      <Menu
        id="basic-menu"
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
        disableScrollLock
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <MenuItem onClick={handleClose}>Profile dfs sfdfsd</MenuItem>
        <MenuItem onClick={handleClose}>My account</MenuItem>
        <MenuItem onClick={handleClose}>Logout</MenuItem>
      </Menu>
    </Box>
  );
};

export default ListItemResource;
