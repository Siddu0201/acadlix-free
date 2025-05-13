import { jsx as _jsx } from 'react/jsx-runtime'
import { createRoot } from 'react-dom/client';
import AdminAssignment from './admin/AdminAssignment';

const acadlixElement = document.getElementById('acadlix-admin-assignment');
if (acadlixElement){
    const acadlixElementRoot = createRoot(acadlixElement);
    acadlixElementRoot.render(<AdminAssignment></AdminAssignment>); 
}