
import { jsx as _jsx } from 'react/jsx-runtime'
import { createRoot } from 'react-dom/client';
import AdminStudent from './admin/AdminStudent';
import { loadAdminStudentHooks } from './modules/extensions/hooksLoader';

(async () => {
    await loadAdminStudentHooks(window?.acadlixHooks);
    const acadlixElement = document.getElementById('acadlix-admin-student');
    if (acadlixElement) {
        const acadlixElementRoot = createRoot(acadlixElement);
        acadlixElementRoot.render(<AdminStudent></AdminStudent>); 
    }
})();