
import { jsx as _jsx } from 'react/jsx-runtime'
import { createRoot } from 'react-dom/client';
import AdminLesson from './admin/AdminLesson';

const acadlixElement = document.getElementById('acadlix-admin-lesson');
if (acadlixElement){
    const acadlixElementRoot = createRoot(acadlixElement);
    acadlixElementRoot.render(<AdminLesson />);
}