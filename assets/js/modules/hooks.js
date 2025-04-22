(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD
    define(['@wordpress/hooks'], factory);
  } else if (typeof exports === 'object') {
    // CommonJS
    module.exports = factory(require('@wordpress/hooks'));
  } else {
    // Browser globals
    root.acadlixHooks = factory(root.wp && root.wp.hooks);
  }
})(typeof self !== 'undefined' ? self : this, function (hooksLib) {
  if (!hooksLib || typeof hooksLib.createHooks !== 'function') {
    console.error('wp.hooks or @wordpress/hooks not found');
    return {};
  }

  // Create the hooks instance
  const hooks = hooksLib.createHooks();

  // Assign to window (global)
  if (typeof window !== 'undefined') {
    // window.acadlixHooks = hooks;

    // Dispatch a custom event after hooks are initialized
    const event = new CustomEvent('acadlix/hooks/init', {
      detail: {
        hooks,
      },
    });
    window.dispatchEvent(event);
  }

  return hooks;
});
