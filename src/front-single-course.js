import domReady from '@wordpress/dom-ready';
import { createRoot } from '@wordpress/element';
import FrontSingleCourse from './front/FrontSingleCourse';
import Provider from './provider/Provider';

domReady(() => {
    const course = document.getElementById('acadlix-curriculam-react-preview');
    if (course) {
        let courseRoot = createRoot(course);
        courseRoot.render(<Provider><FrontSingleCourse course={JSON.parse(acadlixSingleCourse?.course) ?? {}}></FrontSingleCourse></Provider>);
    }
})