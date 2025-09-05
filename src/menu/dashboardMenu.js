import {
  MdLibraryBooks,
  MdAssessment,
  MdReceiptLong,
  FaHeart,
  FaUserCircle,
  FaHome,
  FiLogOut,
} from "@acadlix/helpers/icons";
import { __ } from "@wordpress/i18n";

let menus = [];

if (acadlixOptions?.settings?.acadlix_disable_home_menu === 'no') {
  menus.push({
    id: "home",
    name: __("Home", 'acadlix'),
    path: acadlixOptions?.home_url,
    isRedirect: true,
    icon: <FaHome />,
  });
}
menus.push({
  id: "courses",
  name: __("My Courses", 'acadlix'),
  path: "/courses",
  isRedirect: false,
  icon: <MdLibraryBooks />,
});
menus.push({
  id: "result",
  name: __("My Result", 'acadlix'),
  path: "/result",
  isRedirect: false,
  icon: <MdAssessment />,
});
menus.push({
  id: "purcahse",
  name: __("Purchase History", 'acadlix'),
  path: "/purchase",
  isRedirect: false,
  icon: <MdReceiptLong />,
});

if (acadlixOptions?.settings?.acadlix_disable_wishlist === 'no') {
  menus.push({
    id: "wishlist",
    name: __("Wishlist", 'acadlix'),
    path: "/wishlist",
    isRedirect: false,
    icon: <FaHeart />,
  });
}

menus.push({
  id: "profile",
  name: __("Profile", 'acadlix'),
  path: "/profile",
  isRedirect: false,
  icon: <FaUserCircle />,
});

menus.push({
  id: "logout",
  name: __("Logout", 'acadlix'),
  path: acadlixOptions?.logout_url,
  isRedirect: true,
  icon: <FiLogOut />,
});

export default menus;
