import AppAdmin from "./admin/AppAdmin";
import { jsx as _jsx } from 'react/jsx-runtime'
import { createRoot } from 'react-dom/client';

const acadlixElement = document.getElementById('acadlix-admin');
if (acadlixElement){
    const acadlixElementRoot = createRoot(acadlixElement);
    acadlixElementRoot.render(<AppAdmin />);
}