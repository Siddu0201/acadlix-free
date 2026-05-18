import domReady from '@wordpress/dom-ready';
import { createRoot } from '@wordpress/element';
import Provider from '@acadlix/provider/Provider';
import { loadFrontButtonListenerHooks } from '@acadlix/modules/extensions/hooksLoader';
import FrontButtonListener from './front/FrontButtonListener';

(async () => {
  await loadFrontButtonListenerHooks(window?.acadlixHooks);
  domReady(() => {
    const courseListenerId = "acadlix-course-listener";
    const courseListener = document.getElementById(courseListenerId);
    if (courseListener) {
      if (!courseListener.__REACT_ROOT__) {
        courseListener.__REACT_ROOT__ = createRoot(courseListener);
      }
      courseListener.__REACT_ROOT__.render(
        <Provider id={courseListenerId}>
          <FrontButtonListener />
        </Provider>
      );
    }
  })
})();