
import { jsx as _jsx } from 'react/jsx-runtime'
import { createRoot } from 'react-dom/client';
import AdminTool from './admin/AdminTool';

const acadlixElement = document.getElementById('acadlix-admin-tool');
if (acadlixElement){
    const acadlixElementRoot = createRoot(acadlixElement);
    acadlixElementRoot.render(<AdminTool></AdminTool>);
}