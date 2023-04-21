import AppAdmin from "./admin/AppAdmin";
import { render } from '@wordpress/element';

const acadlixElement = document.getElementById('acadlix-admin');

if (acadlixElement){
    render(<AppAdmin />, acadlixElement);
}