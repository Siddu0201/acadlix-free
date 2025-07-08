import { jsx as _jsx } from 'react/jsx-runtime'
import { createRoot } from 'react-dom/client';
import AdminSetting from '@acadlix/admin/AdminSetting';
import { loadAdminSettingHooks } from '@acadlix/modules/extensions/hooksLoader';


(async () => {
    await loadAdminSettingHooks(window?.acadlixHooks);
    const acadlixElement = document.getElementById('acadlix-admin-setting');
    if (acadlixElement){
        const acadlixElementRoot = createRoot(acadlixElement);
        acadlixElementRoot.render(<AdminSetting></AdminSetting>);
    }
})();
