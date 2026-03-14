(function () {

  document.addEventListener('DOMContentLoaded', function () {
    document.body.classList.add('acadlix-protected');
  });

  let lastMsgTime = 0;

  const msg = function () {
    const now = Date.now();

    // prevent spam alerts
    if (now - lastMsgTime < 2000) return;

    lastMsgTime = now;
    alert('Content Protected.');
  };

  const isAllowedElement = function (el) {
    const allowed = ['INPUT', 'TEXTAREA', 'BUTTON', 'SELECT'];

    return allowed.includes(el.tagName) || el.isContentEditable;
  };

  // Disable Right Click
  document.addEventListener('contextmenu', function (e) {
    e.preventDefault();
    msg();
  });

  // Disable Text Selection (except inputs)
  document.addEventListener('selectstart', function (e) {
    e.preventDefault();
  });

  // Disable Copy
  document.addEventListener('copy', function (e) {
    if (isAllowedElement(e.target)) return;

    e.preventDefault();
    msg();
  });

  // Disable Cut
  document.addEventListener('cut', function (e) {
    if (isAllowedElement(e.target)) return;

    e.preventDefault();
    msg();
  });

  // Disable Key Shortcuts
  document.addEventListener('keydown', function (e) {

    // if (isAllowedElement(e.target)) return;

    // Ctrl shortcuts
    if (e.ctrlKey) {

      const blocked = ['c', 'u', 's', 'p'];

      if (blocked.includes(e.key.toLowerCase())) {
        e.preventDefault();
        msg();
      }
    }

    // Ctrl + Shift + I
    if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'i') {
      e.preventDefault();
      msg();
    }

    // F12
    if (e.key === 'F12') {
      e.preventDefault();
      msg();
    }

  });

})();