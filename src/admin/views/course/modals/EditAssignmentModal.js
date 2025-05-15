import React from 'react'
import {
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Button,
  CircularProgress,
  Box,
  Card,
  CardContent,
  Typography,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Autocomplete,
  TextField,
} from '@mui/material';
import Grid from "@mui/material/Grid2";
import { __ } from '@wordpress/i18n';
import { IoClose } from '../../../../helpers/icons';
import { GetAssignmentById } from '../../../../requests/admin/AdminAssignmentRequest';
import CustomTextField from '../../../../components/CustomTextField';
import GridItem1 from '../../../../components/GridItem1';
import CustomTypography from '../../../../components/CustomTypography';
import CustomSwitch from '../../../../components/CustomSwitch';
import { DateTimePicker } from '@mui/x-date-pickers';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import dayjs from 'dayjs';
import { MediaUpload } from '@wordpress/media-utils';
import { convertToPostDate } from '../../../../helpers/util';


const EditAssignmentModel = (props) => {
  const { isFetching, data } = GetAssignmentById(props?.watch("assignment_id"));

  React.useEffect(() => {
    if (data?.data?.assignment) {
      if (window.tinymce) {
        const editor = window.tinymce.get("post_content");
        if (editor && editor.getContent() !== data?.data?.assignment?.post_content) {
          editor.setContent(data?.data?.assignment?.post_content || "");
        }
      }
      props?.reset({
        ...props?.watch(),
        title: data?.data?.assignment?.post_title ?? "",
        post_content: data?.data?.assignment?.post_content ?? "",
        meta: {
          assignment_type: data?.data?.assignment?.rendered_metas?.assignment_type ?? "writing",
          allow_multiple: Boolean(data?.data?.assignment?.rendered_metas?.allow_multiple) ?? false,
          allowed_mime_types: data?.data?.assignment?.rendered_metas?.allowed_mime_types ?? [],
          enable_marking: Boolean(data?.data?.assignment?.rendered_metas?.enable_marking) ?? false,
          max_marks: data?.data?.assignment?.rendered_metas?.max_marks ?? 0,
          start_date: data?.data?.assignment?.rendered_metas?.start_date ?? "",
          end_date: data?.data?.assignment?.rendered_metas?.end_date ?? "",
          resources: data?.data?.assignment?.rendered_metas?.resources?.map((r) => {
            return {
              title: r?.title,
              type: r?.type,
              filename: r?.filename,
              file_url: r?.file_url,
              link: r?.link,
            };
          }) ?? [],
        },
      });
    }
  }, [data]);

  return (
    <>
      <DialogTitle
        id="assignment-dialog-title"
        sx={{
          m: 0,
          p: 2,
        }}
      >
        {__("Edit Assignment", "acadlix")}
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
          {isFetching ? (
            <CircularProgress size={20} />
          ) : (
            <EditExistingAssignment {...props} />
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

export default EditAssignmentModel

const EditExistingAssignment = (props) => {
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

  const handleAddResoures = () => {
    props?.setValue(
      "meta.resources",
      [
        ...props?.watch("meta.resources"),
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
                  <CustomTypography>{__("Select Assignment Type", "acadlix")}</CustomTypography>
                </GridItem1>
                <GridItem1 size={{ xs: 12, sm: 6, lg: 3 }}>
                  <FormControl fullWidth size="small">
                    <InputLabel id="assignment-type">
                      {__("Select Assignment Type", "acadlix")}
                    </InputLabel>
                    <Select
                      labelId="assignment-type"
                      id="assignment-type"
                      value={props?.watch(`meta.assignment_type`)}
                      label={__("Select Assignment Type", "acadlix")}
                      onChange={(e) => {
                        props?.setValue(
                          `meta.assignment_type`,
                          e?.target?.value,
                          {
                            shouldDirty: true,
                          }
                        );
                      }}
                    >
                      <MenuItem value="writing">{__("Writing", "acadlix")}</MenuItem>
                      <MenuItem value="file_upload">{__("File Upload", "acadlix")}</MenuItem>
                    </Select>
                  </FormControl>
                </GridItem1>
                <GridItem1 size={{ xs: 12, sm: 6, lg: 3 }}>
                  <CustomTypography>{__("Allow Multiple", "acadlix")}</CustomTypography>
                </GridItem1>
                <GridItem1 size={{ xs: 12, sm: 6, lg: 3 }}>
                  <FormControlLabel
                    control={<CustomSwitch />}
                    checked={props?.watch("meta.allow_multiple") ?? false}
                    onChange={(e) => {
                      props?.setValue("meta.allow_multiple", e?.target?.checked, {
                        shouldDirty: true,
                      });
                    }}
                    disabled={
                      props?.watch("meta.assignment_type") !== "file_upload"
                    }
                    label={__("Activate", "acadlix")}
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
                    filterSelectedOptions
                    value={props?.watch(`meta.allowed_mime_types`)}
                    onChange={(event, value) => {
                      props?.setValue(`meta.allowed_mime_types`, value, {
                        shouldDirty: true,
                      });
                    }}
                    disabled={
                      props?.watch("meta.assignment_type") !== "file_upload"
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
                <GridItem1 size={{ xs: 12, sm: 12, lg: 6 }} />
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
                  <CustomTypography>{__("Max. Marks", "acadlix")}</CustomTypography>
                </GridItem1>
                <GridItem1 size={{ xs: 12, sm: 6, lg: 3 }}>
                  <CustomTextField
                    size="small"
                    fullWidth
                    type="number"
                    value={props?.watch(`meta.max_marks`)}
                    onChange={(e) => {
                      props?.setValue(`meta.max_marks`, Number(e?.target?.value), {
                        shouldDirty: true,
                      });
                    }}
                    label={__("Max. Marks", "acadlix")}
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
                  <Typography variant="h6">{__("Resources", "acadlix")}</Typography>
                  <Divider />
                </Box>
              </Box>
              <Grid container spacing={2}>
                {props?.watch("meta.resources")?.length > 0 &&
                  props
                    ?.watch("meta.resources")
                    ?.map((r, index) => (
                      <Resources
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
                    onClick={handleAddResoures}
                  >
                    {__("Add Resources", "acadlix")}
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

const Resources = (props) => {
  const handleMediaChange = (media) => {
    props?.setValue(`meta.resources.${props?.index}.filename`, media?.filename, {
      shouldDirty: true,
    });
    props?.setValue(`meta.resources.${props?.index}.file_url`, media?.url, {
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
                value={props?.watch(`meta.resources.${props?.index}.title`) ?? ""}
                onChange={(e) => {
                  props?.setValue(
                    `meta.resources.${props?.index}.title`,
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
                  value={props?.watch(`meta.resources.${props?.index}.type`)}
                  label={__("Type", "acadlix")}
                  onChange={(e) => {
                    props?.setValue(
                      `meta.resources.${props?.index}.type`,
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
                  value={props?.watch(`meta.resources.${props?.index}.link`) ?? ""}
                  onChange={(e) => {
                    props?.setValue(
                      `meta.resources.${props?.index}.link`,
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
                    "meta.resources",
                    props
                      ?.watch("meta.resources")
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