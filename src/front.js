import { render } from '@wordpress/element';
import AppFront from './front/AppFront';
import Dashbaord from './front/Dashbaord';

const shortcode = document.querySelectorAll('.acadlix-front');
if(shortcode.length > 0){
    shortcode.forEach((short, index) => {
        render(<AppFront key={index} id={short.getAttribute('id')} />, short);
    });
}


const dashboard = document.getElementById("acadlix_dashboard");

if(dashboard){
    render(<Dashbaord />, dashboard);
}