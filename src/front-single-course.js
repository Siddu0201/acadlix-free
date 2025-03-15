import domReady from '@wordpress/dom-ready';
import { createRoot } from '@wordpress/element';
import FrontSingleCourse from './front/FrontSingleCourse';
import Provider from './provider/Provider';

domReady(() => {
    const course = document.getElementById('acadlix-curriculam-react-preview');
    if (course) {
        if (!course.__REACT_ROOT__) {
            course.__REACT_ROOT__ = createRoot(course);
        }

        course.__REACT_ROOT__.render(
            <Provider>
                <FrontSingleCourse course={JSON.parse(acadlixSingleCourse?.course) ?? {}} />
            </Provider>
        );
    }
})