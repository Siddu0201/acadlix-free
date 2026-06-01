
import { jsx as _jsx } from 'react/jsx-runtime'
import { createRoot } from 'react-dom/client';
import AdminCourse from '@acadlix/admin/AdminCourse';
import { loadAdminCourseHooks } from '@acadlix/modules/extensions/hooksLoader';

(async () => {
  await loadAdminCourseHooks(window?.acadlixHooks);
  const adminCourseEditorId = "acadlix-admin-course-editor";
  const acadlixCourseElement = document.getElementById(adminCourseEditorId);
  if (acadlixCourseElement) {
    const acadlixCourseElementRoot = createRoot(acadlixCourseElement);
    acadlixCourseElementRoot.render(<AdminCourse id={adminCourseEditorId} type="builder"></AdminCourse>);
  }
  const adminCourseSettingsId = "acadlix-admin-course-settings";
  const acadlixCourseSettingElement = document.getElementById(adminCourseSettingsId);
  if (acadlixCourseSettingElement) {
    const acadlixCourseSettingElementRoot = createRoot(acadlixCourseSettingElement);
    acadlixCourseSettingElementRoot.render(<AdminCourse id={adminCourseSettingsId} type="settings"></AdminCourse>);
  }

  const adminCourseAiContentId = "acadlix-admin-course-ai-content";
  const acadlixCourseAiContentElement = document.getElementById(adminCourseAiContentId);
  if (acadlixCourseAiContentElement) {
    const acadlixCourseAiContentElementRoot = createRoot(acadlixCourseAiContentElement);
    acadlixCourseAiContentElementRoot.render(<AdminCourse id={adminCourseAiContentId} type="ai-content"></AdminCourse>);
  }
})();
