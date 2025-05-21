import {
  Autocomplete,
  Box,
  Button,
  Card,
  CardContent,
  Checkbox,
  CircularProgress,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  FormControlLabel,
  IconButton,
  InputLabel,
  List,
  ListItem,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import React from "react";
import Grid from "@mui/material/Grid2";
import { __ } from "@wordpress/i18n";
import { convertToPostDate, hasCapability } from "../../../../helpers/util";
import { IoClose, IoMdRefresh } from "../../../../helpers/icons";
import CustomTextField from "../../../../components/CustomTextField";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { DateTimePicker } from "@mui/x-date-pickers";
import GridItem1 from "../../../../components/GridItem1";
import CustomTypography from "../../../../components/CustomTypography";
import CustomSwitch from "../../../../components/CustomSwitch";
import { MediaUpload } from "@wordpress/media-utils";
import dayjs from "dayjs";
import { GetAssignmentsForCourse } from "../../../../requests/admin/AdminCourseRequest";

const AddAssignmentModal = (props) => {
  const handleAssignmentTypeChange = (type = "") => {
    props?.setValue("assignment_type", type, { shouldDirty: true });
  };

  return (
    <>
      <DialogTitle
        id="assignment-dialog-title"
        sx={{
          m: 0,
          p: 2,
        }}
      >
        {__("Add Assignment", "acadlix")}
      </DialogTitle>
      <IconButton
        aria-label="close"
        onClick={props?.handleClose}
        sx={{
          position: "absolute",
          right: 8,
          top: 8,
          color: (theme) => theme.palette.grey[500],
        }}
      >
        <IoClose />
      </IconButton>
      <form onSubmit={props?.handleSubmit(props?.onSubmit)}>
        <DialogContent
          sx={{
            padding: "1rem !important",
            backgroundColor: props?.colorCode?.modal_background,
            maxHeight: {
              xs: "450px",
              sm: "350px",
            },
            overflowY: "auto",
          }}
        >
          <Box
            sx={{
              display: "flex",
              gap: 2,
              paddingBottom: 2
            }}
          >
            {
              hasCapability("acadlix_add_assignment") &&
              <Button
                variant={
                  props?.watch("assignment_type") === "add_new"
                    ? "contained"
                    : "outlined"
                }
                color="primary"
                size="small"
                onClick={handleAssignmentTypeChange.bind(this, "add_new")}
              >
                {__("Add New", "acadlix")}
              </Button>
            }
            <Button
              variant={
                props?.watch("assignment_type") === "existing"
                  ? "contained"
                  : "outlined"
              }
              color="primary"
              size="small"
              onClick={handleAssignmentTypeChange.bind(this, "existing")}
            >
              {__("Add from existing", "acadlix")}
            </Button>
          </Box>

          {props?.watch("assignment_type") === "add_new" && (
            <AddNewAssignment {...props} />
          )}

          {props?.watch("assignment_type") === "existing" && (
            <AddFromExisting {...props} />
          )}
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            color="error"
            onClick={props?.handleClose}
          >
            {__("Cancel", "acadlix")}
          </Button>
          <Button variant="contained" type="submit" disabled={props?.isPending}>
            {props?.isPending ? __("...loading", "acadlix") : __("Save Change", "acadlix")}
          </Button>
        </DialogActions>
      </form>
    </>
  )
}

export default AddAssignmentModal

const AddNewAssignment = (props) => {
  const MimeTypes = [
    {
      extension: "pdf",
      label: "PDF",
    },
    {
      extension: "doc",
      label: "Word",
    },
    {
      extension: "docx",
      label: "Word",
    },
    {
      extension: "xls",
      label: "Excel",
    },
    {
      extension: "xlsx",
      label: "Excel",
    },
    {
      extension: "txt",
      label: "Text",
    },
    {
      extension: "ppt",
      label: "PowerPoint",
    },
    {
      extension: "pptx",
      label: "PowerPoint",
    },
    {
      extension: "jpeg",
      label: "Images",
    },
    {
      extension: "jpg",
      label: "Images",
    },
    {
      extension: "png",
      label: "Images",
    },

  ];
  const loadPage = () => {
    props?.loadEditor("post_content", "post_content");
  };

  React.useEffect(() => {
    loadPage();
    window.addEventListener("load", loadPage);

    return () => {
      props?.removeEditor("post_content");
      window.removeEventListener("load", loadPage);
    };
  }, []);

  const handleAddAttachments = () => {
    props?.setValue(
      "meta.attachments",
      [
        ...props?.watch("meta.attachments"),
        {
          title: "",
          type: "upload",
          filename: "",
          file_url: "",
          link: "",
        },
      ],
      { shouldDirty: true }
    );
  };


  return (
    <Box>
      <Grid container gap={2}>
        <Grid size={{ xs: 12, sm: 12 }}>
          <Card>
            <CardContent>
              <Grid
                container
                spacing={4}
                sx={{
                  color: "black",
                }}
              >
                <Grid size={{ xs: 12, sm: 12 }}>
                  <Typography variant="h6">
                    {__("Assignment Title", "acadlix")}
                    <span style={{ color: "red" }}>*</span>
                  </Typography>
                </Grid>
                {/* Used to enter quiz title  */}
                <Grid size={{ xs: 12, sm: 12 }}>
                  <CustomTextField
                    {...props?.register("title", { required: "Title is required." })}
                    fullWidth
                    name="title"
                    size="small"
                    label={__("Assignment Title*", "acadlix")}
                    value={props?.watch("title")}
                    inputProps={{
                      sx: {
                        border: `0 !important`,
                        boxShadow: `none !important`,
                        minHeight: `auto !important`,
                      },
                    }}
                    onChange={(e) => {
                      props?.setValue("title", e?.target?.value, {
                        shouldDirty: true,
                        shouldValidate: true,
                      });
                    }}
                    error={Boolean(props?.formState?.errors?.title)}
                    helperText={props?.formState?.errors?.title?.message}
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 12 }}>
          <Card>
            <CardContent>
              <Grid
                container
                spacing={4}
                sx={{
                  color: "black",
                }}
              >
                <Grid size={{ xs: 12, sm: 12 }}>
                  <Typography variant="h6">{__("Instruction", "acadlix")}</Typography>
                </Grid>
                <Grid size={{ xs: 12, sm: 12 }}>
                  <textarea
                    id="post_content"
                    style={{
                      width: "100%",
                    }}
                    value={props?.watch("post_content") ?? ""}
                    onChange={(e) => {
                      let value = e?.target?.value;
                      if (window?.tinymce) {
                        const editor = window.tinymce.get("post_content");
                        if (editor && editor.getContent() !== value) {
                          editor.setContent(value || "");
                        }
                      }
                      props.setValue("post_content", value, {
                        shouldDirty: true,
                      });
                    }}
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 12 }}>
          <Card>
            <CardContent>
              <Box
                sx={{
                  marginY: 2,
                }}>
                <Box sx={{ color: "black" }}>
                  <Typography variant="h6">{__("Options", "acadlix")}</Typography>
                  <Divider />
                </Box>
              </Box>
              <Grid
                container
                spacing={3}
                alignItems="center"
              >
                <GridItem1 size={{ xs: 12, sm: 6, lg: 3 }}>
                  <CustomTypography>{__("Allow Uploads", "acadlix")}</CustomTypography>
                </GridItem1>
                <GridItem1 size={{ xs: 12, sm: 6, lg: 3 }}>
                  <FormControlLabel
                    control={<CustomSwitch />}
                    checked={props?.watch("meta.allow_uploads") ?? false}
                    onChange={(e) => {
                      props?.setValue("meta.allow_uploads", e?.target?.checked, {
                        shouldDirty: true,
                      });
                    }}
                    label={__("Activate", "acadlix")}
                  />
                </GridItem1>
                <GridItem1 size={{ xs: 12, sm: 6, lg: 3 }}>
                  <CustomTypography>{__("Number of Uploads", "acadlix")}</CustomTypography>
                </GridItem1>
                <GridItem1 size={{ xs: 12, sm: 6, lg: 3 }}>
                  <CustomTextField
                    size="small"
                    fullWidth
                    type="number"
                    value={props?.watch(`meta.number_of_uploads`)}
                    onChange={(e) => {
                      props?.setValue(
                        `meta.number_of_uploads`,
                        e?.target?.value,
                        {
                          shouldDirty: true,
                        }
                      );
                    }}
                    disabled={!props?.watch("meta.allow_uploads")}
                    inputProps={{
                      sx: {
                        border: `0 !important`,
                        boxShadow: `none !important`,
                        minHeight: `auto !important`,
                      },
                    }}
                  />
                </GridItem1>
                <GridItem1 size={{ xs: 12, sm: 6, lg: 3 }}>
                  <CustomTypography>{__("Allowed Mime Type(s)", "acadlix")}</CustomTypography>
                </GridItem1>
                <GridItem1 size={{ xs: 12, sm: 6, lg: 3 }}>
                  <Autocomplete
                    size="small"
                    fullWidth
                    multiple
                    id="mime-types"
                    options={MimeTypes}
                    getOptionLabel={(option) => `${option.label} (.${option.extension})`}
                    disableCloseOnSelect
                    filterSelectedOptions
                    isOptionEqualToValue={(option, value) => option?.extension === value?.extension}
                    value={props?.watch(`meta.allowed_mime_types`)}
                    onChange={(event, value) => {
                      props?.setValue(`meta.allowed_mime_types`, value, {
                        shouldDirty: true,
                      });
                    }}
                    disabled={
                      !props?.watch("meta.allow_uploads")
                    }
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        slotProps={{
                          input: {
                            ...params.InputProps,
                            autoComplete: "mime-types",
                          },
                          htmlInput: {
                            ...params.inputProps,
                            sx: {
                              border: `0 !important`,
                              boxShadow: `none !important`,
                              minHeight: `auto !important`,
                            },
                          }
                        }}
                        variant="outlined"
                        label={__("Allowed Mime Type(s)", "acadlix")}
                        placeholder={__("Select Mime Type(s)", "acadlix")}
                      />
                    )}
                  />
                </GridItem1>
                <GridItem1 size={{ xs: 12, sm: 6, lg: 3 }}>
                  <CustomTypography>{__("Max. File Size (MB)", "acadlix")}</CustomTypography>
                </GridItem1>
                <GridItem1 size={{ xs: 12, sm: 6, lg: 3 }}>
                  <CustomTextField
                    size="small"
                    fullWidth
                    type="number"
                    value={props?.watch(`meta.max_file_size`)}
                    onChange={(e) => {
                      props?.setValue(`meta.max_file_size`, Number(e?.target?.value), {
                        shouldDirty: true,
                      });
                    }}
                    disabled={!props?.watch("meta.allow_uploads")}
                    label={__("Max. File Size (MB)", "acadlix")}
                    inputProps={{
                      sx: {
                        border: `0 !important`,
                        boxShadow: `none !important`,
                        minHeight: `auto !important`,
                      },
                    }}
                  />
                </GridItem1>
                <GridItem1 size={{ xs: 12, sm: 6, lg: 3 }}>
                  <CustomTypography>{__("Enable marking", "acadlix")}</CustomTypography>
                </GridItem1>
                <GridItem1 size={{ xs: 12, sm: 6, lg: 3 }}>
                  <FormControlLabel
                    control={<CustomSwitch />}
                    checked={props?.watch("meta.enable_marking") ?? false}
                    onChange={(e) => {
                      props?.setValue("meta.enable_marking", e?.target?.checked, {
                        shouldDirty: true,
                      });
                    }}
                    label={__("Activate", "acadlix")}
                  />
                </GridItem1>
                <GridItem1 size={{ xs: 12, sm: 6, lg: 3 }}>
                  <CustomTypography>{__("Max. Points", "acadlix")}</CustomTypography>
                </GridItem1>
                <GridItem1 size={{ xs: 12, sm: 6, lg: 3 }}>
                  <CustomTextField
                    size="small"
                    fullWidth
                    type="number"
                    value={props?.watch(`meta.max_points`)}
                    onChange={(e) => {
                      props?.setValue(`meta.max_points`, Number(e?.target?.value), {
                        shouldDirty: true,
                      });
                    }}
                    label={__("Max. Points", "acadlix")}
                    disabled={!props?.watch("meta.enable_marking")}
                    inputProps={{
                      sx: {
                        border: `0 !important`,
                        boxShadow: `none !important`,
                        minHeight: `auto !important`,
                      },
                    }}
                  />
                </GridItem1>
                <GridItem1 size={{ xs: 12, sm: 6, lg: 3 }}>
                  <CustomTypography>{__("Start Date", "acadlix")}</CustomTypography>
                </GridItem1>
                <GridItem1 size={{ xs: 12, sm: 6, lg: 3 }}>
                  <DemoContainer components={["DateTimePicker"]} sx={{
                    "& .MuiFormControl-root ": {
                      minWidth: "100% !important",
                    },
                  }}>
                    <DateTimePicker
                      label={__("Enter Start Date", "acadlix")}
                      format="DD/MM/YYYY hh:mm:a"
                      timeSteps={{
                        minutes: 1,
                      }}
                      sx={{
                        "& .MuiFormControl-root ": {
                          maxHeight: "42px",
                        },
                        ".MuiInputBase-input": {
                          padding: "9px 14px !important",
                          border: `0 !important`,
                          boxShadow: `none !important`,
                          minHeight: `auto !important`,
                        },
                        ".MuiFormLabel-root": {
                          top: "-7px !important",
                        },
                        ".MuiInputLabel-shrink": {
                          top: "0px !important",
                        },
                      }}
                      value={
                        props?.watch("meta.start_date")
                          ? dayjs(props?.watch("meta.start_date"))
                          : null
                      }
                      onChange={(value) => {
                        props?.setValue("meta.start_date", convertToPostDate(value), {
                          shouldDirty: true,
                        });
                      }}
                    />
                  </DemoContainer>
                  {props?.formState?.errors?.meta?.start_date && (
                    <Typography component="p" color="error">
                      {props?.formState?.errors?.meta?.start_date?.message}
                    </Typography>
                  )}
                </GridItem1>
                <GridItem1 size={{ xs: 12, sm: 6, lg: 3 }}>
                  <CustomTypography>{__("End Date", "acadlix")}</CustomTypography>
                </GridItem1>
                <GridItem1 size={{ xs: 12, sm: 6, lg: 3 }}>
                  <DemoContainer components={["DateTimePicker"]} sx={{
                    "& .MuiFormControl-root ": {
                      minWidth: "100% !important",
                    },
                  }}>
                    <DateTimePicker
                      label={__("Enter End Date", "acadlix")}
                      timeSteps={{
                        minutes: 1,
                      }}
                      sx={{
                        ".MuiFormControl-root ": {
                          maxHeight: "42px",
                        },
                        ".MuiInputBase-input": {
                          padding: "9px 14px !important",
                          border: `0 !important`,
                          boxShadow: `none !important`,
                          minHeight: `auto !important`,
                        },
                        ".MuiFormLabel-root": {
                          top: "-7px !important",
                        },
                        ".MuiInputLabel-shrink": {
                          top: "0px !important",
                        },
                      }}
                      format="DD/MM/YYYY hh:mm:a"
                      value={
                        props?.watch("meta.end_date")
                          ? dayjs(props?.watch("meta.end_date"))
                          : null
                      }
                      onChange={(value) => {
                        props?.setValue("meta.end_date", convertToPostDate(value), {
                          shouldDirty: true,
                        });
                      }}
                    />
                  </DemoContainer>
                  {props?.formState?.errors?.meta?.end_date && (
                    <Typography component="p" color="error">
                      {props?.formState?.errors?.meta?.end_date?.message}
                    </Typography>
                  )}
                </GridItem1>
                <GridItem1 size={{ xs: 12, sm: 6, lg: 3 }} >
                  <CustomTypography>{__("Enable deadline", "acadlix")}</CustomTypography>
                </GridItem1>
                <GridItem1 size={{ xs: 12, sm: 6, lg: 3 }}>
                  <FormControlLabel
                    control={<CustomSwitch />}
                    checked={props?.watch("meta.enable_deadline") ?? false}
                    onChange={(e) => {
                      props?.setValue("meta.enable_deadline", e?.target?.checked, {
                        shouldDirty: true,
                      });
                    }}
                    label={__("Activate", "acadlix")}
                  />
                </GridItem1>
                <GridItem1 size={{ xs: 12, sm: 6, lg: 3 }}>
                  <CustomTypography>{__("Deadline", "acadlix")}</CustomTypography>
                </GridItem1>
                <GridItem1 size={{ xs: 12 / 2, sm: 6 / 2, lg: 3 / 2 }}>
                  <CustomTextField
                    size="small"
                    fullWidth
                    type="number"
                    value={props?.watch(`meta.deadline_value`)}
                    onChange={(e) => {
                      props?.setValue(`meta.deadline_value`, Number(e?.target?.value), {
                        shouldDirty: true,
                      });
                    }}
                    disabled={!props?.watch("meta.enable_deadline")}
                    label={__("Deadline", "acadlix")}
                    inputProps={{
                      sx: {
                        border: `0 !important`,
                        boxShadow: `none !important`,
                        minHeight: `auto !important`,
                      },
                    }}
                  />
                </GridItem1>
                <GridItem1 size={{ xs: 12 / 2, sm: 6 / 2, lg: 3 / 2 }}>
                  <FormControl fullWidth size="small">
                    <InputLabel id="deadline-type">
                      {__("Select Type", "acadlix")}
                    </InputLabel>
                    <Select
                      labelId="deadline-type"
                      id="deadline-type"
                      label={__("Select Type", "acadlix")}
                      size="small"
                      fullWidth
                      value={props?.watch(`meta.deadline_type`)}
                      onChange={(e) => {
                        props?.setValue(`meta.deadline_type`, e?.target?.value, {
                          shouldDirty: true,
                        });
                      }}
                      disabled={!props?.watch("meta.enable_deadline")}
                      inputProps={{
                        sx: {
                          border: `0 !important`,
                          boxShadow: `none !important`,
                          minHeight: `auto !important`,
                        },
                      }}
                    >
                      <MenuItem value="days">{__("Days", "acadlix")}</MenuItem>
                      <MenuItem value="weeks">{__("Weeks", "acadlix")}</MenuItem>
                    </Select>
                  </FormControl>
                </GridItem1>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 12 }}>
          <Card>
            <CardContent>
              <Box
                sx={{
                  marginY: 2,
                }}>
                <Box sx={{ color: "black" }}>
                  <Typography variant="h6">{__("Attachments", "acadlix")}</Typography>
                  <Divider />
                </Box>
              </Box>
              <Grid container spacing={2}>
                {props?.watch("meta.attachments")?.length > 0 &&
                  props
                    ?.watch("meta.attachments")
                    ?.map((r, index) => (
                      <Attachments
                        key={index}
                        index={index}
                        {...props}
                        {...r}
                      />
                    ))}

                <Grid size={{ xs: 12, sm: 12 }}>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleAddAttachments}
                  >
                    {__("Add Attachments", "acadlix")}
                  </Button>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  )
}

const Attachments = (props) => {
  const handleMediaChange = (media) => {
    props?.setValue(`meta.attachments.${props?.index}.filename`, media?.filename, {
      shouldDirty: true,
    });
    props?.setValue(`meta.attachments.${props?.index}.file_url`, media?.url, {
      shouldDirty: true,
    });
  };
  return (
    <Grid size={{ xs: 12, sm: 12 }}>
      <Card>
        <CardContent>
          <Grid
            container
            spacing={4}
            sx={{
              color: "black",
            }}
          >
            <Grid size={{ xs: 12, sm: 12 }}>
              <CustomTextField
                fullWidth
                name="title"
                size="small"
                label={__("Enter Title", "acadlix")}
                value={props?.watch(`meta.attachments.${props?.index}.title`) ?? ""}
                onChange={(e) => {
                  props?.setValue(
                    `meta.attachments.${props?.index}.title`,
                    e?.target?.value,
                    {
                      shouldDirty: true,
                    }
                  );
                }}
                inputProps={{
                  sx: {
                    border: `0 !important`,
                    boxShadow: `none !important`,
                    minHeight: `auto !important`,
                  },
                }}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 12 }}>
              <FormControl fullWidth size="small">
                <InputLabel id="demo-simple-select-label">{__("Type", "acadlix")}</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={props?.watch(`meta.attachments.${props?.index}.type`)}
                  label={__("Type", "acadlix")}
                  onChange={(e) => {
                    props?.setValue(
                      `meta.attachments.${props?.index}.type`,
                      e?.target?.value,
                      {
                        shouldDirty: true,
                      }
                    );
                  }}
                >
                  <MenuItem value="upload">{__("Upload", "acadlix")}</MenuItem>
                  <MenuItem value="link">{__("Link", "acadlix")}</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            {props?.type === "upload" && (
              <Grid size={{ xs: 12, sm: 12 }}>
                <MediaUpload
                  onSelect={handleMediaChange}
                  render={({ open }) => (
                    <Button variant="contained" onClick={open}>
                      {__("Upload File", "acadlix")}
                    </Button>
                  )}
                />
                {props?.filename && (
                  <>
                    <Typography variant="body1" sx={{ marginTop: 2 }}>
                      {__("Selected file:", "acadlix")}{" "}
                      <a href={props?.file_url} target="_blank">
                        {props?.filename}
                      </a>
                    </Typography>
                  </>
                )}
              </Grid>
            )}
            {props?.type === "link" && (
              <Grid size={{ xs: 12, sm: 12 }}>
                <CustomTextField
                  fullWidth
                  name="link"
                  size="small"
                  label={__("https://example.com/", "acadlix")}
                  value={props?.watch(`meta.attachments.${props?.index}.link`) ?? ""}
                  onChange={(e) => {
                    props?.setValue(
                      `meta.attachments.${props?.index}.link`,
                      e?.target?.value,
                      {
                        shouldDirty: true,
                      }
                    );
                  }}
                  inputProps={{
                    sx: {
                      border: `0 !important`,
                      boxShadow: `none !important`,
                      minHeight: `auto !important`,
                    },
                  }}
                />
              </Grid>
            )}
            <Grid size={{ xs: 12, sm: 12 }}>
              <Button
                variant="contained"
                color="error"
                onClick={(e) => {
                  props?.setValue(
                    "meta.attachments",
                    props
                      ?.watch("meta.attachments")
                      ?.filter((_, i) => i !== props?.index),
                    { shouldDirty: true }
                  );
                }}
              >
                {__("Remove", "acadlix")}
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Grid>
  );
}

const AddFromExisting = (props) => {
  const [search, setSearch] = React.useState("");
  const { isFetching, data, refetch } = GetAssignmentsForCourse();

  const handleSearch = (data) => {
    if (search === "") {
      return data;
    } else {
      return data?.filter((d) =>
        d?.post_title?.toLowerCase()?.includes(search?.toLowerCase())
      );
    }
  };

  return (
    <Box>
      <Button
        color="primary"
        variant="contained"
        onClick={(e) => {
          refetch();
        }}
        disabled={isFetching}
        sx={{
          marginTop: 2,
        }}
      >
        <IoMdRefresh
          style={{
            fontSize: 18,
            marginRight: 1,
          }}
        />
      </Button>
      {
        isFetching ? (
          <CircularProgress
            size={20}
            sx={{
              marginY: 2,
              display: "flex",
              justifyContent: "center",
            }}
          />
        ) : (
          <Card
            sx={{
              marginY: 2,
            }}
          >
            <CardContent>
              <Box>
                <CustomTextField
                  fullWidth
                  name="title"
                  size="small"
                  label={__("Search Assignment...", "acadlix")}
                  value={search}
                  onChange={(e) => {
                    setSearch(e?.target?.value);
                  }}
                  inputProps={{
                    sx: {
                      border: `0 !important`,
                      boxShadow: `none !important`,
                      minHeight: `auto !important`,
                    },
                  }}
                />
              </Box>
              <List>
                {
                  data?.data?.assignments?.length > 0 &&
                  handleSearch(data?.data?.assignments)?.map((a, index) => (
                    <ListItem
                      key={index}
                      sx={{
                        padding: 0,
                      }}
                    >
                      <FormControlLabel
                        value={a?.ID}
                        label={a?.post_title}
                        control={
                          <Checkbox
                            checked={
                              props?.watch("assignment_ids")?.find(
                                (assignment_id) => assignment_id === a?.ID
                              )
                                ? true
                                : false
                            }
                            onClick={(e) => {
                              const found = props?.watch("assignment_ids")?.find(
                                (assignment_id) => assignment_id === a?.ID
                              );
                              if (e?.target?.checked && !found) {
                                props?.setValue(
                                  "assignment_ids",
                                  [...props?.watch("assignment_ids"), a?.ID],
                                  { shouldDirty: true }
                                );
                              } else if (!e?.target?.checked && found) {
                                props?.setValue(
                                  "assignment_ids",
                                  props?.watch("assignment_ids")?.filter(
                                    (assignment_id) => assignment_id !== a?.ID
                                  ),
                                  { shouldDirty: true }
                                );
                              }
                            }}
                          />
                        }
                      />
                    </ListItem>
                  ))
                }
              </List>
            </CardContent>
          </Card>
        )
      }
    </Box>
  )
}