import { jsx as _jsx } from 'react/jsx-runtime'
import { createRoot } from 'react-dom/client';
import AdminReview from './admin/AdminReview';
import { loadAdminReviewHooks } from './modules/extensions/hooksLoader';

(async () => {
    await loadAdminReviewHooks(window?.acadlixHooks);
    const acadlixElement = document.getElementById('acadlix-admin-review');
    if (acadlixElement) {
        const acadlixElementRoot = createRoot(acadlixElement);
        acadlixElementRoot.render(<AdminReview></AdminReview>); 
    }
})();