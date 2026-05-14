
import { jsx as _jsx } from 'react/jsx-runtime'
import { createRoot } from 'react-dom/client';
import AdminAddon from '@acadlix/admin/AdminAddon';
import { loadAdminAddonHooks } from '@acadlix/modules/extensions/hooksLoader';

(async () => {
  await loadAdminAddonHooks(window?.acadlixHooks);
  const adminAddonId = "acadlix-admin-addon";
  const acadlixElement = document.getElementById(adminAddonId);
  if (acadlixElement) {
    const acadlixElementRoot = createRoot(acadlixElement);
    acadlixElementRoot.render(<AdminAddon id={adminAddonId}></AdminAddon>);
  }
})();