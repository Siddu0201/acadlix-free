import AppAdmin from "./admin/AppAdmin";
import { jsx as _jsx } from 'react/jsx-runtime'
import { createRoot } from 'react-dom/client';

const acadlixElement = document.getElementById('acadlix-admin');
const acadlixElementRoot = createRoot(acadlixElement);
if (acadlixElement){
    acadlixElement.render(<AppAdmin />);
}