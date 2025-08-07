import React from "react";
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Divider,
  FormControlLabel,
  IconButton,
  InputAdornment,
  Typography,
} from "@mui/material";
import Grid from '@mui/material/Grid';
import CustomTextField from "@acadlix/components/CustomTextField";
import CustomSwitch from "@acadlix/components/CustomSwitch";
import { useForm } from "react-hook-form";
import { MdVisibility, MdVisibilityOff } from "@acadlix/helpers/icons";
import { __ } from "@wordpress/i18n";
import CustomTypography from "@acadlix/components/CustomTypography";
import PasswordTextField from "@acadlix/components/PasswordTextField";
import PayU from "./payment_gateways/PayU";
import PayPal from "./payment_gateways/PayPal";
import RazorPay from "./payment_gateways/RazorPay";

function Payment(props) {
  const methods = useForm({
    defaultValues: {
      showRazorpayClientID: false,
      showRazorpaySecretKey: false,
      showPaypalClientID: false,
      showPaypalSecretKey: false,
      showPayuMerchentKey: false,
      showPayuSalt: false,
    }
  });

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
          <Box
            sx={{
              marginY: 2,
              backgroundColor: 'grey.light',
            }}
          >
            <Typography
              variant="h6"
              sx={{
                paddingX: 2,
                paddingY: 1,
              }}
            >
              {__("RazorPay", "acadlix")}
            </Typography>
            <Divider />
          </Box>
          <RazorPay {...props} />

          {/* Paypal */}
          <Box
            sx={{
              marginY: 2,
              backgroundColor: 'grey.light',
            }}
          >
            <Typography
              variant="h6"
              sx={{
                paddingX: 2,
                paddingY: 1,
              }}
            >
              {__("PayPal", "acadlix")}
            </Typography>
            <Divider />
          </Box>
          <PayPal {...props} />

          {/* PayU */}
          <Box
            sx={{
              marginY: 2,
              backgroundColor: 'grey.light',
            }}
          >
            <Typography
              variant="h6"
              sx={{
                paddingX: 2,
                paddingY: 1,
              }}
            >
              {__("PayU", "acadlix")}
            </Typography>
            <Divider />
          </Box>
          <PayU {...props} />
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