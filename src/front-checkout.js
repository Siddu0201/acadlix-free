import { jsx as _jsx } from 'react/jsx-runtime'
import { createRoot } from 'react-dom/client';
import FrontCheckout from "./front/FrontCheckout";

const frontCheckout = document.getElementById("acadlix_checkout");
if(frontCheckout){
    const frontCheckoutRoot = createRoot(frontCheckout);
    frontCheckoutRoot.render(<FrontCheckout></FrontCheckout>);
}