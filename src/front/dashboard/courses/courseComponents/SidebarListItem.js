import React from "react";
import ListItemResource from "./ListItemResource";
import { __ } from "@wordpress/i18n";
import { DynamicMUIRenderer } from "@acadlix/modules/extensions/muiRecursiveRenderer";

const SidebarListItem = (props) => {
  const defaultSetting = {
    component: "ListItem",
    component_name: "sidebar_list_item",
    props: {
      sx: {
        cursor: "pointer",
        bgcolor: (theme) => props?.c?.is_active ? theme.palette.grey.light : "initial",
        "&:hover": {
          bgcolor: (theme) => theme.palette.grey.light,
        },
        paddingX: 1,
      },
      id: `acadlix_course_listitem_${props?.c?.id}`,
      onClick: props?.handleNavigate.bind(this, props?.c?.id),
    },
    children: [
      {
        component: "Checkbox",
        component_name: "sidebar_list_item_checkbox",
        props: {
          checked: props?.c?.is_completed,
          disableRipple: true,
          disabled:
            !props?.c?.is_completed ||
            (props?.c?.is_completed && props?.watch("disable_mark_as_incomplete")),
          onClick: (e) => {
            e?.stopPropagation();
            props?.handleIncomplete(props?.c?.id, props?.index, props?.c_index);
          },
        },
      },
      {
        component: "ListItemText",
        component_name: "sidebar_list_item_text",
        props: {
          primary: `${props?.c_num}. ${props?.c?.title}`,
          secondary: <ListItemSecondary {...props} />,
          slotProps: {
            primary: {
              sx: {
                fontWeight: {
                  xs: 600,
                  sm: 600,
                  md: 600,
                },
              },
            },
            secondary: {
              component: "div",
            }
          }
        },
      }
    ]
  }

  const sidebarListItem = window.acadlixHooks?.applyFilters(
    'acadlix.front.course.courseComponents.sidebarListItem',
    [defaultSetting],
    {
      register: props?.register,
      watch: props?.watch,
      setValue: props?.setValue,
      ...props,
    }
  )?.filter(Boolean) || [];

  return (
    <>
      {sidebarListItem.map((field, i) => (
        <React.Fragment key={i}>
          <DynamicMUIRenderer
            item={field}
            key={i}
            formProps={{
              register: props?.register,
              watch: props?.watch,
              setValue: props?.setValue,
            }}
          />
        </React.Fragment>
      ))}
    </>
  )
  // return (
  //   <ListItem
  //     sx={{
  //       cursor: "pointer",
  //       bgcolor: (theme) => props?.c?.is_active ? theme.palette.grey.light : "initial",
  //       "&:hover": {
  //         bgcolor: (theme) => theme.palette.grey.light,
  //       },
  //       paddingX: 1,
  //     }}
  //     id={`acadlix_course_listitem_${props?.c?.id}`}
  //     onClick={props?.handleNavigate.bind(this, props?.c?.id)}
  //   >
  //     <Checkbox
  //       checked={props?.c?.is_completed}
  //       disableRipple
  //       disabled={
  //         !props?.c?.is_completed ||
  //         (props?.c?.is_completed && props?.watch("disable_mark_as_incomplete"))
  //       }
  //       onClick={(e) => {
  //         e?.stopPropagation();
  //         props?.handleIncomplete(props?.c?.id, props?.index, props?.c_index);
  //       }}
  //     />
  //     <ListItemText
  //       primary={`${props?.c_num}. ${props?.c?.title}`}
  //       secondary={
  //         <Box
  //           sx={{
  //             display: "flex",
  //             justifyContent: "space-between",
  //             alignItems: "center",
  //             paddingRight: 3,
  //           }}
  //         >
  //           <Box>
  //             <Typography
  //               color="text.secondary"
  //               variant="body2"
  //               component="div"
  //               sx={{
  //                 display: "flex",
  //                 alignItems: "center",
  //               }}
  //             >
  //               {props?.c?.type === "lesson" ? (
  //                 props?.c?.lesson_type === "video" ? (
  //                   <FaVideo
  //                     style={{
  //                       marginRight: 5,
  //                     }}
  //                   />
  //                 ) : (
  //                   <FaFile
  //                     style={{
  //                       marginRight: 5,
  //                     }}
  //                   />
  //                 )
  //               ) : (
  //                 <MdQuiz
  //                   style={{
  //                     marginRight: 5,
  //                   }}
  //                 />
  //               )}
  //               {props?.c?.lesson_type === "video" &&
  //                 props?.c?.type === "lesson"
  //                 ? `${props?.c?.hours}:${props?.c?.minutes}:${props?.c?.seconds}`
  //                 : __("1 min", "acadlix")}
  //             </Typography>
  //           </Box>
  //           {(props?.c?.type === "lesson") &&
  //             props?.c?.resources?.length > 0 && (
  //               <ListItemResource {...props} />
  //             )}
  //         </Box>
  //       }
  //       slotProps={{
  //         primary: {
  //           sx: {
  //             fontWeight: {
  //               xs: 600,
  //               sm: 600,
  //               md: 600,
  //             },
  //           }
  //         },
  //         secondary: {
  //           component: "div",
  //         }
  //       }}
  //     />
  //   </ListItem>
  // );
};

export default SidebarListItem;

const ListItemSecondary = (props) => {
  const secondaryIcon = window.acadlixHooks?.applyFilters(
    'acadlix.front.course.courseComponents.sidebarListItemSecondaryIcon',
    [
      {
        "type": "lesson",
        "icon": props?.c?.lesson_type === "video" ? "FaVideo" : "FaFile"
      },
      {
        "type": "quiz",
        "icon": "MdQuiz"
      }
    ],
    {
      c: props?.c,
    }
  );


  const defaultSetting = {
    component: "Box",
    component_name: "sidebar_list_item_secondary_box",
    props: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      paddingRight: 3,
    },
    children: [
      {
        component: "Box",
        component_name: "sidebar_list_item_secondary_inner_box",
        children: [
          {
            component: "Typography",
            component_name: "sidebar_list_item_secondary_typography",
            props: {
              color: "text.secondary",
              variant: "body2",
              component: "div",
              sx: {
                display: "flex",
                alignItems: "center",
              },
            },
            children: [
              {
                component: secondaryIcon?.find((icon) => icon.type === props?.c?.type)?.icon || null,
                props: {
                  style: {
                    marginRight: 5,
                  }
                }
              },
              {
                component: "span",
                value: props?.c?.lesson_type === "video" &&
                  props?.c?.type === "lesson"   
                  ? `${props?.c?.hours}:${props?.c?.minutes}:${props?.c?.seconds}`
                  : __("1 min", "acadlix"),
              }
            ]
          }
        ]
      },
      ...(props?.c?.type === "lesson" && props?.c?.resources?.length > 0
        ? [
          {
            component: <ListItemResource {...props} />,
            component_name: "sidebar_list_item_resource",
          },
        ]
        : []),
    ],
  };

  const listItemSecondary = window.acadlixHooks?.applyFilters(
    'acadlix.front.course.courseComponents.sidebarListItemSecondary',
    [defaultSetting],
    {
      register: props?.register,
      watch: props?.watch,
      setValue: props?.setValue,
      ...props,
    }
  )?.filter(Boolean) || [];


  return (
    <>
      {listItemSecondary.map((field, i) => (
        <React.Fragment key={i}>
          <DynamicMUIRenderer
            item={field}
            key={i}
            formProps={{
              register: props?.register,
              watch: props?.watch,
              setValue: props?.setValue,
            }}
          />
        </React.Fragment>
      ))}
    </>
  )
}
