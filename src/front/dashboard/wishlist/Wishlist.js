import React from 'react'
import { useForm } from 'react-hook-form';
import { __ } from '@wordpress/i18n';
import { GetUserWishlist } from "@acadlix/requests/front/FrontDashboardRequest";
import { dateI18n } from "@wordpress/date";
import { currencyPosition, getFormatDate } from "@acadlix/helpers/util";
import {
  Chip,
  Button,
  Box,
  Typography,
  Tooltip,
  useMediaQuery,
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
  TablePagination,
  IconButton,
  Avatar,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import { IoMdRefresh, FaMoneyBillTransfer, HistoryToggleOff, FaExternalLinkAlt, FaTrash } from "@acadlix/helpers/icons";
import { DataGrid } from "@mui/x-data-grid";
import { PostRemoveWishlist } from '@acadlix/requests/front/FrontCourseRequest';
import CustomRefresh from '@acadlix/components/CustomRefresh';
import toast from 'react-hot-toast';

const Wishlist = () => {
  const isMobile = useMediaQuery((theme) => theme.breakpoints.down("sm"));

  const defaultPaginationModel = {
    page: parseInt(localStorage.getItem('frontWishlistPage') || '0', 10),
    pageSize: parseInt(localStorage.getItem('frontWishlistPageSize') || '10', 10),
  };

  const methods = useForm({
    defaultValues: {
      rows: [],
      action: "",
      order_ids: [],
    },
  });

  const [paginationModel, setPaginationModel] = React.useState(defaultPaginationModel);

  const { isFetching, data, refetch } = GetUserWishlist(
    acadlixOptions?.user?.ID,
    paginationModel?.page,
    paginationModel?.pageSize
  );

  const removeWishlistMutation = PostRemoveWishlist();
  const removeFromWishlist = (row) => {
    if (confirm(__('Are you sure you want to remove this item from wishlist?', 'acadlix'))) {
      removeWishlistMutation.mutate({
        item_id: row?.item_id,
        user_id: row?.user_id,
        type: row?.type,
      }, {
        onSuccess: (data) => {
          toast.success(data?.data?.message ?? __('Item removed from wishlist successfully', 'acadlix'));
          refetch();
        }
      });
    }
  }

  const getType = (type) => {
    let info = {
      label: "",
      color: "default",
    }
    switch (type) {
      case "course":
        info = {
          label: __("Course", "acadlix"),
          color: "primary",
        }
        break;
      default:
        info = {
          label: type,
          color: "default",
        }
    }
    info = window?.acadlixHooks?.applyFilters(
      "acadlix.front.dashboard.wishlist.type_info",
      info,
      type
    ) ?? info;
    return info;
  }

  const columns = [
    { field: "id", headerName: __("ID", "acadlix") },
    {
      field: "thumbnail", headerName: __("Thumbnail", "acadlix"), minWidth: 100, renderCell: (params) => {
        return (
          <Avatar
            src={params?.row?.thumbnail_url}
            alt={params?.row?.thumbnail_alt}
            sx={{
              width: 80,
              height: 50,
              marginY: 1,
            }}
            variant='rounded'
          />
        );
      }
    },
    {
      field: "item",
      headerName: __("Item", "acadlix"),
      flex: 2,
      minWidth: 130,
    },
    {
      field: "type",
      headerName: __("Type", "acadlix"),
      flex: 1,
      minWidth: 100,
      renderCell: (params) => {
        const typeInfo = getType(params?.row?.type);
        return (
          <Chip
            label={typeInfo.label}
            color={typeInfo.color}
            size="small"
          />
        );
      }
    },
    { field: "price", headerName: __("Price", "acadlix"), flex: 2, minWidth: 180 },
    { field: "added_at", headerName: __("Added At", "acadlix"), minWidth: 180 },
    {
      field: "action", headerName: __("Action", "acadlix"), minWidth: 150,
      renderCell: (params) => {
        return (
          <Box
            sx={{
              height: "100%",
              display: "flex",
              alignItems: "center",
            }}
          >
            <Tooltip title={__("Go to course", "acadlix")} arrow>
              <IconButton
                className="acadlix-icon-btn"
                onClick={() => {
                  window.location.href = params?.row?.permalink;
                }}
                size="small"
                color='warning'
              >
                <FaExternalLinkAlt />
              </IconButton>
            </Tooltip>
            <Tooltip title={__("Remove from wishlist", "acadlix")} arrow>
              <IconButton
                className="acadlix-icon-btn"
                size="small"
                color='error'
                onClick={() => {
                  removeFromWishlist(params?.row);
                }}
              >
                <FaTrash />
              </IconButton>
            </Tooltip>
          </Box>
        );
      },
    },
  ];

  React.useLayoutEffect(() => {
    if (Array.isArray(data?.data?.wishlist)) {
      const newRows = data?.data?.wishlist?.map((wishlist) => {
        return {
          id: wishlist?.id,
          item: wishlist?.item?.post_title,
          item_id: wishlist?.type_id,
          user_id: wishlist?.user_id,
          type: wishlist?.type,
          price: currencyPosition(wishlist?.item?.rendered_metas?.enable_sale_price ? wishlist?.item?.rendered_metas?.sale_price : wishlist?.item?.rendered_metas?.price),
          added_at: getFormatDate(wishlist?.created_at),
          permalink: wishlist?.permalink,
          thumbnail_url: wishlist?.item?.thumbnail?.url ?? acadlixOptions?.default_img_url,
          thumbnail_alt: wishlist?.item?.thumbnail?.alt ?? wishlist?.item?.post_title,
        };
      });
      methods?.setValue("rows", newRows, { shouldDirty: true });
    }
  }, [data]);

  console.log("wishlist data", methods?.watch("rows"));

  const rowCountRef = React.useRef(data?.data?.total || 0);

  const rowCount = React.useMemo(() => {
    if (data?.data?.total !== undefined) {
      rowCountRef.current = data?.data?.total;
    }
    return rowCountRef.current;
  }, [data?.data?.total]);

  const handlePaginationChange = (model) => {
    setPaginationModel(model);
    localStorage.setItem('frontWishlistPage', model.page);
    localStorage.setItem('frontWishlistPageSize', model.pageSize);
  };

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
                    {__("Wishlist", "acadlix")}
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
                {
                  isMobile ? (
                    <MobileOnlyView
                      {...methods}
                      isFetching={isFetching || removeWishlistMutation?.isPending}
                      paginationModel={paginationModel}
                      handlePaginationChange={handlePaginationChange}
                      removeFromWishlist={removeFromWishlist}
                      rowCount={rowCount}
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
                        methods?.setValue("wishlist_ids", data, {
                          shouldDirty: true,
                        });
                      }}
                      rowSelectionModel={methods?.watch("wishlist_ids")}
                      loading={isFetching || removeWishlistMutation?.isPending}
                      columnVisibilityModel={{
                        id: false,
                      }}
                      slotProps={{
                        pagination: {
                          slotProps: {
                            selectLabel: { component: "div" },
                            displayedRows: { component: "div" },
                            // 2. Actions contains the buttons
                            actions: {
                              nextButton: { className: "acadlix-icon-btn" },
                              previousButton: { className: "acadlix-icon-btn" },
                            },
                          },
                        }
                      }}
                      getRowHeight={() => "auto"}
                      // getEstimatedRowHeight={() => 200}
                      sx={{
                        "& .PrivateSwitchBase-input": {
                          height: "100% !important",
                          width: "100% !important",
                          margin: "0 !important",
                        },
                        '& .MuiDataGrid-cell': {
                          display: 'flex',
                          alignItems: 'center',
                        },
                      }}
                    />
                  )
                }
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}

export default Wishlist

const MobileOnlyView = (props) => {
  return (
    <Box>
      {props?.isFetching ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            padding: 2
          }}
        >
          <CircularProgress />
        </Box>
      ) : (
        props?.watch("rows")?.map((row, index) => (
          <Box
            key={index}
            sx={{
              padding: 2,
              borderBottom: "1px solid #e0e0e0",
              display: "flex",
              alignItems: "center",
              gap: 2,
              boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.4)",
              marginBottom: "8px",
              borderRadius: "8px",
              backgroundColor: "white",
              marginX: 0,
            }}
          >
            <Box>
              <Avatar
                variant='rounded'
                src={row?.thumbnail_url}
                alt={row?.thumbnail_alt}
                sx={{
                  width: 100,
                  height: 80,
                }}
              />
            </Box>
            <Box sx={{
              display: "flex",
              flexDirection: "column",
              gap: 1,
            }}>
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
              >
                <Typography
                  variant="h6"
                  component="div"
                >
                  {row.course}
                </Typography>
              </Box>
              <Box
                display="flex"
                alignItems="center"
                sx={{
                  gap: 0.5,
                }}
              >
                <HistoryToggleOff
                  sx={{ marginRight: "4px", color: "gray", fontSize: "18px" }}
                />
                <Typography
                  variant="body2"
                  color="text.secondary"
                  component="div"
                >
                  {row?.added_at}
                </Typography>
              </Box>
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
              >
                <Typography
                  variant="body2"
                  component="div"
                >
                  {row?.price}
                </Typography>
              </Box>
              <Box
                sx={{
                  height: "100%",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <Tooltip title={__("Go to course", "acadlix")} arrow>
                  <IconButton
                    className="acadlix-icon-btn"
                    onClick={() => {
                      window.location.href = row?.permalink;
                    }}
                    size="small"
                    color='warning'
                  >
                    <FaExternalLinkAlt />
                  </IconButton>
                </Tooltip>
                <Tooltip title={__("Remove from wishlist", "acadlix")} arrow>
                  <IconButton
                    className="acadlix-icon-btn"
                    size="small"
                    color='error'
                    onClick={() => {
                      props?.removeFromWishlist(row);
                    }}
                  >
                    <FaTrash />
                  </IconButton>
                </Tooltip>
              </Box>
            </Box>
          </Box>
        ))
      )}
      <Box display="flex" justifyContent="center" alignItems="center" padding={2}>
        <TablePagination
          component="div"
          count={props?.rowCount}
          page={props?.paginationModel?.page}
          onPageChange={(_, newPage) => props?.handlePaginationChange({ ...props?.paginationModel, page: newPage })}
          rowsPerPage={props?.paginationModel?.pageSize}
          onRowsPerPageChange={(e) => {
            const pageSize = parseInt(e?.target?.value);
            const page = Math.min(props?.paginationModel?.page, Math.floor(props?.watch("rows").length / pageSize)); // Ensure page does not exceed limit
            props?.handlePaginationChange({
              pageSize: pageSize,
              page: page,
            })
          }}
          slotProps={{
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
          }}
          sx={{
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
          }}

        />
        {/* <Stack spacing={2}>
          <Pagination
            count={Math.ceil(
              props?.watch("rows").length / props?.paginationModel?.pageSize
            )}
            page={props?.paginationModel?.page}
            onChange={(e, value) =>
              props?.handlePaginationChange({ ...props?.paginationModel, page: value })
            }
          />
        </Stack> */}
      </Box>
    </Box>
  );
};