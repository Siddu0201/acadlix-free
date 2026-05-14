
import { jsx as _jsx } from 'react/jsx-runtime'
import { createRoot } from 'react-dom/client';
import AdminTool from '@acadlix/admin/AdminTool';
import { loadAdminToolHooks } from '@acadlix/modules/extensions/hooksLoader';

(async () => {
  await loadAdminToolHooks(window?.acadlixHooks);
  const adminToolId = "acadlix-admin-tool";
  const acadlixElement = document.getElementById(adminToolId);
  if (acadlixElement) {
    const acadlixElementRoot = createRoot(acadlixElement);
    acadlixElementRoot.render(<AdminTool id={adminToolId}></AdminTool>);
  }
})();