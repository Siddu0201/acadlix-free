import React from "react";
import Provider from "../provider/Provider";
import Checkout from "./checkout/Checkout";
import { Toaster } from "react-hot-toast";

const FrontCheckout = () => {
  return (
    <Provider>
      <Toaster position="bottom-right" />
      <Checkout />
    </Provider>
  );
};

export default FrontCheckout;
