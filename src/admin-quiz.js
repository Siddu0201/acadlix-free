
import { jsx as _jsx } from 'react/jsx-runtime'
import { createRoot } from 'react-dom/client';
import AdminQuiz from '@acadlix/admin/AdminQuiz';
import { loadAdminQuizHooks } from '@acadlix/modules/extensions/hooksLoader';

(async () => {
    await loadAdminQuizHooks(window?.acadlixHooks);
    const acadlixElement = document.getElementById('acadlix-admin-quiz');
    if (acadlixElement){
        const acadlixElementRoot = createRoot(acadlixElement);
        acadlixElementRoot.render(<AdminQuiz></AdminQuiz>);
    }
})();