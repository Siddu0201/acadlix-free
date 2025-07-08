import { jsx as _jsx } from 'react/jsx-runtime'
import { createRoot } from 'react-dom/client';
import FrontCheckout from "@acadlix/front/FrontCheckout";
import { loadFrontCheckoutHooks } from '@acadlix/modules/extensions/hooksLoader';

(async () => {
    await loadFrontCheckoutHooks(window?.acadlixHooks);
    const frontCheckout = document.getElementById("acadlix_checkout");
    if(frontCheckout){
        const frontCheckoutRoot = createRoot(frontCheckout);
        frontCheckoutRoot.render(<FrontCheckout></FrontCheckout>);
    }
})