import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { __ } from "@wordpress/i18n";
import { DynamicMUIRenderer } from "@acadlix/modules/extensions/muiRecursiveRenderer";

const DashboardNavbar = ({ handleDrawerToggle, isDesktop }) => {
  const dashboardMenu = window.acadlixHooks?.applyFilters(
    'acadlix.front.dashboard.menu',
    [
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
    ],
    { acadlixOptions })?.filter(Boolean) || [];

  const defaultSetting = {
    component: "List",
    component_name: "dashboard_navbar_list",
    children: dashboardMenu?.map((route, index) => ({
      component_name: "dashboard_navbar_list_item",
      component: <DashboardMenuItem route={route} index={index} handleDrawerToggle={handleDrawerToggle} isDesktop={isDesktop} />,
    }))
  };

  const dashboardNavbar = window.acadlixHooks?.applyFilters(
    'acadlix.front.dashboard.navbar',
    [defaultSetting],
    dashboardMenu
  )?.filter(Boolean) || [];

  return (
    <>
      {dashboardNavbar.map((field, i) => (
        <React.Fragment key={i}>
          <DynamicMUIRenderer
            item={field}
            key={i}
            formProps={{}}
          />
        </React.Fragment>
      ))}
    </>
  )
};

const DashboardMenuItem = ({ route, index, handleDrawerToggle, isDesktop }) => {
  const path = useLocation();
  const navigate = useNavigate();
  const defaultSetting = {
    component: "ListItemButton",
    component_name: "dashboard_navbar_list_item_button",
    props: {
      sx: {
        display: route?.enabled ? "flex" : "none",
      },
      key: index,
      selected: path?.pathname.includes(route?.path),
      onClick: () => {
        if (route?.isRedirect) {
          window.location.href = route.path;
          return;
        }
        navigate(route.path);
        if (!isDesktop) {
          handleDrawerToggle();
        }
      }
    },
    children: [
      {
        component: "ListItemIcon",
        component_name: "dashboard_navbar_list_item_button_icon",
        props: {
          sx: {
            color: (theme) => theme.palette.primary.main,
            minWidth: 30,
            fontSize: 20,
          }
        },
        children: [
          {
            component: route?.icon,
            component_name: "dashboard_navbar_list_item_button_icon_icon",
          }
        ]
      },
      {
        component: "ListItemText",
        component_name: "dashboard_navbar_list_item_button_text",
        props: {
          primary: route.name,
          slotProps: {
            primary: {
              sx: {
                color: path?.pathname.includes(route?.path) ? 'primary.main' : 'text.primary',
              }
            }
          }
        }
      }
    ]
  };

  const dashboardMenuItem = window.acadlixHooks?.applyFilters(
    'acadlix.front.dashboard.navbar.item',
    [defaultSetting],
    route,
    index,
    handleDrawerToggle,
    isDesktop
  )?.filter(Boolean) || [];

  return (
    <>
      {dashboardMenuItem.map((field, i) => (
        <React.Fragment key={i}>
          <DynamicMUIRenderer
            item={field}
            key={i}
            formProps={{}}
          />
        </React.Fragment>
      ))}
    </>
  )
};

export default DashboardNavbar;
