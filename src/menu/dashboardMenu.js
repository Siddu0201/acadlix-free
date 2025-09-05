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

const menus = [
  {
    id: "home",
    name: __("Home", 'acadlix'),
    path: acadlixOptions?.home_url,
    isRedirect: true,
    icon: <FaHome />,
  },
  {
    id: "courses",
    name: __("My Courses", 'acadlix'),
    path: "/courses",
    isRedirect: false,
    icon: <MdLibraryBooks />,
  },
  {
    id: "result",
    name: __("My Result", 'acadlix'),
    path: "/result",
    isRedirect: false,
    icon: <MdAssessment />,
  },
  {
    id: "purcahse",
    name: __("Purchase History", 'acadlix'),
    path: "/purchase",
    isRedirect: false,
    icon: <MdReceiptLong />,
  },
  acadlixOptions?.settings?.acadlix_disable_wishlist === 'no' && {
    id: "wishlist",
    name: __("Wishlist", 'acadlix'),
    path: "/wishlist",
    isRedirect: false,
    icon: <FaHeart />,
  },
  {
    id: "profile",
    name: __("Profile", 'acadlix'),
    path: "/profile",
    isRedirect: false,
    icon: <FaUserCircle />,
  },
  {
    id: "logout",
    name: __("Logout", 'acadlix'),
    path: acadlixOptions?.logout_url,
    isRedirect: true,
    icon: <FiLogOut />,
  },
];

export default menus;
