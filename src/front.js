import AppFront from './front/AppFront';
import Dashbaord from './front/Dashbaord';
import { jsx as _jsx } from 'react/jsx-runtime'
import domReady from '@wordpress/dom-ready';
import {createRoot} from '@wordpress/element';

domReady(() => {
    const shortcode = document.querySelectorAll('.acadlix-front');
    if(shortcode.length > 0){
        shortcode.forEach((short, index) => {
            let shortcodeRoot = createRoot(short);
            shortcodeRoot.render(<AppFront quiz_elm={short} elm_index={index} key={index} quiz_id={short.getAttribute('id')} start={false} advance={false} hide_title={true} hide_description={true}></AppFront>);
        });
    }
    
    const dashboard = document.getElementById("acadlix_dashboard");
    if(dashboard){
        const dashboardRoot = createRoot(dashboard);
        dashboardRoot.render(<Dashbaord ></Dashbaord>);
    }
    
    const advanceQuiz = document.getElementById("acadlix_advance_quiz");
    if(advanceQuiz){
        const advanceQuizRoot = createRoot(advanceQuiz);
        advanceQuizRoot.render(<AppFront start={true} advance={true} hide_title={true} hide_description={true}></AppFront>);
    }
});
