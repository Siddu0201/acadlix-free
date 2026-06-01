import { jsx as _jsx } from 'react/jsx-runtime'
import { createRoot } from 'react-dom/client';
import AdminCourseStudent from './admin/views/AdminCourseStudent';
import { loadAdminCourseStudentHooks } from './modules/extensions/hooksLoader';

(async () => {
  await loadAdminCourseStudentHooks(window?.acadlixHooks);
  const adminCourseStudentId = "acadlix-admin-course-student";
  const acadlixCourseStudentElement = document.getElementById(adminCourseStudentId);
  if (acadlixCourseStudentElement) {
    const acadlixCourseStudentElementRoot = createRoot(acadlixCourseStudentElement);
    const courseId = acadlixCourseStudentElement.getAttribute('data-course-id');
    acadlixCourseStudentElementRoot.render(<AdminCourseStudent id={adminCourseStudentId} courseId={courseId} />);
  }
})();