import React from 'react'
import { __ } from "@wordpress/i18n";
import { DynamicMUIRenderer } from '@acadlix/modules/extensions/muiRecursiveRenderer';
import OpenAiOption from '@acadlix/free/admin/setting/integration/OpenAiOption';

const Integration = (props) => {

  const defaultSetting = {
    component: "Card",
    component_name: "setting_integration_card",
    children: [
      {
        component: "CardContent",
        component_name: "setting_integration_card_content",
        children: [
          {
            component: "Box",
            component_name: "setting_integration_box",
            children: [
              {
                component: "Box",
                component_name: "setting_integration_ai_header_box",
                props: {
                  sx: {
                    marginY: 2,
                  },
                },
                children: [
                  {
                    component: "Typography",
                    component_name: "setting_integration_ai_header_typography",
                    props: {
                      variant: "h4",
                    },
                    value: __("AI Intergrations", "acadlix"),
                  },
                  {
                    component: "Divider",
                    component_name: "setting_integration_ai_header_divider",
                  },
                ],
              },
              {
                component: "Grid",
                component_name: "setting_integration_ai_grid",
                props: {
                  container: true,
                  spacing: {
                    xs: 2,
                    sm: 4,
                  },
                  sx: {
                    alignItems: "center",
                  },
                },
                children: [
                  {
                    component: "Grid",
                    component_name: "setting_integration_ai_grid_item_label",
                    props: {
                      size: { xs: 12, sm: 6, lg: 3 },
                    },
                    children: [
                      {
                        component: "CustomTypography",
                        component_name: "setting_integration_ai_grid_item_label_typography",
                        // value: __("OpenAI API Key", "acadlix"),
                        children: [
                          {
                            component: "span",
                            component_name: "setting_integration_ai_grid_premium_span",
                            value: __("OpenAI API Key", "acadlix"),
                          }
                        ],
                      },
                    ],
                  },
                  {
                    component: "Grid",
                    component_name: "setting_integration_ai_grid_item_input",
                    props: {
                      size: { xs: 12, sm: 6, lg: 9 },
                    },
                    children: [
                      {
                        component: <OpenAiOption {...props} />,
                        component_name: "setting_integration_ai_grid_item_input_openai_option",
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        component: "CardActions",
        component_name: "setting_integration_card_actions",
        children: [
          {
            component: "Button",
            component_name: "setting_integration_card_actions_save_button",
            props: {
              variant: "contained",
              color: "primary",
              type: "submit",
              loading: props?.isPending,
            },
            value: __("Save", "acadlix"),
          },
        ],
      },
    ],
  };

  const integration_settings = window?.acadlixHooks?.applyFilters?.(
    "acadlix.admin.settings.integration",
    [defaultSetting],
    {
      register: props?.register,
      control: props?.control,
      watch: props?.watch,
      setValue: props?.setValue,
    }
  ) ?? [];

  return (
    <>
      {integration_settings.map((field, i) => (
        <React.Fragment key={`field-${i}`}>
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
      ))}
    </>
  )
}

export default Integration