
import { jsx as _jsx } from 'react/jsx-runtime'
import { createRoot } from 'react-dom/client';
import AdminCoupon from '@acadlix/admin/AdminCoupon';
import { loadAdminCouponHooks } from './modules/extensions/hooksLoader';

(async () => {
    await loadAdminCouponHooks(window?.acadlixHooks);
    const acadlixElement = document.getElementById('acadlix-admin-coupon');
    if (acadlixElement){
        const acadlixElementRoot = createRoot(acadlixElement);
        acadlixElementRoot.render(<AdminCoupon></AdminCoupon>);
    }
})();