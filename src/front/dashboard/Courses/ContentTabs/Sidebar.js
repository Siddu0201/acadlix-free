import * as React from "react";
import { List, ListItemButton, ListItemText, Collapse } from "@mui/material";
import { ExpandLess, ExpandMore } from "@mui/icons-material";

export default function NestedList() {
  const [open, setOpen] = React.useState(true);

  const handleClick = () => {
    setOpen(!open);
  };

  return (
    <List sx={{ width: "100%" }} component="nav">
      <ListItemButton onClick={handleClick}>
        <ListItemText primary="Section 1" />
        {open ? <ExpandLess /> : <ExpandMore />}
      </ListItemButton>
      <Collapse in={open} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          <ListItemButton sx={{ pl: 7 }}>
            <ListItemText primary="Content 1" />
          </ListItemButton>
          <ListItemButton sx={{ pl: 7 }}>
            <ListItemText primary="Content 2" />
          </ListItemButton>
        </List>
      </Collapse>
    </List>
  );
}
