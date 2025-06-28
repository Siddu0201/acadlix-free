import AppFront from '@acadlix/front/AppFront';
import Dashbaord from '@acadlix/front/Dashbaord';
import { jsx as _jsx } from 'react/jsx-runtime'
import domReady from '@wordpress/dom-ready';
import { createRoot } from '@wordpress/element';

window.initializeQuizShortcodes = () => {
    const shortcode = document.querySelectorAll('.acadlix-front');
    if (shortcode.length > 0) {
        shortcode.forEach((short, index) => {
            if (short.querySelector(".acadlix-front-quiz-button")) {
                if (!short.__REACT_ROOT__) {
                    short.__REACT_ROOT__ = createRoot(short);
                }

                short.__REACT_ROOT__.render(
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
                );
            }
        });
    }
}

document.addEventListener('shortcodeLoaded', initializeQuizShortcodes);

domReady(() => {
    const dashboard = document.getElementById("acadlix_dashboard");
    if (dashboard) {
        const dashboardRoot = createRoot(dashboard);
        dashboardRoot.render(<Dashbaord ></Dashbaord>);
    }

    const advanceQuiz = document.getElementById("acadlix_advance_quiz");
    if (advanceQuiz) {
        const advanceQuizRoot = createRoot(advanceQuiz);
        advanceQuizRoot.render(<AppFront start={true} advance={true} hide_title={true} hide_description={true}></AppFront>);
    }

    // mutation observer for detect shortcode
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            mutation.addedNodes.forEach((node) => {
                if (node.nodeType === 1) {
                    const targetElement = node.querySelector(".acadlix-front");
                    if (targetElement) {
                        document.dispatchEvent(new Event('shortcodeLoaded'));
                        // observer.disconnect(); // Stop observing after first detection
                    }
                }
            });
        });
    });

    observer.observe(document.body, { childList: true, subtree: true });
});
