import React from "react";
import { Box, TextField, FormControlLabel, Switch } from "@mui/material";
function Payment() {
  return (
    <div>
      <Box sx={{ color: "black" }}>
        <h3>payment Gateway</h3>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <FormControlLabel control={<Switch />} label="RazorPay" />
          <FormControlLabel
            control={<TextField placeholder="RazorPay Key" />}
          />
          <FormControlLabel
            control={<TextField placeholder="RazorPay Salt" />}
          />

          <FormControlLabel control={<Switch />} label="Sandbox" />
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <FormControlLabel control={<Switch />} label="PayPal" />
          <FormControlLabel control={<TextField placeholder="PayPal Key" />} />
          <FormControlLabel control={<TextField placeholder="PayPal Salt" />} />

          <FormControlLabel control={<Switch />} label="Sandbox" />
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <FormControlLabel control={<Switch />} label="PayPalUMoney" />
          <FormControlLabel
            control={<TextField placeholder="PayUMoney Key" />}
          />
          <FormControlLabel
            control={<TextField placeholder="PayUMoney Salt" />}
          />

          <FormControlLabel control={<Switch />} label="Sandbox" />
        </div>
        <FormControlLabel control={<Switch />} label="Offline Payment Method" />
        <FormControlLabel
          control={<Switch />}
          label="Admin/Instructor Can Assign Courses To Student"
        />
        <FormControlLabel
          control={<Switch />}
          label="Admin/Instructor Can Remove Student From Course"
        />
      </Box>
    </div>
  );
}

export default Payment;
