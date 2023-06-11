import { Card } from "@mui/material";
import React from "react";

const card1 = (props) => {
  return (
    <Card
      item
      {...props}
      sx={{
        marginBottom: "5px",
      }}
    ></Card>
  );
};

export default card1;
