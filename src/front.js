import AppFront from '@acadlix/front/AppFront';
import Dashbaord from '@acadlix/front/Dashbaord';
import { jsx as _jsx } from 'react/jsx-runtime'
import domReady from '@wordpress/dom-ready';
import { createRoot } from '@wordpress/element';
import { loadFrontHooks } from '@acadlix/modules/extensions/hooksLoader';
import FrontLogin from './front/FrontLogin';
import AppFrontLeaderboard from './front/AppFrontLeaderboard';
import Certificate from './front/Certificate';
import Provider from './provider/Provider';

(async () => {
  await loadFrontHooks(window?.acadlixHooks);
  window.initializeShortcodes = () => {
    const shortcode = document.querySelectorAll('.acadlix-front');
    if (shortcode.length > 0) {
      shortcode.forEach((short, index) => {
        if (short.querySelector(".acadlix-front-quiz-button")) {
          if (!short.__REACT_ROOT__) {
            short.__REACT_ROOT__ = createRoot(short);
          }
          const quizId = "acadlix_quiz_" + short.getAttribute('id');
          short.__REACT_ROOT__.render(
            <div id={quizId}>
              <Provider id={quizId}>
                <AppFront
                  quiz_elm={short}
                  elm_index={index}
                  key={index}
                  quiz_id={short.getAttribute('id')}
                  start={false}
                  advance={false}
                  hide_title={true}
                  hide_description={true}
                />
              </Provider>
            </div>
          );
        }
      });
    }
    const leaderboardShortcode = document.querySelectorAll('.acadlix-front-leaderboard');
    if (leaderboardShortcode.length > 0) {
      leaderboardShortcode.forEach((short, index) => {
        if (!short.__REACT_ROOT__) {
          short.__REACT_ROOT__ = createRoot(short);
        }
        const leaderboardId = "acadlix_leaderboard_" + short.getAttribute('id');
        short.__REACT_ROOT__.render(
          <div id={leaderboardId}>
            <Provider id={leaderboardId}>
              <AppFrontLeaderboard
                quiz_elm={short}
                elm_index={index}
                quiz_id={short.getAttribute('id')}
              />
            </Provider>
          </div>
        );
      });
    }
    const loginShortcode = document.querySelectorAll('.acadlix-front-login');
    if (loginShortcode.length > 0) {
      loginShortcode.forEach((short, index) => {
        if (!short.__REACT_ROOT__) {
          short.__REACT_ROOT__ = createRoot(short);
        }
        const loginId = "acadlix_login_" + index;
        short.__REACT_ROOT__.render(
          <div id={loginId}>
            <Provider id={loginId}>
              <FrontLogin />
            </Provider>
          </div>
        );
      });
    }
  }

  document.addEventListener('shortcodeLoaded', initializeShortcodes);

  window.initializeShortcodes();

  domReady(() => {
    const dashboardId = "acadlix_dashboard";
    const dashboard = document.getElementById(dashboardId);
    if (dashboard) {
      const dashboardRoot = createRoot(dashboard);
      dashboardRoot.render(<Dashbaord id={dashboardId}></Dashbaord>);
    }

    const certificateId = "acadlix_certificate";
    const certificate = document.getElementById(certificateId);
    if (certificate) {
      const certificateRoot = createRoot(certificate);
      certificateRoot.render(<Certificate id={certificateId}></Certificate>);
    }

    const advanceQuizId = "acadlix_advance_quiz";
    const advanceQuiz = document.getElementById(advanceQuizId);
    if (advanceQuiz) {
      const advanceQuizRoot = createRoot(advanceQuiz);
      advanceQuizRoot.render(<AppFront id={advanceQuizId} start={true} advance={true} hide_title={true} hide_description={true}></AppFront>);
    }

    // mutation observer for detect shortcode
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === 1) {
            const targetElement = node.querySelector(".acadlix-front");
            const leaderboardElement = node.querySelector(".acadlix-front-leaderboard");
            const loginElement = node.querySelector(".acadlix-front-login");
            if (targetElement || leaderboardElement || loginElement) {
              document.dispatchEvent(new Event('shortcodeLoaded'));
              // observer.disconnect(); // Stop observing after first detection
            }
          }
        });
      });
    });

    observer.observe(document.body, { childList: true, subtree: true });
  });
})();

