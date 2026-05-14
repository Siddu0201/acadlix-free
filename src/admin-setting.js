import { jsx as _jsx } from 'react/jsx-runtime'
import { createRoot } from 'react-dom/client';
import AdminSetting from '@acadlix/admin/AdminSetting';
import { loadAdminSettingHooks } from '@acadlix/modules/extensions/hooksLoader';


(async () => {
  await loadAdminSettingHooks(window?.acadlixHooks);
  const adminSettingId = "acadlix-admin-setting";
  const acadlixElement = document.getElementById(adminSettingId);
  if (acadlixElement) {
    const acadlixElementRoot = createRoot(acadlixElement);
    acadlixElementRoot.render(<AdminSetting id={adminSettingId}></AdminSetting>);
  }
})();
