import { Box, Button, Menu, MenuItem } from "@mui/material";
import React from "react";
import { FaAngleDown, FaFolderOpen } from "../../../../helpers/icons";

const ListItemResource = (props) => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const handleClose = (e) => {
    e?.stopPropagation();
    setAnchorEl(null);
  };

  const handleClick = (e) => {
    e?.stopPropagation();
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
        <FaFolderOpen
          style={{
            paddingRight: 5,
            fontSize: 16,
          }}
        />
        Resources
        <FaAngleDown
          style={{
            paddingLeft: 5,
          }}
        />
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
        {props?.c?.lesson_resources?.map((l, l_index) => (
          <ResourceItem key={l_index} l={l} />
        ))}
      </Menu>
    </Box>
  );
};

export default ListItemResource;

const ResourceItem = (props) => {
  const handleClick = () => {
    if (props?.l?.type === "link" && props?.l?.link !== "") {
      window.open(props?.l?.link, "_blank");
    }

    if (
      props?.l?.type === "upload" &&
      props?.l?.filename !== "" &&
      props?.l?.file_url !== ""
    ) {
      const link = document.createElement("a");
      link.href = props?.l?.file_url; // File URL
      link.download = props?.l?.filename; // File name for download
      link.click();
    }
  };
  return <MenuItem onClick={handleClick}>{props?.l?.title}</MenuItem>;
};
