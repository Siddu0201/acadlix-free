
import { jsx as _jsx } from 'react/jsx-runtime'
import { createRoot } from 'react-dom/client';
import AdminCoupon from '@acadlix/admin/AdminCoupon';
import { loadAdminCouponHooks } from './modules/extensions/hooksLoader';

(async () => {
  await loadAdminCouponHooks(window?.acadlixHooks);
  const adminCouponId = "acadlix-admin-coupon";
  const acadlixElement = document.getElementById(adminCouponId);
  if (acadlixElement) {
    const acadlixElementRoot = createRoot(acadlixElement);
    acadlixElementRoot.render(<AdminCoupon id={adminCouponId}></AdminCoupon>);
  }
})();