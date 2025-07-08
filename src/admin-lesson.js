
import { jsx as _jsx } from 'react/jsx-runtime'
import { createRoot } from 'react-dom/client';
import AdminLesson from '@acadlix/admin/AdminLesson';
import { loadAdminLessonHooks } from '@acadlix/modules/extensions/hooksLoader';

(async () => {
    await loadAdminLessonHooks(window?.acadlixHooks);
    const acadlixElement = document.getElementById('acadlix-admin-lesson');
    if (acadlixElement){
        const acadlixElementRoot = createRoot(acadlixElement);
        acadlixElementRoot.render(<AdminLesson></AdminLesson>);
    }
})();