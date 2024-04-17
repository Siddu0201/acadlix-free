import { Box, Typography } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import React from "react";

const LeaderboardSection = (props) => {
  const rows = [
    {
      id: 1,
      pos: 1,
      name: "Admin",
      entered_on: "2024/01/17 3:28 PM",
      points: 1,
      result: "100%",
    },
  ];

  const columns = [
    { field: "pos", headerName: "Pos.", minWidth: props?.isDesktop ? 50 : 30 },
    { field: "name", headerName: "Name", minWidth: props?.isDesktop ? 220 : 100 },
    { field: "entered_on", headerName: "Entered On", minWidth: props?.isDesktop ? 220 : 150},
    { field: "points", headerName: "Points", minWidth: props?.isDesktop ? 180 : 80 },
    { field: "result", headerName: "Result", minWidth: props?.isDesktop ? 200 : 80 },
  ];

  return (
    <Box sx={{
      marginY: 1
    }}>
      <Box sx={{
        border: `1px solid ${props?.colorCode?.leaderboard_header}`,
        marginY: 2,
        padding: 3,
        borderRadius: 1,
        backgroundColor: props?.colorCode?.leaderboard_text_background,
      }}>
        <Typography>Your result has been entered into leaderboard</Typography>
        <Box>
          <Typography>You signed up successfully.</Typography>
        </Box>
      </Box>
      <Box>
        <DataGrid
          autoHeight
          rows={rows}
          columns={columns}
          sx={{
            border: `1px solid ${props?.colorCode?.leaderboard_header}`,
            "& .MuiDataGrid-columnHeaders": {
              backgroundColor: props?.colorCode?.leaderboard_header,
            },
          }}
        />
      </Box>
    </Box>
  );
};

export default LeaderboardSection;
