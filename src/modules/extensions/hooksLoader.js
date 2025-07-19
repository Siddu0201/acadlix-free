export const loadAdminCourseHooks = async (hooks) => {
    try {
        const mod = await (
            process.env.REACT_APP_IS_PREMIUM === 'true'
                ? import('@acadlix/pro/hooks/AdminCourseHooks')
                : import('@acadlix/free/hooks/AdminCourseHooks')
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
                ? import('@acadlix/pro/hooks/AdminHomeHooks')
                : import('@acadlix/free/hooks/AdminHomeHooks')
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
                ? import('@acadlix/pro/hooks/AdminLessonHooks')
                : import('@acadlix/free/hooks/AdminLessonHooks')
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
                ? import('@acadlix/pro/hooks/AdminOrderHooks')
                : import('@acadlix/free/hooks/AdminOrderHooks')
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
                ? import('@acadlix/pro/hooks/AdminQuizHooks')
                : import('@acadlix/free/hooks/AdminQuizHooks')
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
                ? import('@acadlix/pro/hooks/AdminSettingHooks')
                : import('@acadlix/free/hooks/AdminSettingHooks')
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
                ? import('@acadlix/pro/hooks/AdminToolHooks')
                : import('@acadlix/free/hooks/AdminToolHooks')
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
                ? import('@acadlix/pro/hooks/AdminAddonHooks')
                : import('@acadlix/free/hooks/AdminAddonHooks')
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
                ? import('@acadlix/pro/hooks/AdminStudentHooks')
                : import('@acadlix/free/hooks/AdminStudentHooks')
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
                ? import('@acadlix/pro/hooks/FrontCheckoutHooks')
                : import('@acadlix/free/hooks/FrontCheckoutHooks')
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
                ? import('@acadlix/pro/hooks/FrontSingleCourseHooks')
                : import('@acadlix/free/hooks/FrontSingleCourseHooks')
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
                ? import('@acadlix/pro/hooks/FrontHooks')
                : import('@acadlix/free/hooks/FrontHooks')
        );

        if (typeof mod.registerPluginHooks === 'function') {
            mod.registerPluginHooks(hooks);
        }
    } catch (e) {
        // console.log(e);
    }
}
