import React from 'react'
import { useForm } from 'react-hook-form';
import { __ } from '@wordpress/i18n';
import { GetUserWishlist } from "@acadlix/requests/front/FrontDashboardRequest";
import { dateI18n } from "@wordpress/date";
import { currencyPosition, formatPrice, getFormatDate } from "@acadlix/helpers/util";
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
import Grid from "@mui/material/Grid2";
import { IoMdRefresh, FaMoneyBillTransfer, HistoryToggleOff, FaExternalLinkAlt, FaTrash } from "@acadlix/helpers/icons";
import { DataGrid } from "@mui/x-data-grid";
import { PostRemoveWishlist } from '@acadlix/requests/front/FrontCourseRequest';

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

    const removeWishlistMutation = PostRemoveWishlist();
    const removeFromWishlist = (row) => {
        if (confirm(__('Are you sure you want to remove this course from wishlist?', 'acadlix'))) {
            removeWishlistMutation.mutate({
                course_id: row?.course_id,
                user_id: row?.user_id,
            });
        }
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
            field: "course",
            headerName: __("Course", "acadlix"),
            flex: 2,
            minWidth: 130,
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

    const [paginationModel, setPaginationModel] = React.useState(defaultPaginationModel);

    const { isFetching, data, refetch } = GetUserWishlist(
        acadlixOptions?.user?.ID,
        paginationModel?.page,
        paginationModel?.pageSize
    );

    React.useLayoutEffect(() => {
        if (Array.isArray(data?.data?.wishlist)) {
            const newRows = data?.data?.wishlist?.map((wishlist) => {
                return {
                    id: wishlist?.id,
                    course: wishlist?.course?.post_title,
                    course_id: wishlist?.course?.ID,
                    user_id: wishlist?.user_id,
                    price: currencyPosition(wishlist?.course?.rendered_metas?.enable_sale_price ? wishlist?.course?.rendered_metas?.sale_price : wishlist?.course?.rendered_metas?.price),
                    added_at: getFormatDate(wishlist?.created_at),
                    permalink: wishlist?.permalink,
                    thumbnail_url: wishlist?.course?.thumbnail?.url ?? acadlixOptions?.default_img_url,
                    thumbnail_alt: wishlist?.course?.thumbnail?.alt ?? wishlist?.course?.post_title,
                };
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
                                    >
                                        {__("Wishlist", "acadlix")}
                                    </Typography>
                                    <Tooltip title={__("Refresh", "acadlix")} arrow>
                                        <Button
                                            variant="contained"
                                            onClick={refetch}
                                        >
                                            <IoMdRefresh style={{ fontSize: 'x-large' }} />
                                        </Button>
                                    </Tooltip>
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
                    count={props?.watch("rows").length}
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
                    sx={{
                        alignItems: "center",
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