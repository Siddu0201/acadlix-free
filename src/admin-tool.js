
import { jsx as _jsx } from 'react/jsx-runtime'
import { createRoot } from 'react-dom/client';
import AdminTool from '@acadlix/admin/AdminTool';
import { loadAdminToolHooks } from '@acadlix/modules/extensions/hooksLoader';

(async () => {
    await loadAdminToolHooks(window?.acadlixHooks);
    const acadlixElement = document.getElementById('acadlix-admin-tool');
    if (acadlixElement){
        const acadlixElementRoot = createRoot(acadlixElement);
        acadlixElementRoot.render(<AdminTool></AdminTool>);
    }
})();