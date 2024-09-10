
import { jsx as _jsx } from 'react/jsx-runtime'
import { createRoot } from 'react-dom/client';
import AdminCourse from './admin/AdminCourse';

const acadlixElement = document.getElementById('acadlix-admin-course-editor');
if (acadlixElement){
    const acadlixElementRoot = createRoot(acadlixElement);
    acadlixElementRoot.render(<AdminCourse />);
}