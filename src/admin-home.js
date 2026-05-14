
import { jsx as _jsx } from 'react/jsx-runtime'
import { createRoot } from 'react-dom/client';
import AdminHome from '@acadlix/admin/AdminHome';
import { loadAdminHomeHooks } from '@acadlix/modules/extensions/hooksLoader';

(async () => {
  await loadAdminHomeHooks(window?.acadlixHooks);
  const adminHomeId = "acadlix-admin-home";
  const acadlixElement = document.getElementById(adminHomeId);
  if (acadlixElement) {
    const acadlixElementRoot = createRoot(acadlixElement);
    acadlixElementRoot.render(<AdminHome id={adminHomeId}></AdminHome>);
  }
})();