
import { jsx as _jsx } from 'react/jsx-runtime'
import { createRoot } from 'react-dom/client';
import AdminLesson from '@acadlix/admin/AdminLesson';
import { loadAdminLessonHooks } from '@acadlix/modules/extensions/hooksLoader';

(async () => {
  await loadAdminLessonHooks(window?.acadlixHooks);
  const adminLessonId = "acadlix-admin-lesson";
  const acadlixElement = document.getElementById(adminLessonId);
  if (acadlixElement) {
    const acadlixElementRoot = createRoot(acadlixElement);
    acadlixElementRoot.render(<AdminLesson id={adminLessonId}></AdminLesson>);
  }
})();