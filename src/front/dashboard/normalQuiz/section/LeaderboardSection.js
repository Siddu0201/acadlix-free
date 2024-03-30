import { Box, Typography } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import React from "react";

const LeaderboardSection = () => {
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
    { field: "pos", headerName: "Pos.", minWidth: 100 },
    { field: "name", headerName: "Name", minWidth: 180 },
    { field: "entered_on", headerName: "Entered On", minWidth: 180 },
    { field: "points", headerName: "Points", minWidth: 100 },
    { field: "result", headerName: "Result", minWidth: 120 },
  ];

  return (
    <Box>
      <DataGrid
        autoHeight
        rows={rows}
        columns={columns}
        sx={{
          border: "1px solid #9bbb59",
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: "#9bbb59",
          },
        }}
      />
      <br />
      <Box className="res-msg-bx">
        <Typography>Your result has been entered into leaderboard</Typography>
        <Box className="res-msg-bx-cnt">
          <Typography>You signed up successfully.</Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default LeaderboardSection;
