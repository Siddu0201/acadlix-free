import React from 'react'
import { Box, Button, Card, CardActions, CardContent, Divider, Typography } from "@mui/material";
import Grid from '@mui/material/Grid';
import { __ } from "@wordpress/i18n";
import { DynamicMUIRenderer } from '@acadlix/modules/extensions/muiRecursiveRenderer';
import CustomTypography from '@acadlix/components/CustomTypography';
import OpenAiOption from '@acadlix/free/admin/setting/integration/OpenAiOption';

// const OpenAiOption = React.lazy(() =>
//     process.env.REACT_APP_IS_PREMIUM === 'true' ?
//         import(
//             /* webpackChunkName: "admin_setting_integration_open_ai_option" */
//             "@acadlix/pro/admin/setting/integration/OpenAiOption") :
//         import(
//             /* webpackChunkName: "admin_setting_integration_open_ai_option" */
//             "@acadlix/free/admin/setting/integration/OpenAiOption")
// );



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
                        value: __("OpenAI API Key", "acadlix"),
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

  // const integration_before_start = window?.acadlixHooks?.applyFilters?.(
  //   "acadlix.admin.settings.integration.before_start",
  //   [],
  //   {
  //     register: props?.register,
  //     control: props?.control,
  //     watch: props?.watch,
  //     setValue: props?.setValue,
  //   }
  // ) ?? [];
  // const integration_after_start = window?.acadlixHooks?.applyFilters?.(
  //   "acadlix.admin.settings.integration.after_start",
  //   [],
  //   {
  //     register: props?.register,
  //     control: props?.control,
  //     watch: props?.watch,
  //     setValue: props?.setValue,
  //   }
  // ) ?? [];

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

  // return (
  //   <Card>
  //     <CardContent>
  //       <Box>
  //         {integration_before_start.map((field, i) => (
  //           <React.Fragment key={`field-${i}`}>
  //             <DynamicMUIRenderer
  //               item={field}
  //               index={i}
  //               formProps={{
  //                 register: props?.register,
  //                 setValue: props?.setValue,
  //                 watch: props?.watch,
  //                 control: props?.control,
  //               }}
  //             />
  //           </React.Fragment>
  //         ))}
  //         {/* Open AI  */}
  //         <Box
  //           sx={{
  //             marginY: 2,
  //           }}
  //         >
  //           <Typography variant="h4">{__("AI Intergrations", "acadlix")}</Typography>
  //           <Divider />
  //         </Box>
  //         <Grid
  //           container
  //           spacing={{
  //             xs: 2,
  //             sm: 4,
  //           }}
  //           sx={{
  //             alignItems: "center",
  //           }}
  //         >
  //           <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
  //             <CustomTypography>
  //               {__("OpenAI API Key", "acadlix")}
  //             </CustomTypography>
  //           </Grid>
  //           <Grid size={{ xs: 12, sm: 6, lg: 9 }}>
  //             <React.Suspense fallback={null}>
  //               <OpenAiOption
  //                 {...props}
  //               />
  //             </React.Suspense>
  //           </Grid>
  //         </Grid>
  //         {integration_after_start.map((field, i) => (
  //           <React.Fragment key={`field-${i}`}>
  //             <DynamicMUIRenderer
  //               item={field}
  //               index={i}
  //               formProps={{
  //                 register: props?.register,
  //                 setValue: props?.setValue,
  //                 watch: props?.watch,
  //                 control: props?.control,
  //               }}
  //             />
  //           </React.Fragment>
  //         ))}
  //       </Box>
  //     </CardContent>
  //     <CardActions>
  //       <Button
  //         variant="contained"
  //         color="primary"
  //         type="submit"
  //         loading={props?.isPending}
  //       >
  //         {__("Save", "acadlix")}
  //       </Button>
  //     </CardActions>
  //   </Card>
  // )
}

export default Integration