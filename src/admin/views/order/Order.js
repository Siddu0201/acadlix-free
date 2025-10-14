import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Chip,
  FormControl,
  FormHelperText,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  Tooltip,
  Typography,
} from "@mui/material";
import Grid from '@mui/material/Grid';
import { DataGrid } from "@mui/x-data-grid";
import React from "react";
import { useForm } from "react-hook-form";
import { DeleteOrderById, GetOrders } from "@acadlix/requests/admin/AdminOrderRequest";
import { currencyPosition, getStripHtml, hasCapability } from "@acadlix/helpers/util";
import { dateI18n } from "@wordpress/date";
import { FaEdit, FaSearch, FaTrash, IoMdRefresh, MdFileCopy } from "@acadlix/helpers/icons";
import { __ } from "@wordpress/i18n";
import { Link } from "react-router-dom";
import CustomTextField from "@acadlix/components/CustomTextField";
import CustomRefresh from "@acadlix/components/CustomRefresh";
import { DynamicMUIRenderer } from "@acadlix/modules/extensions/muiRecursiveRenderer";

const Order = () => {
  const defaultPaginationModel = {
    page: parseInt(localStorage.getItem('adminOrderPage') || '0', 10),
    pageSize: parseInt(localStorage.getItem('adminOrderPageSize') || acadlixOptions?.settings?.acadlix_default_rows_per_page, 10),
  };

  const methods = useForm({
    defaultValues: {
      search: "",
      rows: [],
      order_ids: [],
      action: "",
      status: "",
      payment_method: "",
      start_date: "",
      end_date: "",
    },
  });

  const [paginationModel, setPaginationModel] = React.useState(defaultPaginationModel);

  const deleteMutation = DeleteOrderById();
  const deleteOrderById = (id) => {
    if (confirm(__("If you delete this order, all associated data will also be removed, including order items, metadata, and the user's course progress.", "acadlix"))) {
      deleteMutation?.mutate(id);
    }
  }

  const columns = window?.acadlixHooks?.applyFilters(
    "acadlix.admin.order.columns",
    [
      { field: "id", headerName: __("ID", "acadlix") },
      {
        field: "order_items",
        headerName: __("Order Items", "acadlix"),
        flex: 2,
        minWidth: 130,
      },
      {
        field: "payment_method",
        headerName: __("Method", "acadlix"),
        flex: 1,
        minWidth: 100,
      },
      { field: "order_id", headerName: __("Order ID", "acadlix"), flex: 1, minWidth: 80 },
      {
        field: "transaction_id",
        headerName: __("Txn ID", "acadlix"),
        flex: 1,
        minWidth: 120,
        renderCell: (params) => {
          return (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
              }}
            >
              <Tooltip title={__("Copy Txn ID", "acadlix")} arrow>
                <IconButton
                  onClick={() => {
                    navigator?.clipboard
                      ?.writeText(params?.value)
                      .then(function () {
                        toast.success(__("Txn ID copied to clipboard!", "acadlix"));
                      })
                      .catch(function (err) {
                        console.error(__("Failed to copy text: ", "acadlix"), err);
                      });
                  }}
                  size="small"
                >
                  <MdFileCopy />
                </IconButton>
              </Tooltip>
              <Box>{params.value}</Box>
            </Box>
          );
        },
      },
      { field: "order_date", headerName: __("Order Date", "acadlix"), minWidth: 180 },
      { field: "user_name", headerName: __("Name", "acadlix"), flex: 2, minWidth: 130 },
      { field: "user_email", headerName: __("Email", "acadlix"), minWidth: 250 },
      {
        field: "status",
        headerName: __("Status", "acadlix"),
        flex: 1,
        minWidth: 100,
        renderCell: (params) => {
          const { value } = params;

          let color = "default";
          let label = "";
          if (value === "success") {
            color = "success";
            label = __("Success", "acadlix");
          } else if (value === "pending") {
            color = "warning";
            label = __("Pending", "acadlix");
          } else if (value === "failed") {
            color = "error";
            label = __("Failed", "acadlix");
          }
          return (
            <Chip
              label={label}
              color={color}
              variant="filled"
            />
          );
        },
      },
      {
        field: "total_amount",
        headerName: __("Total amount", "acadlix"),
        flex: 2,
        minWidth: 100,
      },
      {
        field: "actions",
        headerName: __("Actions", "acadlix"),
        flex: 1,
        minWidth: 100,
        renderCell: (params) => {
          const actionSetting = {
            component: "Fragment",
            component_name: "order_action_fragment",
            props: {},
            children: [
              hasCapability("acadlix_edit_order") && ({
                component: "Tooltip",
                component_name: "order_action_edit_tooltip",
                props: {
                  title: __("Edit Order", "acadlix"),
                  arrow: true,
                },
                children: [
                  {
                    component: "IconButton",
                    component_name: "order_action_edit_icon_button",
                    props: {
                      "aria-label": "edit",
                      size: "small",
                      color: "primary",
                      LinkComponent: Link,
                      to: `/edit/${params?.id}`,
                    },
                    children: [
                      {
                        component_name: "order_action_edit_icon",
                        component: "FaEdit",
                      },
                    ],
                  },
                ],
              }),
              hasCapability("acadlix_delete_order") && ({
                component: "Tooltip",
                component_name: "order_action_delete_tooltip",
                props: {
                  title: __("Delete Order", "acadlix"),
                  arrow: true,
                },
                children: [
                  {
                    component: "IconButton",
                    component_name: "order_action_delete_icon_button",
                    props: {
                      "aria-label": "delete",
                      size: "small",
                      color: "error",
                      onClick: deleteOrderById.bind(this, params?.id),
                    },
                    children: [
                      {
                        component_name: "order_action_delete_icon",
                        component: "FaTrash",
                      },
                    ],
                  },
                ],
              })
            ],
          }

          const actionElements = window?.acadlixHooks?.applyFilters(
            "acadlix.admin.order.actions",
            [actionSetting],
            {
              register: methods?.register,
              control: methods?.control,
              watch: methods?.watch,
              setValue: methods?.setValue,
            }
          ) ?? [];
          return (
            <>
              {actionElements.map((field, i) => (
                <React.Fragment key={i}>
                  <DynamicMUIRenderer
                    item={field}
                    index={i}
                    formProps={{
                      register: methods?.register,
                      setValue: methods?.setValue,
                      watch: methods?.watch,
                      control: methods?.control,
                    }}
                  />
                </React.Fragment>
              ))}
            </>
          )
        }
      }
    ],
    {
      register: methods?.register,
      control: methods?.control,
      watch: methods?.watch,
      setValue: methods?.setValue,
    }
  ) ?? [];

  const { isFetching, data, refetch } = GetOrders(
    paginationModel?.page,
    paginationModel?.pageSize,
    methods?.watch("search"),
    methods?.watch("status"),
    methods?.watch("payment_method"),
    methods?.watch("start_date"),
    methods?.watch("end_date"),
  );

  const getOrderMetaValue = (order_metas = [], meta_key = "", order_default = "") => {
    return order_metas?.find((o) => o?.meta_key === meta_key)?.meta_value ?? order_default;
  };

  const getTransactionId = (order_metas = []) => {
    switch (getOrderMetaValue(order_metas, "payment_method")) {
      case "razorpay":
        return getOrderMetaValue(order_metas, "razorpay_order_id");
      case "paypal":
        return getOrderMetaValue(order_metas, "paypal_order_id");
      case "payu":
        return getOrderMetaValue(order_metas, "payu_txn_id");
      case "stripe":
        return getOrderMetaValue(order_metas, "stripe_order_id");
      default:
        return "N/A";
    }
  };

  React.useLayoutEffect(() => {
    if (Array.isArray(data?.data?.orders)) {
      const newRows = data?.data?.orders?.map((order) => {
        const formattedDateTime = dateI18n(
          acadlixOptions?.date_time_format,
          order?.created_at
        );
        return window?.acadlixHooks?.applyFilters(
          "acadlix.admin.order.row",
          {
            id: order?.id,
            status: order?.status,
            payment_method: getOrderMetaValue(
              order?.order_metas,
              "payment_method",
              __("Free", "acadlix")
            )?.toUpperCase(),
            order_id: `#${order?.id}`,
            transaction_id: getTransactionId(order?.order_metas),
            order_date: formattedDateTime,
            user_name: `${order?.user?.display_name} (${order?.user?.user_login})`,
            user_email: order?.user?.user_email,
            total_amount: currencyPosition(order?.total_amount, getStripHtml(acadlixOptions?.currency_symbols[getOrderMetaValue(order?.order_metas, "currency", "USD")])),
            order_items: order?.order_items
              ?.map((items) => items?.course_title)
              ?.join(", "),
          },
          {
            order: order,
          }
        );
      });
      methods?.setValue("rows", newRows, { shouldDirty: true });
    }
  }, [data]);

  const rowCountRef = React.useRef(data?.data?.total || 0);

  const rowCount = React.useMemo(() => {
    if (data?.data?.total !== undefined) {
      rowCountRef.current = data?.data?.total;
    }
    return rowCountRef.current;
  }, [data?.data?.total]);

  const handleActionChange = (e) => {
    methods?.setValue("action", e?.target?.value, { shouldDirty: true });
  };

  const handleSearch = (e) => {
    methods?.setValue("search", e?.target?.value, { shouldDirty: true });
  }

  const handlePaginationChange = (model) => {
    setPaginationModel(model);
    localStorage.setItem('adminOrderPage', model.page);
    localStorage.setItem('adminOrderPageSize', model.pageSize);
  };

  const defaultSetting = {
    component: "Box",
    children: [
      {
        component: "Grid",
        props: {
          container: true,
          spacing: {
            xs: 2,
            sm: 4,
          },
          sx: {
            padding: {
              xs: 2,
              sm: 4,
            },
          }
        },
        children: [
          {
            component: "Grid",
            props: {
              size: {
                xs: 12,
                lg: 12,
              },
            },
            children: [
              {
                component: "Card",
                children: [
                  {
                    component: <CardHeader
                      title={
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 2,
                          }}
                        >
                          <Typography
                            variant="h3"
                          >
                            {__("Orders", "acadlix")}
                          </Typography>
                          {
                            hasCapability("acadlix_add_order") &&
                            <Button
                              variant="contained"
                              LinkComponent={Link}
                              to="/create"
                              color="primary"
                            >
                              {__("Add", "acadlix")}
                            </Button>
                          }
                          <CustomRefresh
                            refetch={refetch}
                          />
                        </Box>
                      } />,
                  },
                  {
                    component: "CardContent",
                    children: [
                      {
                        component: "Box",
                        props: {
                          sx: {
                            paddingBottom: 2,
                            display: "flex",
                            flexDirection: {
                              xs: "column",
                              sm: "row",
                            },
                            gap: 2,
                            alignItems: "baseline",
                            justifyContent: "space-between",
                          },
                        },
                        children: [
                          {
                            component: "Box",
                            props: {
                              sx: {
                                display: "flex",
                                flexDirection: {
                                  xs: "column",
                                  sm: "row",
                                },
                                gap: 2,
                                alignItems: "baseline",
                              },
                            },
                            children: [
                              {
                                component: "FormControl",
                                props: {
                                  sx: {
                                    minWidth: 150,
                                  },
                                  size: "small",
                                  error: Boolean(methods?.formState?.errors?.status),
                                },
                                children: [
                                  {
                                    component: "InputLabel",
                                    props: {
                                      id: "demo-simple-select-label",
                                    },
                                    value: __("Status", "acadlix"),
                                  },
                                  {
                                    component: "Select",
                                    props: {
                                      labelId: "demo-simple-select-label",
                                      id: "demo-simple-select",
                                      value: methods?.watch("status"),
                                      label: __("Status", "acadlix"),
                                      onChange: (e) => {
                                        methods?.setValue("status", e.target.value, { shouldDirty: true });
                                      },
                                    },
                                    children: [
                                      {
                                        component: "MenuItem",
                                        props: {
                                          value: "",
                                        },
                                        value: __("All", "acadlix"),
                                      },
                                      {
                                        component: "MenuItem",
                                        props: {
                                          value: "pending",
                                        },
                                        value: __("Pending", "acadlix"),
                                      },
                                      {
                                        component: "MenuItem",
                                        props: {
                                          value: "success",
                                        },
                                        value: __("Success", "acadlix"),
                                      },
                                      {
                                        component: "MenuItem",
                                        props: {
                                          value: "failed",
                                        },
                                        value: __("Failed", "acadlix"),
                                      },
                                    ],
                                  },
                                  {
                                    component: "FormHelperText",
                                    value: methods?.formState?.errors?.status?.message,
                                  },
                                ],
                              },
                              {
                                component: "FormControl",
                                props: {
                                  sx: {
                                    minWidth: 180,
                                  },
                                  size: "small",
                                  error: Boolean(methods?.formState?.errors?.payment_method),
                                },
                                children: [
                                  {
                                    component: "InputLabel",
                                    props: {
                                      id: "demo-simple-select-label",
                                    },
                                    value: __("Payment Method", "acadlix"),
                                  },
                                  {
                                    component: "Select",
                                    props: {
                                      labelId: "demo-simple-select-label",
                                      id: "demo-simple-select",
                                      value: methods?.watch("payment_method"),
                                      label: __("Payment Method", "acadlix"),
                                      onChange: (e) => methods?.setValue("payment_method", e?.target?.value, { shouldDirty: true })
                                    },
                                    children: [
                                      {
                                        component: "MenuItem",
                                        props: {
                                          value: "",
                                        },
                                        value: __("All", "acadlix"),
                                      },
                                      {
                                        component: "MenuItem",
                                        props: {
                                          value: "razorpay",
                                        },
                                        value: __("Razorpay", "acadlix"),
                                      },
                                      {
                                        component: "MenuItem",
                                        props: {
                                          value: "paypal",
                                        },
                                        value: __("PayPal", "acadlix"),
                                      },
                                      {
                                        component: "MenuItem",
                                        props: {
                                          value: "payu",
                                        },
                                        value: __("PayU", "acadlix"),
                                      },
                                      {
                                        component: "MenuItem",
                                        props: {
                                          value: "stripe",
                                        },
                                        value: __("Stripe", "acadlix"),
                                      },
                                      {
                                        component: "MenuItem",
                                        props: {
                                          value: "free",
                                        },
                                        value: __("Free", "acadlix"),
                                      },
                                      {
                                        component: "MenuItem",
                                        props: {
                                          value: "admin",
                                        },
                                        value: __("Admin", "acadlix"),
                                      },
                                    ],
                                  },
                                  {
                                    component: "FormHelperText",
                                    value: methods?.formState?.errors?.payment_method?.message,
                                  },
                                ],
                              },
                              {
                                component: "Button",
                                props: {
                                  variant: "contained",
                                  sx: {
                                    marginRight: 2,
                                  },
                                  color: "primary",
                                  onClick: () => {
                                    methods?.setValue("status", "", { shouldDirty: true });
                                    methods?.setValue("payment_method", "", { shouldDirty: true });
                                  },
                                },
                                value: __("Reset", "acadlix"),
                              }
                            ],
                          },
                          {
                            component: "Box",
                            props: {
                              sx: {
                                display: "flex",
                                gap: 2,
                                alignItems: "baseline",
                              }
                            },
                            children: [
                              {
                                component: "CustomTextField",
                                props: {
                                  fullWidth: true,
                                  size: "small",
                                  label: __("Search", "acadlix"),
                                  name: "search",
                                  value: methods?.watch("search") ?? "",
                                  onChange: handleSearch,
                                  helperText: __("Search by order items,txn id, name, email", "acadlix"),
                                  slotProps: {
                                    input: {
                                      endAdornment: (
                                        <InputAdornment position="end">
                                          <FaSearch />
                                        </InputAdornment>
                                      )
                                    }
                                  }
                                }
                              }
                            ]
                          }
                        ],
                      },
                      {
                        component: "Box",
                        props: {
                          sx: {
                            width: "100%",
                          },
                        },
                        children: [
                          {
                            component: "DataGrid",
                            props: {
                              rows: methods?.watch("rows"),
                              columns: columns,
                              rowCount: rowCount,
                              paginationModel: paginationModel,
                              onPaginationModelChange: handlePaginationChange,
                              paginationMode: "server",
                              pageSizeOptions: [10, 20, 50, 100],
                              checkboxSelection: false,
                              disableRowSelectionOnClick: true,
                              disableColumnMenu: true,
                              onRowSelectionModelChange: (model) => {
                                methods?.setValue("selectedRows", model, { shouldDirty: true });
                              },
                              rowSelectionModel: methods?.watch("selectedRows"),
                              autoHeight: true,
                              loading: isFetching,
                              columnVisibilityModel: {
                                id: false,
                              },
                              getEstimatedRowHeight: () => 100,
                              getRowHeight: () => "auto",
                              sx: {
                                "& .PrivateSwitchBase-input": {
                                  height: "100% !important",
                                  width: "100% !important",
                                  margin: "0 !important",
                                },
                                "&.MuiDataGrid-root--densityCompact .MuiDataGrid-cell": {
                                  py: 1,
                                },
                                "&.MuiDataGrid-root--densityStandard .MuiDataGrid-cell": {
                                  py: "15px",
                                },
                                "&.MuiDataGrid-root--densityComfortable .MuiDataGrid-cell":
                                {
                                  py: "22px",
                                },
                              },
                            },
                          },
                        ],
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      }
    ]
  }

  const order_setting = window?.acadlixHooks?.applyFilters?.(
    "acadlix.admin.order.default",
    [defaultSetting],
    {
      register: methods?.register,
      control: methods?.control,
      watch: methods?.watch,
      setValue: methods?.setValue,
    }
  ) ?? [];

  return (
    <>
      {order_setting.map((field, i) => (
        <React.Fragment key={i}>
          <DynamicMUIRenderer
            item={field}
            index={i}
            formProps={{
              register: methods?.register,
              setValue: methods?.setValue,
              watch: methods?.watch,
              control: methods?.control,
            }}
          />
        </React.Fragment>
      ))}
    </>
  )

};

export default Order;
