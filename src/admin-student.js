
import { jsx as _jsx } from 'react/jsx-runtime'
import { createRoot } from 'react-dom/client';
import AdminStudent from './admin/AdminStudent';
import { loadAdminStudentHooks } from './modules/extensions/hooksLoader';

(async () => {
  await loadAdminStudentHooks(window?.acadlixHooks);
  const adminStudentId = "acadlix-admin-student";
  const acadlixElement = document.getElementById(adminStudentId);
  if (acadlixElement) {
    const acadlixElementRoot = createRoot(acadlixElement);
    acadlixElementRoot.render(<AdminStudent id={adminStudentId}></AdminStudent>);
  }
})();