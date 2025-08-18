import React from "react";
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Divider,
  Typography,
} from "@mui/material";
import { __ } from "@wordpress/i18n";
import PayU from "./payment_gateways/PayU";
import PayPal from "./payment_gateways/PayPal";
import RazorPay from "./payment_gateways/RazorPay";
import Stripe from "./payment_gateways/Stripe";

function Payment(props) {
  

  return (
    <Card>
      <CardContent>
        <Box>
          <Box
            sx={{
              marginY: 2,
            }}
          >
            <Typography variant="h4">{__("Payment Gateway", "acadlix")}</Typography>
            <Divider />
          </Box>

          {/* RazorPay */}
          <RazorPay {...props} />

          {/* Paypal */}
          <PayPal {...props} />

          {/* PayU */}
          <PayU {...props} />

          {/* Stripe */}
          <Stripe {...props} />
        </Box>
      </CardContent>
      <CardActions>
        <Button
          variant="contained"
          color="primary"
          type="submit"
          loading={props?.isPending}
        >
          {__("Save", "acadlix")}
        </Button>
      </CardActions>
    </Card>
  );
}

export default Payment;