import * as React from "react";
import useMediaQuery from "@mui/material/useMediaQuery";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { useForm } from "react-hook-form";
import {
  Card,
  CardContent,
  CardHeader,
  Chip,
} from "@mui/material";
import Grid from '@mui/material/Grid';
import { GetUserPurchases } from "@acadlix/requests/front/FrontDashboardRequest";
import { dateI18n } from "@wordpress/date";
import { currencyPosition } from "@acadlix/helpers/util";
import { __ } from "@wordpress/i18n";
import CustomRefresh from "@acadlix/components/CustomRefresh";
import { DynamicMUIRenderer } from "@acadlix/modules/extensions/muiRecursiveRenderer";
import Loader from "@acadlix/components/Loader";

const PurchaseHistory = () => {
  const isMobile = useMediaQuery((theme) => theme.breakpoints.down("sm"));

  const defaultPaginationModel = {
    page: parseInt(localStorage.getItem('frontPurchaseHistoryPage') || '0', 10),
    pageSize: parseInt(localStorage.getItem('frontPurchaseHistoryPageSize') || '10', 10),
  };

  const methods = useForm({
    defaultValues: {
      rows: [],
      action: "",
      order_ids: [],
    },
  });

  const columns = window.acadlixHooks?.applyFilters(
    'acadlix.front.dashboard.purchaseHistory.columns',
    [
      {
        field: "id", headerName: __("ID", "acadlix"), minWidth: 30,
        renderCell: (params) => {
          const { value } = params;
          return (
            <>#{value}</>
          );
        },
      },
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
      { field: "order_id", headerName: __("Order/Txn ID", "acadlix"), flex: 2, minWidth: 180 },
      { field: "order_date", headerName: __("Order Date", "acadlix"), minWidth: 120 },
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
            <div style={{
              height: "100%",
              display: "flex",
              alignItems: "center",
            }}>
              <Chip
                label={label}
                color={color}
                variant="filled"
              />
            </div>
          );
        },
      },
      {
        field: "total_amount",
        headerName: __("Amount", "acadlix"),
        flex: 1,
        minWidth: 80,
      },
    ],
  )?.filter(Boolean) || [];

  const [paginationModel, setPaginationModel] = React.useState(defaultPaginationModel);

  const { isFetching, data, refetch } = GetUserPurchases(
    acadlixOptions?.user?.ID,
    paginationModel?.page,
    paginationModel?.pageSize
  );

  const getOrderMetaValue = (order_metas = [], meta_key = "", order_default = "") => {
    return order_metas?.find((o) => o?.meta_key === meta_key)?.meta_value ?? order_default;
  };

  const getOrderId = (order_metas = []) => {
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

  React.useEffect(() => {
    if (Array.isArray(data?.data?.orders)) {
      const newRows = data?.data?.orders?.map((order) => {
        const formattedDateTime = dateI18n(
          acadlixOptions?.date_time_format,
          order?.created_at
        );
        return window.acadlixHooks?.applyFilters(
          'acadlix.front.dashboard.purchaseHistory.rows',
          {
            id: order?.id,
            status: order?.status,
            payment_method: getOrderMetaValue(
              order?.order_metas,
              "payment_method",
              "Free"
            )?.toUpperCase(),
            order_id: getOrderId(order?.order_metas),
            order_date: formattedDateTime,
            user_name: `${order?.user?.display_name} (${order?.user?.user_login})`,
            user_email: order?.user?.user_email,
            total_amount: currencyPosition(order?.total_amount),
            order_items: order?.order_items
              ?.map((items) => items?.course_title)
              ?.join(", "),
          },
          {
            register: methods?.register,
            watch: methods?.watch,
            setValue: methods?.setValue,
            getValues: methods?.getValues,
            order,
            getOrderMetaValue,
          }
        );
      });
      methods?.setValue("rows", newRows, { shouldDirty: true });
    }
  }, [data?.data]);

  const rowCountRef = React.useRef(data?.data?.total || 0);

  const rowCount = React.useMemo(() => {
    if (data?.data?.total !== undefined) {
      rowCountRef.current = data?.data?.total;
    }
    return rowCountRef.current;
  }, [data?.data?.total]);

  const handlePaginationChange = (model) => {
    setPaginationModel(model);
    localStorage.setItem('frontPurchaseHistoryPage', model.page);
    localStorage.setItem('frontPurchaseHistoryPageSize', model.pageSize);
  };

  if (process.env.REACT_APP_MODE === 'development') {
    console.log(methods?.watch("rows"));
  }

  return (
    <Box>
      <Grid container rowSpacing={3} spacing={4}>
        <Grid size={{ xs: 12, lg: 12 }}>
          <Card
            sx={{
              boxShadow: (theme) => theme.shadows[4],
            }}
          >
            <CardHeader
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
                    component="div"
                  >
                    {__("Purchase History", "acadlix")}
                  </Typography>
                  <CustomRefresh
                    refetch={refetch}
                    sx={{
                      paddingY: 1.5,
                    }}
                  />
                </Box>
              }
              sx={{
                paddingX: 4,
                paddingY: 2,
                paddingBottom: 1,
              }}
            />
            <CardContent>
              <Box
                sx={{
                  width: "100%",
                }}
              >
                <MobileOnlyView
                  {...methods}
                  isFetching={isFetching}
                  paginationModel={paginationModel}
                  handlePaginationChange={handlePaginationChange}
                  rowCount={rowCount}
                />
                {/* {
                  isMobile ? (
                    <MobileOnlyView
                      {...methods}
                      isFetching={isFetching}
                      paginationModel={paginationModel}
                      handlePaginationChange={handlePaginationChange}
                    />
                  ) : (
                    <DataGrid
                      rows={methods?.watch("rows")}
                      columns={columns}
                      rowCount={rowCount}
                      paginationModel={paginationModel}
                      onPaginationModelChange={handlePaginationChange}
                      paginationMode="server"
                      pageSizeOptions={[10, 20, 50]}
                      checkboxSelection={false}
                      disableRowSelectionOnClick
                      disableColumnMenu
                      onRowSelectionModelChange={(data) => {
                        methods?.setValue("purchase_ids", data, {
                          shouldDirty: true,
                        });
                      }}
                      rowSelectionModel={methods?.watch("purchase_ids")}
                      loading={isFetching}
                      columnVisibilityModel={{
                        // id: false,
                      }}
                      autoHeight
                      // getRowHeight={() => "auto"}
                      // getEstimatedRowHeight={() => 200}
                      sx={{
                        "& .PrivateSwitchBase-input": {
                          height: "100% !important",
                          width: "100% !important",
                          margin: "0 !important",
                        },
                      }}
                    />
                  )
                } */}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default PurchaseHistory;

const MobileOnlyView = (props) => {
  const defaultSetting = {
    component: "Box",
    component_name: "purchase_history_box",
    children: [
      props?.isFetching ? ({
        component: "Box",
        component_name: "purchase_history_box_loading",
        props: {
          sx: {
            display: "flex",
            justifyContent: "center",
            padding: 2,
          }
        },
        children: [
          {
            component_name: "purchase_history_box_loading_cirular_progress",
            component: "CirularProgress"
          }
        ]
      }) :
        {
          component: "Fragment",
          component_name: "purchase_history_box_content",
          children: props?.watch("rows")?.length > 0 ?
            props?.watch("rows")?.map((row, index) => {
              return {
                component: <SingleOrder
                  key={index}
                  row={row}
                  {...props}
                />,
                component_name: "purchase_history_box_content_item",

              }
            }) : [{
              component: "Box",
              component_name: "purchase_history_box_content_no_data",
              props: {
                sx: {
                  display: "flex",
                  justifyContent: "center",
                  padding: 2,
                }
              },
              children: [
                {
                  component_name: "purchase_history_box_content_no_data_text",
                  component: "Typography",
                  props: {
                    component: "div",
                    variant: "h6",
                    sx: {
                      color: "text.secondary",
                    }
                  },
                  value: __("No Data Found", "acadlix")
                }
              ]
            }]
        },
      {
        component: "Box",
        component_name: "purchase_history_pagination_box",
        props: {
          sx: {
            display: "flex",
            justifyContent: "center",
            padding: 2,
          }
        },
        children: [
          {
            component: "TablePagination",
            component_name: "purchase_history_pagination_table_pagination",
            props: {
              component: "div",
              count: props?.rowCount,
              page: props?.paginationModel?.page,
              onPageChange: (_, newPage) => props?.handlePaginationChange({ ...props?.paginationModel, page: newPage }),
              rowsPerPage: props?.paginationModel?.pageSize,
              onRowsPerPageChange: (e) => {
                const pageSize = parseInt(e?.target?.value);
                const page = Math.min(props?.paginationModel?.page, Math.floor(props?.watch("rows").length / pageSize)); // Ensure page does not exceed limit
                props?.handlePaginationChange({
                  pageSize: pageSize,
                  page: page,
                });
              },
              slotProps: {
                selectLabel: {
                  component: "div",
                },
                displayedRows: {
                  component: "div",
                },
                actions: {
                  nextButton: {
                    className: "acadlix-icon-btn",
                  },
                  previousButton: {
                    className: "acadlix-icon-btn",
                  }
                },
              },
              sx: {
                '& .MuiToolbar-root': {
                  paddingLeft: 0,
                  paddingRight: 0,
                },
                '& .MuiTablePagination-selectLabel': {
                  margin: 0,
                },
                '& .MuiTablePagination-displayedRows': {
                  margin: 0,
                },
                '& .MuiInputBase-root': {
                  marginX: 0,
                },
              }
            },
          }
        ]
      }
    ]
  }

  const purchaseHistoryMobile = window.acadlixHooks?.applyFilters(
    'acadlix.front.dashboard.purchaseHistory.mobile',
    [defaultSetting],
    {
      register: props?.register,
      watch: props?.watch,
      setValue: props?.setValue,
      handlePaginationChange: props?.handlePaginationChange,
      paginationModel: props?.paginationModel,
      isDesktop: false,
    }
  )?.filter(Boolean) || [];

  if (props?.isFetching) {
    return <Loader />;
  }

  return (
    <>
      {purchaseHistoryMobile.map((field, i) => (
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
};

const SingleOrder = ({ row, ...props }) => {
  let color = "default";
  let label = "";
  if (row?.status === "success") {
    color = "success";
    label = __("Success", "acadlix");
  } else if (row?.status === "pending") {
    color = "warning";
    label = __("Pending", "acadlix");
  } else if (row?.status === "failed") {
    color = "error";
    label = __("Failed", "acadlix");
  }
  const defaultSetting = {
    component: "Box",
    component_name: "purchase_history_box_content_item",
    props: {
      sx: {
        padding: "8px",
        marginTop: "8px",
        marginBottom: "8px",
        borderBottom: "1px solid #e0e0e0",
        display: "flex",
        flexDirection: "column",
        gap: "4px",
        boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.2)",
        borderRadius: "8px",
        backgroundColor: "white",
      }
    },
    children: [
      {
        component: "Box",
        component_name: "purchase_history_box_content_item_header",
        props: {
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        },
        children: [
          {
            component: "Typography",
            component_name: "purchase_history_box_content_typography",
            props: {
              component: "div",
              variant: "h6",
            },
            value: `#${row?.id} - ${row?.order_items}`
          }
        ]
      },
      {
        component: "Box",
        component_name: "purchase_history_txn_id_box",
        props: {
          sx: {
            display: "flex",
            alignItems: "center",
          }
        },
        children: [
          {
            component: "FaMoneyBillTransfer",
            component_name: "purchase_history_txn_id_icon",
            props: {
              style: {
                marginRight: "4px",
                color: "gray",
                fontSize: "18px",
              }
            }
          },
          {
            component: "Typography",
            component_name: "purchase_history_txn_id_typography",
            props: {
              component: "div",
              variant: "body2",
              color: "text.secondary",
            },
            value: row?.order_id
          },
        ]
      },
      {
        component: "Box",
        component_name: "purchase_history_date_box",
        props: {
          sx: {
            display: "flex",
            alignItems: "center",
          }
        },
        children: [
          {
            component: "HistoryToggleOff",
            component_name: "purchase_history_date_icon",
            props: {
              style: {
                marginRight: "4px",
                color: "gray",
                fontSize: "18px",
              }
            }
          },
          {
            component: "Typography",
            component_name: "purchase_history_date_typography",
            props: {
              component: "div",
              variant: "body2",
              color: "text.secondary",
            },
            value: row?.order_date
          },
          {
            component: "Chip",
            component_name: "purchase_history_status_chip",
            props: {
              label: label,
              color: color,
              sx: {
                marginLeft: "auto",
              },
              variant: "filled",
            }
          }
        ]
      },
      {
        component: "Box",
        component_name: "purchase_history_amount_box",
        props: {
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        },
        children: [
          {
            component: "Typography",
            component_name: "purchase_history_amount_typography",
            props: {
              component: "div",
              variant: "body2",
            },
            value: row?.total_amount
          },
          {
            component: "Typography",
            component_name: "purchase_history_amount_payment_method_typography",
            props: {
              component: "div",
              variant: "body2",
              sx: {
                display: "flex",
                alignItems: "center"
              }
            },
            children: [
              {
                component: "FaMoneyBillTransfer",
                component_name: "purchase_history_amount_payment_method_icon",
                props: {
                  style: {
                    marginRight: "4px",
                  }
                }
              },
              {
                component: "Fragment",
                component_name: "purchase_history_amount_payment_method_value",
                value: row?.payment_method
              }
            ]
          }
        ]
      }
    ]
  };

  const singleOrder = window.acadlixHooks?.applyFilters(
    'acadlix.front.dashboard.purchaseHistory.singleOrder',
    [defaultSetting],
    {
      register: props?.register,
      watch: props?.watch,
      setValue: props?.setValue,
      isDesktop: props?.isDesktop,
      row: row,
    }
  )?.filter(Boolean) || [];

  return (
    <>
      {singleOrder.map((field, i) => (
        <DynamicMUIRenderer
          item={field}
          key={i}
          formProps={{
            register: props?.register,
            watch: props?.watch,
            setValue: props?.setValue,
          }}
        />
      ))}
    </>
  )
}
