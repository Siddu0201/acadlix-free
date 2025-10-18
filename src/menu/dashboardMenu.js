import { __ } from "@wordpress/i18n";

let menus = window.acadlixHooks?.applyFilters('acadlix.front.dashboard.menu', [
  {
    id: "home",
    name: __("Home", 'acadlix'),
    path: acadlixOptions?.home_url,
    isRedirect: true,
    icon: "FaHome",
    default: true,
    enabled: acadlixOptions?.settings?.acadlix_disable_home_menu === 'no',
  },
  {
    id: "courses",
    name: __("My Courses", 'acadlix'),
    path: "/courses",
    isRedirect: false,
    icon: "MdLibraryBooks",
    default: true,
    enabled: true,
  },
  {
    id: "result",
    name: __("My Result", 'acadlix'),
    path: "/result",
    isRedirect: false,
    icon: "MdAssessment",
    default: true,
    enabled: true,
  },
  {
    id: "purcahse",
    name: __("Purchase History", 'acadlix'),
    path: "/purchase",
    isRedirect: false,
    icon: "MdReceiptLong",
    default: true,
    enabled: true,
  },
  {
    id: "wishlist",
    name: __("Wishlist", 'acadlix'),
    path: "/wishlist",
    isRedirect: false,
    icon: "FaHeart",
    default: true,
    enabled: acadlixOptions?.settings?.acadlix_disable_wishlist === 'no',
  },
  {
    id: "profile",
    name: __("Profile", 'acadlix'),
    path: "/profile",
    isRedirect: false,
    icon: "FaUserCircle",
    default: true,
    enabled: true,
  },
  {
    id: "logout",
    name: __("Logout", 'acadlix'),
    path: acadlixOptions?.logout_url,
    isRedirect: true,
    icon: "FiLogOut",
    default: true,
    enabled: true,
  },
], acadlixOptions)?.filter(Boolean) || [];

export default menus;
