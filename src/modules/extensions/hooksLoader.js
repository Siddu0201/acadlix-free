export const loadAdminCourseHooks = async (hooks) => {
    try {
        const mod = await (
            process.env.REACT_APP_IS_PREMIUM === 'true'
                ? import(
                    /* webpackChunkName: "admin_course_hooks" */
                    '@acadlix/pro/hooks/AdminCourseHooks'
                )
                : import(
                    /* webpackChunkName: "admin_course_hooks" */
                    '@acadlix/free/hooks/AdminCourseHooks'
                )
        );

        if (typeof mod.registerPluginHooks === 'function') {
            mod.registerPluginHooks(hooks);
        }
    } catch (e) {
        // console.log(e);
    }
}

export const loadAdminHomeHooks = async (hooks) => {
    try {
        const mod = await (
            process.env.REACT_APP_IS_PREMIUM === 'true'
                ? import(
                    /* webpackChunkName: "admin_home_hooks" */
                    '@acadlix/pro/hooks/AdminHomeHooks'
                )
                : import(
                    /* webpackChunkName: "admin_home_hooks" */
                    '@acadlix/free/hooks/AdminHomeHooks'
                )
        );

        if (typeof mod.registerPluginHooks === 'function') {
            mod.registerPluginHooks(hooks);
        }
    } catch (e) {
        // console.log(e);
    }
}

export const loadAdminLessonHooks = async (hooks) => {
    try {
        const mod = await (
            process.env.REACT_APP_IS_PREMIUM === 'true'
                ? import(
                    /* webpackChunkName: "admin_lesson_hooks" */
                    '@acadlix/pro/hooks/AdminLessonHooks'
                )
                : import(
                    /* webpackChunkName: "admin_lesson_hooks" */
                    '@acadlix/free/hooks/AdminLessonHooks'
                )
        );

        if (typeof mod.registerPluginHooks === 'function') {
            mod.registerPluginHooks(hooks);
        }
    } catch (e) {
        // console.log(e);
    }
}

export const loadAdminOrderHooks = async (hooks) => {
    try {
        const mod = await (
            process.env.REACT_APP_IS_PREMIUM === 'true'
                ? import(
                    /* webpackChunkName: "admin_order_hooks" */
                    '@acadlix/pro/hooks/AdminOrderHooks'
                )
                : import(
                    /* webpackChunkName: "admin_order_hooks" */
                    '@acadlix/free/hooks/AdminOrderHooks'
                )
        );

        if (typeof mod.registerPluginHooks === 'function') {
            mod.registerPluginHooks(hooks);
        }
    } catch (e) {
        // console.log(e);
    }
}

export const loadAdminQuizHooks = async (hooks) => {
    try {
        const mod = await (
            process.env.REACT_APP_IS_PREMIUM === 'true'
                ? import(
                    /* webpackChunkName: "admin_quiz_hooks" */
                    '@acadlix/pro/hooks/AdminQuizHooks'
                )
                : import(
                    /* webpackChunkName: "admin_quiz_hooks" */
                    '@acadlix/free/hooks/AdminQuizHooks'
                )
        );

        if (typeof mod.registerPluginHooks === 'function') {
            mod.registerPluginHooks(hooks);
        }
    } catch (e) {
        // console.log(e);
    }
}

export const loadAdminSettingHooks = async (hooks) => {
    try {
        const mod = await (
            process.env.REACT_APP_IS_PREMIUM === 'true'
                ? import(
                    /* webpackChunkName: "admin_setting_hooks" */
                    '@acadlix/pro/hooks/AdminSettingHooks'
                )
                : import(
                    /* webpackChunkName: "admin_setting_hooks" */
                    '@acadlix/free/hooks/AdminSettingHooks'
                )
        );

        if (typeof mod.registerPluginHooks === 'function') {
            mod.registerPluginHooks(hooks);
        }
    } catch (e) {
        // console.log(e);
    }
}

export const loadAdminToolHooks = async (hooks) => {
    try {
        const mod = await (
            process.env.REACT_APP_IS_PREMIUM === 'true'
                ? import(
                    /* webpackChunkName: "admin_tool_hooks" */
                    '@acadlix/pro/hooks/AdminToolHooks'
                )
                : import(
                    /* webpackChunkName: "admin_tool_hooks" */
                    '@acadlix/free/hooks/AdminToolHooks'
                )
        );

        if (typeof mod.registerPluginHooks === 'function') {
            mod.registerPluginHooks(hooks);
        }
    } catch (e) {
        // console.log(e);
    }
}

export const loadAdminAddonHooks = async (hooks) => {
    try {
        const mod = await (
            process.env.REACT_APP_IS_PREMIUM === 'true'
                ? import(
                    /* webpackChunkName: "admin_addon_hooks" */
                    '@acadlix/pro/hooks/AdminAddonHooks'
                )
                : import(
                    /* webpackChunkName: "admin_addon_hooks" */
                    '@acadlix/free/hooks/AdminAddonHooks'
                )
        );

        if (typeof mod.registerPluginHooks === 'function') {
            mod.registerPluginHooks(hooks);
        }
    } catch (e) {
        // console.log(e);
    }
}

export const loadAdminStudentHooks = async (hooks) => {
    try {
        const mod = await (
            process.env.REACT_APP_IS_PREMIUM === 'true'
                ? import(
                    /* webpackChunkName: "admin_student_hooks" */
                    '@acadlix/pro/hooks/AdminStudentHooks'
                )
                : import(
                    /* webpackChunkName: "admin_student_hooks" */
                    '@acadlix/free/hooks/AdminStudentHooks'
                )
        );

        if (typeof mod.registerPluginHooks === 'function') {
            mod.registerPluginHooks(hooks);
        }
    } catch (e) {
        // console.log(e);  
    }
}

export const loadAdminDesignStudioHooks = async (hooks) => {
    try {
        const mod = await (
            process.env.REACT_APP_IS_PREMIUM === 'true'
                ? import(
                    /* webpackChunkName: "admin_design_studio_hooks" */
                    '@acadlix/pro/hooks/AdminDesignStudioHooks'
                )
                : import(
                    /* webpackChunkName: "admin_design_studio_hooks" */
                    '@acadlix/free/hooks/AdminDesignStudioHooks'
                )
        );

        if (typeof mod.registerPluginHooks === 'function') {
            mod.registerPluginHooks(hooks);
        }
    } catch (e) {
        // console.log(e);
    }
}

export const loadAdminReviewHooks = async (hooks) => {
    try {
        const mod = await (
            process.env.REACT_APP_IS_PREMIUM === 'true'
                ? import(
                    /* webpackChunkName: "admin_review_hooks" */
                    '@acadlix/pro/hooks/AdminReviewHooks'
                )
                : import(
                    /* webpackChunkName: "admin_review_hooks" */
                    '@acadlix/free/hooks/AdminReviewHooks'
                )
        );

        if (typeof mod.registerPluginHooks === 'function') {
            mod.registerPluginHooks(hooks);
        }
    } catch (e) {
        // console.log(e);
    }
}

export const loadFrontCheckoutHooks = async (hooks) => {
    try {
        const mod = await (
            process.env.REACT_APP_IS_PREMIUM === 'true'
                ? import(
                    /* webpackChunkName: "front_checkout_hooks" */
                    '@acadlix/pro/hooks/FrontCheckoutHooks'
                )
                : import(
                    /* webpackChunkName: "front_checkout_hooks" */
                    '@acadlix/free/hooks/FrontCheckoutHooks'
                )
        );

        if (typeof mod.registerPluginHooks === 'function') {
            mod.registerPluginHooks(hooks);
        }
    } catch (e) {
        // console.log(e);
    }
}

export const loadFrontSingleCourseHooks = async (hooks) => {
    try {
        const mod = await (
            process.env.REACT_APP_IS_PREMIUM === 'true'
                ? import(
                    /* webpackChunkName: "front_single_course_hooks" */
                    '@acadlix/pro/hooks/FrontSingleCourseHooks'
                )
                : import(
                    /* webpackChunkName: "front_single_course_hooks" */
                    '@acadlix/free/hooks/FrontSingleCourseHooks'
                )
        );

        if (typeof mod.registerPluginHooks === 'function') {
            mod.registerPluginHooks(hooks);
        }
    } catch (e) {
        // console.log(e);
    }
}

export const loadFrontButtonListenerHooks = async (hooks) => {
    try {
        const mod = await (
            process.env.REACT_APP_IS_PREMIUM === 'true'
                ? import(
                    /* webpackChunkName: "front_button_listener_hooks" */
                    '@acadlix/pro/hooks/FrontButtonListenerHooks'
                )
                : import(
                    /* webpackChunkName: "front_button_listener_hooks" */
                    '@acadlix/free/hooks/FrontButtonListenerHooks'
                )
        );

        if (typeof mod.registerPluginHooks === 'function') {
            mod.registerPluginHooks(hooks);
        }
    } catch (e) {
        // console.log(e);
    }
}

export const loadFrontHooks = async (hooks) => {
    try {
        const mod = await (
            process.env.REACT_APP_IS_PREMIUM === 'true'
                ? import(
                    /* webpackChunkName: "front_hooks" */
                    '@acadlix/pro/hooks/FrontHooks'
                )
                : import(
                    /* webpackChunkName: "front_hooks" */
                    '@acadlix/free/hooks/FrontHooks'
                )
        );

        if (typeof mod.registerPluginHooks === 'function') {
            mod.registerPluginHooks(hooks);
        }
    } catch (e) {
        // console.log(e);
    }
}
