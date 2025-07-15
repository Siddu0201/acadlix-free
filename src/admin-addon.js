
import { jsx as _jsx } from 'react/jsx-runtime'
import { createRoot } from 'react-dom/client';
import AdminAddon from '@acadlix/admin/AdminAddon';
import { loadAdminAddonHooks } from '@acadlix/modules/extensions/hooksLoader';

(async () => {
    await loadAdminAddonHooks(window?.acadlixHooks);
    const acadlixElement = document.getElementById('acadlix-admin-addon');
    if (acadlixElement){
        const acadlixElementRoot = createRoot(acadlixElement);
        acadlixElementRoot.render(<AdminAddon></AdminAddon>);
    }
})();