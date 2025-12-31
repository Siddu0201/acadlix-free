import React from 'react'
import { __ } from '@wordpress/i18n'
import { DynamicMUIRenderer } from '@acadlix/modules/extensions/muiRecursiveRenderer'

const CourseOptions = (props) => {
  const defaultSettings = {
    component: "Fragment",
    component_name: "course_options_fragment",
    children: [
      {
        component: "Box",
        component_name: "course_options_header_box",
        props: {
          sx: {
            marginY: 2
          }
        },
        children: [
          {
            component: "Typography",
            component_name: "course_options_header_typography",
            props: {
              variant: "h4",
            },
            children: [
              {
                component: "span",
                component_name: "course_options_header_span",
                value: __("Course Options", "acadlix")
              },
              {
                component: "CustomFeatureTooltip",
                component_name: "course_options_header_tooltip",
                props: {
                  plan: "open",
                  msg: __("Configure how courses are displayed to students, including the number of courses per page and the option to disable the wishlist feature.", "acadlix"),
                  placement: "right-start",
                  redirectTo: `${acadlixOptions?.acadlix_docs_url}settings/general/#course-options`
                }
              }
            ]
          },
          {
            component: "Divider",
            component_name: "course_options_header_divider",
          }
        ]
      },
      {
        component: "Grid",
        component_name: "course_options_grid_container",
        props: {
          container: true,
          spacing: {
            xs: 2,
            sm: 4,
          },
          sx: {
            alignItems: "center",
          }
        },
        children: [
          {
            component: "Grid",
            component_name: "course_options_grid_item_no_of_courses",
            props: {
              size: {
                xs: 12,
                sm: 6,
                lg: 3,
              }
            },
            children: [
              {
                component: "CustomTypography",
                component_name: "course_options_custom_typography_no_of_courses",
                value: __("No. of courses per page", "acadlix"),
              },
            ]
          },
          {
            component: "Grid",
            component_name: "course_options_grid_item_no_of_courses_input",
            props: {
              size: {
                xs: 12,
                sm: 6,
                lg: 3,
              }
            },
            children: [
              {
                component: "CustomTextField",
                component_name: "course_options_custom_textfield_no_of_courses",
                props: {
                  fullWidth: true,
                  size: "small",
                  type: "number",
                  value: props.watch("acadlix_no_of_courses_per_page"),
                  onChange: (e) => {
                    props.setValue("acadlix_no_of_courses_per_page", e.target.value)
                  },
                  slotProps: {
                    htmlInput: {
                      min: 1,
                    }
                  },
                  sx: {
                    "& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button":
                    {
                      display: "none",
                    },
                    "& input[type=number]": {
                      MozAppearance: "textfield",
                    },
                  }
                }
              }
            ]
          },
          {
            component: "Grid",
            component_name: "course_options_grid_item_disable_wishlist",
            props: {
              size: {
                xs: 12,
                sm: 6,
                lg: 3,
              }
            },
            children: [
              {
                component: "CustomTypography",
                component_name: "course_options_custom_typography_disable_wishlist",
                value: __("Disable Wishlist", "acadlix"),
              },
            ]
          },
          {
            component: "Grid",
            props: {
              size: {
                xs: 12,
                sm: 6,
                lg: 3,
              }
            },
            children: [
              {
                component: "FormControlLabel",
                component_name: "course_options_form_control_label_disable_wishlist",
                props: {
                  control: {
                    component: "CustomSwitch",
                  },
                  label: __("Activate", "acadlix"),
                  checked: props.watch("acadlix_disable_wishlist") === "yes",
                  onChange: (e) => {
                    if (e?.target?.checked !== undefined) {
                      props?.setValue(
                        "acadlix_disable_wishlist",
                        e?.target?.checked ? e?.target?.value : "no",
                        { shouldDirty: true }
                      );
                    }
                  },
                  value: "yes",
                }
              }
            ]
          },
          {
            component: "Grid",
            component_name: "course_options_grid_item_enable_rating_and_reviews",
            props: {
              size: {
                xs: 12,
                sm: 6,
                lg: 3,
              }
            },
            children: [
              {
                component: "CustomTypography",
                component_name: "course_options_custom_typography_enable_rating_and_reviews",
                value: __("Enable rating and reviews", "acadlix"),
              },
            ]
          },
          {
            component: "Grid",
            props: {
              size: {
                xs: 12,
                sm: 6,
                lg: 3,
              }
            },
            children: [
              {
                component: "FormControlLabel",
                component_name: "course_options_form_control_label_enable_rating_and_reviews",
                props: {
                  control: {
                    component: "CustomSwitch",
                  },
                  label: __("Activate", "acadlix"),
                  checked: props.watch("acadlix_enable_rating_and_reviews") === "yes",
                  onChange: (e) => {
                    if (e?.target?.checked !== undefined) {
                      props?.setValue(
                        "acadlix_enable_rating_and_reviews",
                        e?.target?.checked ? e?.target?.value : "no",
                        { shouldDirty: true }
                      );
                    }
                  },
                  value: "yes",
                }
              }
            ]
          },
          {
            component: "Grid",
            component_name: "course_options_grid_item_require_admin_approval_for_reviews",
            props: {
              size: {
                xs: 12,
                sm: 6,
                lg: 3,
              }
            },
            children: [
              {
                component: "CustomTypography",
                component_name: "course_options_custom_typography_require_admin_approval_for_reviews",
                value: __("Require admin approval for reviews", "acadlix"),
              },
            ]
          },
          {
            component: "Grid",
            props: {
              size: {
                xs: 12,
                sm: 6,
                lg: 3,
              }
            },
            children: [
              {
                component: "FormControlLabel",
                component_name: "course_options_form_control_label_require_admin_approval_for_reviews",
                props: {
                  control: {
                    component: "CustomSwitch",
                  },
                  label: __("Activate", "acadlix"),
                  disabled: props.watch("acadlix_enable_rating_and_reviews") !== "yes",
                  checked: props.watch("acadlix_require_admin_approval_for_reviews") === "yes",
                  onChange: (e) => {
                    if (e?.target?.checked !== undefined) {
                      props?.setValue(
                        "acadlix_require_admin_approval_for_reviews",
                        e?.target?.checked ? e?.target?.value : "no",
                        { shouldDirty: true }
                      );
                    }
                  },
                  value: "yes",
                }
              }
            ]
          },
          {
            component: "Grid",
            component_name: "course_options_grid_item_review_pagination_count",
            props: {
              size: {
                xs: 12,
                sm: 6,
                lg: 3,
              }
            },
            children: [
              {
                component: "CustomTypography",
                component_name: "course_options_custom_typography_review_pagination_count",
                value: __("Review pagination count", "acadlix"),
              },
            ]
          },
          {
            component: "Grid",
            component_name: "course_options_grid_item_review_pagination_count_input",
            props: {
              size: {
                xs: 12,
                sm: 6,
                lg: 3,
              }
            },
            children: [
              {
                component: "CustomTextField",
                component_name: "course_options_custom_textfield_review_pagination_count",
                props: {
                  fullWidth: true,
                  size: "small",
                  type: "number",
                  value: props.watch("acadlix_review_pagination_count"),
                  onChange: (e) => {
                    props.setValue("acadlix_review_pagination_count", e.target.value, { shouldDirty: true })
                  },
                  slotProps: {
                    htmlInput: {
                      min: 1,
                    }
                  },
                  disabled: props.watch("acadlix_enable_rating_and_reviews") !== "yes",
                  sx: {
                    "& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button":
                    {
                      display: "none",
                    },
                    "& input[type=number]": {
                      MozAppearance: "textfield",
                    },
                  }
                }
              }
            ]
          },
        ]
      }
    ]
  };

  // 🔹 Apply WordPress-style filter for extensibility
  const course_options_settings = window?.acadlixHooks?.applyFilters?.(
    "acadlix.admin.general.course_options",
    [defaultSettings],
    {
      register: props?.register,
      control: props?.control,
      watch: props?.watch,
      setValue: props?.setValue,
    }
  ) ?? [];
  return (
    <>
      {
        course_options_settings.map((field, i) => (
          <React.Fragment key={i}>
            <DynamicMUIRenderer
              item={field}
              index={i}
              formProps={{
                register: props?.register,
                setValue: props?.setValue,
                watch: props?.watch,
                control: props?.control,
              }}
            />
          </React.Fragment>
        ))
      }
    </>
  )
}

export default CourseOptions