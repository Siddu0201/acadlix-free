import React from "react";
import Provider from "@acadlix/provider/Provider";
import Checkout from "./checkout/Checkout";
import { Toaster } from "react-hot-toast";
import './FrontCheckout.css';

const FrontCheckout = () => {
  return (
    <Provider>
      <Toaster position="bottom-right" />
      <Checkout />
    </Provider>
  );
};

export default FrontCheckout;
