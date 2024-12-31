
import { jsx as _jsx } from 'react/jsx-runtime'
import { createRoot } from 'react-dom/client';
import AdminSetting from './admin/AdminSetting';

const acadlixElement = document.getElementById('acadlix-admin-setting');
if (acadlixElement){
    const acadlixElementRoot = createRoot(acadlixElement);
    acadlixElementRoot.render(<AdminSetting></AdminSetting>);
}