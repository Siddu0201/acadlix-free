import { jsx as _jsx } from 'react/jsx-runtime'
import { createRoot } from 'react-dom/client';
import FrontCheckout from "@acadlix/front/FrontCheckout";
import domReady from '@wordpress/dom-ready';
import { loadFrontCheckoutHooks } from '@acadlix/modules/extensions/hooksLoader';

await loadFrontCheckoutHooks(window?.acadlixHooks);
domReady(() => {
    const frontCheckout = document.getElementById("acadlix_checkout");
    if (frontCheckout) {
        const frontCheckoutRoot = createRoot(frontCheckout);
        frontCheckoutRoot.render(<FrontCheckout></FrontCheckout>);
    }
});