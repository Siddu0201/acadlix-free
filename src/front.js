import { render } from '@wordpress/element';
import AppFront from './front/AppFront';
import Dashbaord from './front/Dashbaord';

const shortcode = document.querySelectorAll('.acadlix-front');
if(shortcode.length > 0){
    shortcode.forEach((short, index) => {
        render(<AppFront key={index} quiz_id={short.getAttribute('id')} start={false} />, short);
    });
}

const dashboard = document.getElementById("acadlix_dashboard");

if(dashboard){
    render(<Dashbaord />, dashboard);
}

const advacne_quiz = document.getElementById("acadlix_advance_quiz");

if(advacne_quiz){
    render(<AppFront start={true} advance={true} />, advacne_quiz);
}