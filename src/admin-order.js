
import { jsx as _jsx } from 'react/jsx-runtime'
import { createRoot } from 'react-dom/client';
import AdminOrder from '@acadlix/admin/AdminOrder';
import { loadAdminOrderHooks } from '@acadlix/modules/extensions/hooksLoader';

(async () => {
  await loadAdminOrderHooks(window?.acadlixHooks);
  const adminOrderId = "acadlix-admin-order";
  const acadlixElement = document.getElementById(adminOrderId);
  if (acadlixElement) {
    const acadlixElementRoot = createRoot(acadlixElement);
    acadlixElementRoot.render(<AdminOrder id={adminOrderId}></AdminOrder>);
  }
})();