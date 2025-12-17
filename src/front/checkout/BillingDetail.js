import {
  Box,
  TextField,
} from "@mui/material";
import React from "react";
import { Country } from "country-state-city";
import { __ } from "@wordpress/i18n";
import { DynamicMUIRenderer } from "@acadlix/modules/extensions/muiRecursiveRenderer";

const BillingDetail = (props) => {
  const defaultSetting = {
    component: "Box",
    component_name: "checkout_billing_detail_box",
    children: [
      {
        component: "Card",
        component_name: "checkout_billing_detail_card",
        children: [
          {
            component: "CardHeader",
            component_name: "checkout_billing_detail_card_header",
            props: {
              title: __("Billing Detail", "acadlix"),
            },
          },
          {
            component: "Divider",
            component_name: "checkout_billing_detail_divider",
          },
          {
            component: "CardContent",
            component_name: "checkout_billing_detail_card_content",
            children: [
              {
                component: "Grid",
                component_name: "checkout_billing_detail_grid",
                props: {
                  container: true,
                  spacing: 4,
                },
                children: [
                  {
                    component: "Grid",
                    component_name: "checkout_billing_detail_grid_item_first_name",
                    props: {
                      size: { xs: 12, md: 6 },
                    },
                    children: [
                      {
                        component: "Typography",
                        component_name: "checkout_billing_detail_typography_first_name",
                        props: {
                          variant: "body2",
                          sx: {
                            paddingY: 1,
                          },
                        },
                        children: [
                          {
                            component: "span",
                            component_name: "checkout_billing_detail_typography_first_name_span_label",
                            value: __('First Name', 'acadlix'),
                          },
                          {
                            component: "span",
                            component_name: "checkout_billing_detail_typography_first_name_span_required",
                            props: {
                              style: { color: "red" },
                            },
                            value: " *",
                          }
                        ],
                      },
                      {
                        component: "CustomTextField",
                        component_name: "checkout_billing_detail_custom_textfield_first_name",
                        props: {
                          ...props?.register("billing_info.first_name", {
                            required: __("First name is required.", "acadlix"),
                          }),
                          required: true,
                          fullWidth: true,
                          size: "small",
                          type: "text",
                          placeholder: __('e.g. John', 'acadlix'),
                          value: props?.watch("billing_info.first_name"),
                          onChange: (e) => {
                            props?.setValue("billing_info.first_name", e?.target?.value, {
                              shouldDirty: true,
                            });
                          },
                          disabled: !props?.watch("is_user_logged_in"),
                          error: Boolean(
                            props?.formState?.errors?.billing_info?.first_name
                          ),
                          helperText: props?.formState?.errors?.billing_info?.first_name?.message,
                        },
                      },
                    ]
                  },
                  {
                    component: "Grid",
                    component_name: "checkout_billing_detail_grid_item_last_name",
                    props: {
                      size: { xs: 12, md: 6 },
                    },
                    children: [
                      {
                        component: "Typography",
                        component_name: "checkout_billing_detail_typography_last_name",
                        props: {
                          variant: "body2",
                          sx: {
                            paddingY: 1,
                          },
                        },
                        value: __('Last Name', 'acadlix'),
                      },
                      {
                        component: "CustomTextField",
                        component_name: "checkout_billing_detail_custom_textfield_last_name",
                        props: {
                          fullWidth: true,
                          size: "small",
                          type: "text",
                          placeholder: __('e.g. Doe', 'acadlix'),
                          value: props?.watch("billing_info.last_name"),
                          onChange: (e) => {
                            props?.setValue("billing_info.last_name", e?.target?.value, {
                              shouldDirty: true,
                            });
                          },
                          disabled: !props?.watch("is_user_logged_in"),
                        },
                      },
                    ]
                  },
                  {
                    component: "Grid",
                    component_name: "checkout_billing_detail_grid_item_email",
                    props: {
                      size: { xs: 12, md: 12 },
                    },
                    children: [
                      {
                        component: "Typography",
                        component_name: "checkout_billing_detail_typography_email",
                        props: {
                          variant: "body2",
                          sx: {
                            paddingY: 1,
                          },
                        },
                        children: [
                          {
                            component: "span",
                            component_name: "checkout_billing_detail_typography_email_span_label",
                            value: __('Email', 'acadlix'),
                          },
                          {
                            component: "span",
                            component_name: "checkout_billing_detail_typography_email_span_required",
                            props: {
                              style: { color: "red" },
                            },
                            value: "*",
                          }
                        ],
                      },
                      {
                        component: "CustomTextField",
                        component_name: "checkout_billing_detail_custom_textfield_email",
                        props: {
                          ...props?.register("billing_info.email", {
                            required: __("Email is required.", "acadlix"),
                          }),
                          required: true,
                          fullWidth: true,
                          size: "small",
                          type: "email",
                          placeholder: __("e.g. example@example.com", "acadlix"),
                          value: props?.watch("billing_info.email"),
                          onChange: (e) => {
                            props?.setValue("billing_info.email", e?.target?.value, {
                              shouldDirty: true,
                            });
                          },
                          disabled: !props?.watch("is_user_logged_in"),
                          error: Boolean(props?.formState?.errors?.billing_info?.email),
                          helperText: props?.formState?.errors?.billing_info?.email?.message,
                        },
                      },
                    ],
                  },
                  {
                    component: "Grid",
                    component_name: "checkout_billing_detail_grid_item_phone_code",
                    props: {
                      size: { xs: 3, md: 3 },
                    },
                    children: [
                      {
                        component: "Typography",
                        component_name: "checkout_billing_detail_typography_phone_code",
                        props: {
                          variant: "body2",
                          sx: {
                            paddingY: 1,
                          },
                        },
                        value: __('Code', 'acadlix'),
                      },
                      {
                        component: "Autocomplete",
                        component_name: "checkout_billing_detail_autocomplete_phone_code",
                        props: {
                          fullWidth: true,
                          id: "phonecode",
                          autoComplete: true,
                          size: "small",
                          options: Country.getAllCountries(),
                          getOptionLabel: (option) =>
                            `${option.phonecode} (${option.isoCode})`,
                          value:
                            props.watch("billing_info.phonecode") !== null
                              ? Country?.getAllCountries()?.find(
                                (country) =>
                                  country?.phonecode ===
                                  props?.watch("billing_info.phonecode")
                              ) ?? null
                              : null,
                          onChange: (_, newValue) => {
                            props.setValue(
                              "billing_info.phonecode",
                              newValue?.phonecode,
                              {
                                shouldDirty: true,
                              }
                            );
                          },
                          disabled: !props?.watch("is_user_logged_in"),
                          renderOption: (props, option) => (
                            <Box
                              component="li"
                              {...props}
                              sx={{
                                fontSize: "11px",
                              }}
                            >
                              {option.phonecode} ({option.isoCode})
                            </Box>
                          ),
                          renderInput: (params) => (
                            <TextField
                              {...params}
                              label="Code"
                              inputProps={{
                                ...params.inputProps,
                                autoComplete: "code",
                              }}
                              sx={{
                                "& .MuiInputBase-input": {
                                  height: "auto",
                                },
                              }}
                            />
                          ),
                        },
                      },
                    ],
                  },
                  {
                    component: "Grid",
                    component_name: "checkout_billing_detail_grid_item_phone_number",
                    props: {
                      size: { xs: 9, md: 9 },
                    },
                    children: [
                      {
                        component: "Typography",
                        component_name: "checkout_billing_detail_typography_phone_number",
                        props: {
                          variant: "body2",
                          sx: {
                            paddingY: 1,
                          },
                        },
                        value: __('Phone Number', 'acadlix'),
                      },
                      {
                        component: "CustomTextField",
                        component_name: "checkout_billing_detail_custom_textfield_phone_number",
                        props: {
                          fullWidth: true,
                          size: "small",
                          type: "tel", // Input type for telephone numbers
                          value: props?.watch("billing_info.phone_number"),
                          onChange: (e) => {
                            const inputValue = e?.target?.value;
                            if (/^[0-9\-\(\) ]+$/.test(inputValue) || inputValue === '') {
                              props?.setValue(
                                "billing_info.phone_number",
                                inputValue,
                                {
                                  shouldDirty: true,
                                }
                              );
                            }
                          },
                          disabled: !props?.watch("is_user_logged_in"),
                        },
                      },
                    ],
                  },
                  {
                    component: "Grid",
                    component_name: "checkout_billing_detail_grid_item_address",
                    props: {
                      size: { xs: 12, md: 12 },
                    },
                    children: [
                      {
                        component: "Typography",
                        component_name: "checkout_billing_detail_typography_address",
                        props: {
                          variant: "body2",
                          sx: {
                            paddingY: 1,
                          },
                        },
                        value: __('Address', 'acadlix'),
                      },
                      {
                        component: "CustomTextField",
                        component_name: "checkout_billing_detail_custom_textfield_address",
                        props: {
                          fullWidth: true,
                          size: "small",
                          placeholder: __("e.g. 12345 Little baker St, Melbourne", "acadlix"),
                          type: "text",
                          value: props?.watch("billing_info.address"),
                          onChange: (e) => {
                            props?.setValue("billing_info.address", e?.target?.value, {
                              shouldDirty: true,
                            });
                          },
                          disabled: !props?.watch("is_user_logged_in"),
                        },
                      },
                    ],
                  },
                  {
                    component: "Grid",
                    component_name: "checkout_billing_detail_grid_item_country",
                    props: {
                      size: { xs: 12, md: 4 },
                    },
                    children: [
                      {
                        component: "Typography",
                        component_name: "checkout_billing_detail_typography_country",
                        props: {
                          variant: "body2",
                          sx: {
                            paddingY: 1,
                          },
                        },
                        value: __('Country', 'acadlix'),
                      },
                      {
                        component: "Autocomplete",
                        component_name: "checkout_billing_detail_autocomplete_country",
                        props: {
                          fullWidth: true,
                          id: "country",
                          autoComplete: true,
                          size: "small",
                          options: Country.getAllCountries(),
                          getOptionLabel: (option) => `${option.name}`,
                          value:
                            props.watch("billing_info.country") !== null
                              ? Country.getAllCountries()?.find(
                                (country) =>
                                  country?.name === props.watch("billing_info.country")
                              ) ?? null
                              : null,
                          onChange: (_, newValue) => {
                            props.setValue("billing_info.country_code", newValue?.isoCode, {
                              shouldDirty: true,
                            });
                            props.setValue("billing_info.country", newValue?.name, {
                              shouldDirty: true,
                            });
                          },
                          disabled: !props?.watch("is_user_logged_in"),
                          renderOption: (props, option) => (
                            <Box
                              component="li"
                              {...props}
                              sx={{
                                fontSize: "11px",
                              }}
                            >
                              {option.name}
                            </Box>
                          ),
                          renderInput: (params) => (
                            <TextField
                              {...params}
                              placeholder="country"
                              inputProps={{
                                ...params.inputProps,
                                autoComplete: "country",
                              }}
                              sx={{
                                "& .MuiInputBase-input": {
                                  height: "auto",
                                },
                              }}
                            />
                          ),
                        },
                      },
                    ],
                  },
                  {
                    component: "Grid",
                    component_name: "checkout_billing_detail_grid_item_city",
                    props: {
                      size: { xs: 12, md: 4 },
                    },
                    children: [
                      {
                        component: "Typography",
                        component_name: "checkout_billing_detail_typography_city",
                        props: {
                          variant: "body2",
                          sx: {
                            paddingY: 1,
                          },
                        },
                        value: __("Town/City", "acadlix"),
                      },
                      {
                        component: "CustomTextField",
                        component_name: "checkout_billing_detail_custom_textfield_city",
                        props: {
                          fullWidth: true,
                          size: "small",
                          placeholder: __("Town/City", "acadlix"),
                          type: "text",
                          value: props?.watch("billing_info.city"),
                          onChange: (e) => {
                            props?.setValue("billing_info.city", e?.target?.value, {
                              shouldDirty: true,
                            });
                          },
                          disabled: !props?.watch("is_user_logged_in"),
                        },
                      },
                    ],
                  },
                  {
                    component: "Grid",
                    component_name: "checkout_billing_detail_grid_item_zip_code",
                    props: {
                      size: { xs: 12, md: 4 },
                    },
                    children: [
                      {
                        component: "Typography",
                        component_name: "checkout_billing_detail_typography_zip_code",
                        props: {
                          variant: "body2",
                          sx: {
                            paddingY: 1,
                          },
                        },
                        value: __("Postal/Zip Code", "acadlix"),
                      },
                      {
                        component: "CustomTextField",
                        component_name: "checkout_billing_detail_custom_textfield_zip_code",
                        props: {
                          fullWidth: true,
                          size: "small",
                          placeholder: __("Postal/Zip Code", "acadlix"),
                          type: "text",
                          value: props?.watch("billing_info.zip_code"),
                          onChange: (e) => {
                            props?.setValue("billing_info.zip_code", e?.target?.value, {
                              shouldDirty: true,
                            });
                          },
                          disabled: !props?.watch("is_user_logged_in"),
                        },
                      },
                    ],
                  },
                ],
              },
            ],
          }
        ],
      }
    ],
  };

  const billing_info = window?.acadlixHooks?.applyFilters(
    "acadlix.front.checkout.billing_detail",
    [defaultSetting],
    {
      register: props?.register,
      watch: props?.watch,
      setValue: props?.setValue,
      control: props?.control,
    }
  ) ?? [];

  return (
    <>
      {billing_info.map((field, i) => (
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
      ))}
    </>
  );
  // return (
  //   <Box>
  //     <Card>
  //       <CardHeader title={__('Billing Detail', 'acadlix')} />
  //       <Divider />
  //       <CardContent>
  //         <Grid container spacing={4}>
  //           <Grid size={{ xs: 12, md: 6 }}>
  //             <Typography
  //               variant="body2"
  //               sx={{
  //                 paddingY: 1,
  //               }}
  //             >
  //               {__('First Name', 'acadlix')} <span style={{ color: 'red' }}>*</span>
  //             </Typography>
  //             <CustomTextField
  //               {...props?.register("billing_info.first_name", {
  //                 required: __("First name is required.", "acadlix"),
  //               })}
  //               required
  //               fullWidth
  //               size="small"
  //               type="text"
  //               placeholder={__('e.g. John', 'acadlix')}
  //               value={props?.watch("billing_info.first_name")}
  //               onChange={(e) => {
  //                 props?.setValue("billing_info.first_name", e?.target?.value, {
  //                   shouldDirty: true,
  //                 });
  //               }}
  //               disabled={!props?.watch("is_user_logged_in")}
  //               error={Boolean(
  //                 props?.formState?.errors?.billing_info?.first_name
  //               )}
  //               helperText={
  //                 props?.formState?.errors?.billing_info?.first_name?.message
  //               }
  //             />
  //           </Grid>
  //           <Grid size={{ xs: 12, md: 6 }}>
  //             <Typography
  //               variant="body2"
  //               sx={{
  //                 paddingY: 1,
  //               }}
  //             >
  //               {__('Last Name', 'acadlix')}
  //             </Typography>
  //             <CustomTextField
  //               fullWidth
  //               size="small"
  //               type="text"
  //               placeholder={__('e.g. Doe', 'acadlix')}
  //               value={props?.watch("billing_info.last_name")}
  //               onChange={(e) => {
  //                 props?.setValue("billing_info.last_name", e?.target?.value, {
  //                   shouldDirty: true,
  //                 });
  //               }}
  //               disabled={!props?.watch("is_user_logged_in")}
  //             />
  //           </Grid>
  //           <Grid size={{ xs: 12, md: 12 }}>
  //             <Typography
  //               variant="body2"
  //               sx={{
  //                 paddingY: 1,
  //               }}
  //             >
  //               {__('Email', 'acadlix')}
  //             </Typography>
  //             <CustomTextField
  //               {...props?.register("billing_info.email", {
  //                 required: __("Email is required.", "acadlix"),
  //               })}
  //               required
  //               fullWidth
  //               size="small"
  //               type="email"
  //               placeholder={__("e.g. example@example.com", "acadlix")}
  //               value={props?.watch("billing_info.email")}
  //               onChange={(e) => {
  //                 props?.setValue("billing_info.email", e?.target?.value, {
  //                   shouldDirty: true,
  //                 });
  //               }}
  //               disabled={!props?.watch("is_user_logged_in")}
  //               error={Boolean(props?.formState?.errors?.billing_info?.email)}
  //               helperText={
  //                 props?.formState?.errors?.billing_info?.email?.message
  //               }
  //             />
  //           </Grid>
  //           <Grid size={{ xs: 3, md: 3 }}>
  //             <Typography
  //               variant="body2"
  //               sx={{
  //                 paddingY: 1,
  //               }}
  //             >
  //               {__('Code', 'acadlix')}
  //             </Typography>
  //             <Autocomplete
  //               fullWidth
  //               id="phonecode"
  //               autoComplete
  //               size="small"
  //               options={Country.getAllCountries()}
  //               getOptionLabel={(option) =>
  //                 `${option.phonecode} (${option.isoCode})`
  //               }
  //               value={
  //                 props.watch("billing_info.phonecode") !== null
  //                   ? Country?.getAllCountries()?.find(
  //                     (country) =>
  //                       country?.phonecode ===
  //                       props?.watch("billing_info.phonecode")
  //                   ) ?? null
  //                   : null
  //               }
  //               onChange={(_, newValue) => {
  //                 props.setValue(
  //                   "billing_info.phonecode",
  //                   newValue?.phonecode,
  //                   {
  //                     shouldDirty: true,
  //                   }
  //                 );
  //               }}
  //               disabled={!props?.watch("is_user_logged_in")}
  //               renderOption={(props, option) => (
  //                 <Box
  //                   component="li"
  //                   {...props}
  //                   sx={{
  //                     fontSize: "11px",
  //                   }}
  //                 >
  //                   {option.phonecode} ({option.isoCode})
  //                 </Box>
  //               )}
  //               renderInput={(params) => (
  //                 <TextField
  //                   {...params}
  //                   label="Code"
  //                   inputProps={{
  //                     ...params.inputProps,
  //                     autoComplete: "code",
  //                   }}
  //                   sx={{
  //                     "& .MuiInputBase-input": {
  //                       height: "auto",
  //                     },
  //                   }}
  //                 />
  //               )}
  //             />
  //           </Grid>
  //           <Grid size={{ xs: 9, md: 9 }}>
  //             <Typography
  //               variant="body2"
  //               sx={{
  //                 paddingY: 1,
  //               }}
  //             >
  //               {__('Phone Number', 'acadlix')}
  //             </Typography>
  //             <CustomTextField
  //               fullWidth
  //               size="small"
  //               type="tel" // Input type for telephone numbers
  //               value={props?.watch("billing_info.phone_number")}
  //               onChange={(e) => {
  //                 const inputValue = e?.target?.value;
  //                 if (/^[0-9\-\(\) ]+$/.test(inputValue) || inputValue === '') {
  //                   props?.setValue(
  //                     "billing_info.phone_number",
  //                     inputValue,
  //                     {
  //                       shouldDirty: true,
  //                     }
  //                   );
  //                 }
  //               }}
  //               disabled={!props?.watch("is_user_logged_in")}
  //             />
  //           </Grid>
  //           <Grid size={{ xs: 12, md: 12 }}>
  //             <Typography
  //               variant="body2"
  //               sx={{
  //                 paddingY: 1,
  //               }}
  //             >
  //               {__('Address', 'acadlix')}
  //             </Typography>
  //             <CustomTextField
  //               fullWidth
  //               size="small"
  //               placeholder={__("e.g. 12345 Little baker St, Melbourne", "acadlix")}
  //               type="text"
  //               value={props?.watch("billing_info.address")}
  //               onChange={(e) => {
  //                 props?.setValue("billing_info.address", e?.target?.value, {
  //                   shouldDirty: true,
  //                 });
  //               }}
  //               disabled={!props?.watch("is_user_logged_in")}
  //             />
  //           </Grid>
  //           <Grid size={{ xs: 12, md: 4 }}>
  //             <Typography
  //               variant="body2"
  //               sx={{
  //                 paddingY: 1,
  //               }}
  //             >
  //               {__('Country', 'acadlix')}
  //             </Typography>
  //             <Autocomplete
  //               fullWidth
  //               id="country"
  //               autoComplete
  //               size="small"
  //               options={Country.getAllCountries()}
  //               getOptionLabel={(option) => `${option.name}`}
  //               value={
  //                 props.watch("billing_info.country") !== null
  //                   ? Country.getAllCountries()?.find(
  //                     (country) =>
  //                       country?.name === props.watch("billing_info.country")
  //                   ) ?? null
  //                   : null
  //               }
  //               onChange={(_, newValue) => {
  //                 props.setValue("billing_info.country_code", newValue?.isoCode, {
  //                   shouldDirty: true,
  //                 });
  //                 props.setValue("billing_info.country", newValue?.name, {
  //                   shouldDirty: true,
  //                 });
  //               }}
  //               disabled={!props?.watch("is_user_logged_in")}
  //               renderOption={(props, option) => (
  //                 <Box
  //                   component="li"
  //                   {...props}
  //                   sx={{
  //                     fontSize: "11px",
  //                   }}
  //                 >
  //                   {option.name}
  //                 </Box>
  //               )}
  //               renderInput={(params) => (
  //                 <TextField
  //                   {...params}
  //                   placeholder="country"
  //                   inputProps={{
  //                     ...params.inputProps,
  //                     autoComplete: "country",
  //                   }}
  //                   sx={{
  //                     "& .MuiInputBase-input": {
  //                       height: "auto",
  //                     },
  //                   }}
  //                 />
  //               )}
  //             />
  //           </Grid>
  //           <Grid size={{ xs: 12, md: 4 }}>
  //             <Typography
  //               variant="body2"
  //               sx={{
  //                 paddingY: 1,
  //               }}
  //             >
  //               {__("Town/City", "acadlix")}
  //             </Typography>
  //             <CustomTextField
  //               fullWidth
  //               size="small"
  //               placeholder={__("Town/City", "acadlix")}
  //               type="text"
  //               value={props?.watch("billing_info.city")}
  //               onChange={(e) => {
  //                 props?.setValue("billing_info.city", e?.target?.value, {
  //                   shouldDirty: true,
  //                 });
  //               }}
  //               disabled={!props?.watch("is_user_logged_in")}
  //             />
  //           </Grid>
  //           <Grid size={{ xs: 12, md: 4 }}>
  //             <Typography
  //               variant="body2"
  //               sx={{
  //                 paddingY: 1,
  //               }}
  //             >
  //               {__("Postal/Zip Code", "acadlix")}
  //             </Typography>
  //             <CustomTextField
  //               fullWidth
  //               size="small"
  //               placeholder={__("Postal/Zip Code", "acadlix")}
  //               type="text"
  //               value={props?.watch("billing_info.zip_code")}
  //               onChange={(e) => {
  //                 props?.setValue("billing_info.zip_code", e?.target?.value, {
  //                   shouldDirty: true,
  //                 });
  //               }}
  //               disabled={!props?.watch("is_user_logged_in")}
  //             />
  //           </Grid>
  //         </Grid>
  //       </CardContent>
  //     </Card>
  //   </Box >
  // );
};

export default BillingDetail;
