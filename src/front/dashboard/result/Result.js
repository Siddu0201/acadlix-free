import * as React from "react";
import { BiExpand, HistoryToggleOff } from "../../../helpers/icons";
import {
  Box,
  Typography,
  Paper,
  Button,
  useMediaQuery,
  TextField,
  Card,
  Grid,
  CardContent,
  Tooltip,
  IconButton,
  CardHeader,
} from "@mui/material";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import { useForm } from "react-hook-form";
import { DataGrid } from "@mui/x-data-grid";

export default function Result() {
  const isMobile = useMediaQuery((theme) => theme.breakpoints.down("sm"));

  const methods = useForm({
    defaultValues: {
      rows: [],
      action: "",
      result_ids: [],
    },
  });
  const [paginationModel, setPaginationModel] = React.useState({
    pageSize: 10,
    page: 0,
  });

  const columns = [
    { field: "id", headerName: "ID" },
    { field: "title", headerName: "Title", flex: 2, minWidth: 130 },
    { field: "date_time", headerName: "Date & Time", flex: 1, minWidth: 90 },
    {
      field: "status",
      headerName: "Status",
      flex: 1,
      minWidth: 130,
    },
    {
      field: "score",
      headerName: "Score",
      flex: 1,
      minWidth: 80,
    },
    {
      field: "action",
      headerName: "Action",
      sortable: false,
      flex: 3,
      minWidth: 180,
      renderCell: (params) => {
        return (
          <>
            <Tooltip title="Result" arrow>
              <IconButton aria-label="edit" size="small" color="primary">
                <BiExpand />
              </IconButton>
            </Tooltip>
          </>
        );
      },
    },
  ];

  return isMobile ? (
    <MobileOnlyView
      {...methods}
      paginationModel={paginationModel}
      setPaginationModel={setPaginationModel}
    />
  ) : (
    <Box>
      <Grid container rowSpacing={3} spacing={4}>
        <Grid item xs={12} lg={12}>
          <Card
            sx={{
              boxShadow: "none",
            }}
          >
            <CardHeader title="My Result" />
            <CardContent>
              <Box
                sx={{
                  width: "100%",
                }}
              >
                <DataGrid
                  rows={methods?.watch("rows")}
                  columns={columns}
                  rowCount={methods?.watch("rows")?.length}
                  paginationModel={paginationModel}
                  onPaginationModelChange={setPaginationModel}
                  paginationMode="server"
                  pageSizeOptions={[10, 20, 50]}
                  checkboxSelection
                  disableRowSelectionOnClick
                  onRowSelectionModelChange={(data) => {
                    methods?.setValue("result_ids", data, {
                      shouldDirty: true,
                    });
                  }}
                  rowSelectionModel={methods?.watch("result_ids")}
                  autoHeight
                  loading={false}
                  columnVisibilityModel={{
                    id: false,
                  }}
                  sx={{
                    "& .PrivateSwitchBase-input": {
                      height: "100% !important",
                      width: "100% !important",
                      margin: "0 !important",
                    },
                  }}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}

const MobileOnlyView = (props) => {
  return (
    <Paper style={{ width: "100%", backgroundColor: "transparent" }}>
      <Box padding={1} sx={{ mx: 1 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search Courses"
          sx={{
            "& .MuiInputBase-root": {
              height: "32px",
              fontSize: "12px",
              width: "99%",
            },
          }}
        />
      </Box>

      {props?.watch("rows")?.map((row, index) => (
        <Box
          key={index}
          sx={{
            padding: "8px",
            marginTop: "8px",
            marginBottom: "8px",
            marginLeft: "8px",
            marginRight: "8px",
            borderBottom: "1px solid #e0e0e0",
            display: "flex",
            flexDirection: "column",
            gap: "4px",
            boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.2)",
            borderRadius: "8px",
            backgroundColor: "white",
          }}
        >
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography
              variant="h6"
              fontWeight="bold"
              fontSize={"14px"}
            >
              {row?.courseName}
            </Typography>
            {row?.action}
          </Box>
          <Box display="flex" alignItems="center" gap="4px">
            <HistoryToggleOff style={{ color: "gray" }} />
            <Typography
              variant="body2"
              color="textSecondary"
              fontSize={"12px"}
            >
              {row?.dateTime}
            </Typography>
          </Box>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography variant="body2" fontSize={"10px"}>
              Score: {row?.score}
            </Typography>
            <Button
              variant="contained"
              style={{
                backgroundColor: row.status === "pass" ? "green" : "red",
                color: "white",
                padding: "1px 4px",
                fontSize: "8px",
              }}
            >
              {row?.status?.toUpperCase()}
            </Button>
          </Box>
        </Box>
      ))}

      <Box display="flex" justifyContent="center" padding={1}>
        <Stack spacing={2}>
          <Pagination
            count={Math.ceil(
              props?.watch("rows").length / props?.paginationModel?.pageSize
            )}
            page={props?.paginationModel?.page}
            onChange={(e, value) =>
              props?.setPaginationModel((p) => ({ ...p, page: value }))
            }
          />
        </Stack>
      </Box>
    </Paper>
  );
};
