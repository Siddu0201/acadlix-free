
import { jsx as _jsx } from 'react/jsx-runtime'
import { createRoot } from 'react-dom/client';
import AdminCourse from './admin/AdminCourse';

const acadlixCourseElement = document.getElementById('acadlix-admin-course-editor');
if (acadlixCourseElement){
    const acadlixCourseElementRoot = createRoot(acadlixCourseElement);
    acadlixCourseElementRoot.render(<AdminCourse type="builder"></AdminCourse>);
}

const acadlixCourseSettingElement = document.getElementById('acadlix-admin-course-settings');
if (acadlixCourseSettingElement){
    const acadlixCourseSettingElementRoot = createRoot(acadlixCourseSettingElement);
    acadlixCourseSettingElementRoot.render(<AdminCourse type="settings"></AdminCourse>);
}

const acadlixCourseAiContentElement = document.getElementById('acadlix-admin-course-ai-content');
if (acadlixCourseAiContentElement){
    const acadlixCourseAiContentElementRoot = createRoot(acadlixCourseAiContentElement);
    acadlixCourseAiContentElementRoot.render(<AdminCourse type="ai-content"></AdminCourse>);
}