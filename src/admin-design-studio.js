import { jsx as _jsx } from 'react/jsx-runtime'
import { createRoot } from 'react-dom/client';
import { loadAdminDesignStudioHooks } from '@acadlix/modules/extensions/hooksLoader';
import AdminDesignStudio from './admin/AdminDesignStudio';


(async () => {
    await loadAdminDesignStudioHooks(window?.acadlixHooks);
    const acadlixElement = document.getElementById('acadlix-admin-design-studio');
    if (acadlixElement){
        const acadlixElementRoot = createRoot(acadlixElement);
        acadlixElementRoot.render(<AdminDesignStudio></AdminDesignStudio>);
    }
})();
