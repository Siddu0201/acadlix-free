import React from 'react'
import { Tooltip, Button } from "@mui/material";
import { IoMdRefresh } from "@acadlix/helpers/icons";
import { __ } from "@wordpress/i18n";
import { useTheme } from "@mui/material";

const CustomRefresh = ({ refetch }) => {
    const theme = useTheme();
  return (
    <Tooltip title={__("Refresh", "acadlix")} arrow>
      <Button
        variant="contained"
        onClick={refetch}
      >
        <IoMdRefresh style={{ fontSize: theme.breakpoints.down('sm') ? 'large' : 'x-large' }} />
      </Button>
    </Tooltip>
  )
}

export default CustomRefresh