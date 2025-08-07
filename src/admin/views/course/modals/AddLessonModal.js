import {
  Box,
  Button,
  Card,
  CardContent,
  Checkbox,
  CircularProgress,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  IconButton,
  List,
  ListItem,
} from "@mui/material";
import Grid from '@mui/material/Grid';
import React from "react";
import CustomTextField from "@acadlix/components/CustomTextField";
import { GetLessonsForCourse } from "@acadlix/requests/admin/AdminCourseRequest";
import { hasCapability } from "@acadlix/helpers/util";
import { IoClose, IoMdRefresh } from "@acadlix/helpers/icons";
import { __ } from "@wordpress/i18n";
import TitleSection from "../../lesson/sections/TitleSection";
import OptionSection from "../../lesson/sections/OptionSection";
import CustomRefresh from "@acadlix/components/CustomRefresh";


const AddLessonModal = (props) => {
  const handleLessonTypeChange = (type = "") => {
    props?.setValue("lesson_type", type, { shouldDirty: true });
  };

  return (
    <>
      <DialogTitle
        id="lesson-dialog-title"
        sx={{
          m: 0,
          p: 2,
        }}
      >
        {__("Add Lesson", "acadlix")}
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
              hasCapability("acadlix_add_lesson") &&
              <Button
                variant={
                  props?.watch("lesson_type") === "add_new"
                    ? "contained"
                    : "outlined"
                }
                color="primary"
                size="small"
                onClick={handleLessonTypeChange.bind(this, "add_new")}
              >
                {__("Add New", "acadlix")}
              </Button>
            }
            <Button
              variant={
                props?.watch("lesson_type") === "existing"
                  ? "contained"
                  : "outlined"
              }
              color="primary"
              size="small"
              onClick={handleLessonTypeChange.bind(this, "existing")}
            >
              {__("Add from existing", "acadlix")}
            </Button>
          </Box>

          {props?.watch("lesson_type") === "add_new" && (
            <AddNewLesson {...props} />
          )}

          {props?.watch("lesson_type") === "existing" && (
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
            {props?.isPending ? __("...loading", "acadlix") : __("Save Changes", "acadlix")}
          </Button>
        </DialogActions>
      </form>
    </>
  );
};

export default AddLessonModal;

const AddNewLesson = (props) => {

  return (
    <Box>
      <Grid
        container
        gap={2}
      >
        <TitleSection
          {...props}
        />
        <OptionSection
          {...props}
          videoUploadGridSize={{ xs: 12, sm: 12 }}
          hourGridSize={{ xs: 4, sm: 4 }}
          minutesGridSize={{ xs: 4, sm: 4 }}
          secondsGridSize={{ xs: 4, sm: 4 }}
        />

      </Grid>
    </Box>
  );
};

const AddFromExisting = (props) => {
  const [search, setSearch] = React.useState("");
  const { isFetching, data, refetch } = GetLessonsForCourse();

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
      <CustomRefresh
        refetch={refetch}
        disabled={isFetching}
        sx={{
          marginTop: 2,
        }}
      />
      {isFetching ? (
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
                label={__("Search Lesson...", "acadlix")}
                value={search}
                onChange={(e) => {
                  setSearch(e?.target?.value);
                }}
              />
            </Box>
            <List
              sx={{
                padding: 0,
              }}
            >
              {data?.data?.lessons?.length > 0 &&
                handleSearch(data?.data?.lessons)?.map((l, index) => (
                  <ListItem
                    key={index}
                    sx={{
                      padding: 0,
                    }}
                  >
                    <FormControlLabel
                      value={l?.ID}
                      label={l?.post_title}
                      control={
                        <Checkbox
                          checked={
                            props?.watch("lesson_ids")?.find(
                              (lesson_id) => lesson_id === l?.ID
                            )
                              ? true
                              : false
                          }
                          onClick={(e) => {
                            const found = props?.watch("lesson_ids")?.find(
                              (lesson_id) => lesson_id === l?.ID
                            );
                            if (e?.target?.checked && !found) {
                              props?.setValue(
                                "lesson_ids",
                                [...props?.watch("lesson_ids"), l?.ID],
                                {
                                  shouldDirty: true,
                                }
                              );
                            } else if (!e?.target?.checked && found) {
                              props?.setValue(
                                "lesson_ids",
                                props
                                  ?.watch("lesson_ids")
                                  ?.filter((lesson_id) => lesson_id !== l?.ID),
                                {
                                  shouldDirty: true,
                                }
                              );
                            }
                          }}
                        />
                      }
                    />
                  </ListItem>
                ))}
            </List>
          </CardContent>
        </Card>
      )}
    </Box>
  );
};


