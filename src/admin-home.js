
import { jsx as _jsx } from 'react/jsx-runtime'
import { createRoot } from 'react-dom/client';
import AdminHome from './admin/AdminHome';

const acadlixElement = document.getElementById('acadlix-admin-home');
if (acadlixElement){
    const acadlixElementRoot = createRoot(acadlixElement);
    acadlixElementRoot.render(<AdminHome></AdminHome>);
}