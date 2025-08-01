import { __ } from "@wordpress/i18n";
const menus = [
  {
    id: "courses",
    name: __("My Courses", 'acadlix'),
    path: "/courses",
  },
  {
    id: "result",
    name: __("My Result", 'acadlix'),
    path: "/result",
  },
  {
    id: "purcahse",
    name: __("Purchase History", 'acadlix'),
    path: "/purchase",
  },
  acadlixOptions?.settings?.acadlix_disable_wishlist === 'no' && {
    id: "wishlist",
    name: __("Wishlist", 'acadlix'),
    path: "/wishlist",
  },
  {
    id: "profile",
    name: __("Profile", 'acadlix'),
    path: "/profile",
  },
  // {
  //   id: "advance-panel",
  //   name: "Advance Panel",
  //   path: "/advance_panel",
  // },
  // {
  //   id: "ibps",
  //   name: "Ibps",
  //   path: "/ibps",
  // },
  // {
  //   id: "normal-quiz",
  //   name: "Normal Quiz",
  //   path: "/normal",
  // },
];

export default menus;
