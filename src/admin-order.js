
import { jsx as _jsx } from 'react/jsx-runtime'
import { createRoot } from 'react-dom/client';
import AdminOrder from './admin/AdminOrder';

const acadlixElement = document.getElementById('acadlix-admin-order');
if (acadlixElement){
    const acadlixElementRoot = createRoot(acadlixElement);
    acadlixElementRoot.render(<AdminOrder />);
}