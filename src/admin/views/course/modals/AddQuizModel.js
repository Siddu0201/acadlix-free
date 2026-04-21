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
  FormControlLabel,
  IconButton,
  List,
  ListItem,
  TextField,
} from "@mui/material";
import React from "react";
import { GetQuizzesForCourse } from "@acadlix/requests/admin/AdminCourseRequest";
import CustomTextField from "@acadlix/components/CustomTextField";
import { IoClose } from "@acadlix/helpers/icons";
import { __ } from "@wordpress/i18n";
import CustomRefresh from "@acadlix/components/CustomRefresh";

const AddQuizModel = (props) => {
  const [search, setSearch] = React.useState("");
  const [selectedCategories, setSelectedCategories] = React.useState([]);
  const { isFetching, data, refetch } = GetQuizzesForCourse(
    search,
    selectedCategories
  );
  return (
    <>
      <DialogTitle
        id="quiz-dialog-title"
        sx={{
          m: 0,
          p: 2,
        }}
      >
        {__("Add Quiz", "acadlix")}
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
            }}
          >
            <Button
              variant="contained"
              color="primary"
              size="small"
              component="a"
              target="_blank"
              href={`${acadlixOptions?.acadlix_quiz_url}#/create`}
            >
              {__("Add New", "acadlix")}
            </Button>
            <CustomRefresh
              refetch={refetch}
              disabled={isFetching}
            />
          </Box>
          <AddFromExisting
            {...props}
            data={data}
            isFetching={isFetching}
            search={search}
            setSearch={setSearch}
            selectedCategories={selectedCategories}
            setSelectedCategories={setSelectedCategories}
          />
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

export default AddQuizModel;

const AddFromExisting = (props) => {
  return (
    <Box
      sx={{
        marginY: 2,
      }}
    >
      <Card>
        <CardContent>
          <Box sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
            justifyContent: "space-between",
          }}>
            <Box>
              <Autocomplete
                multiple
                id="category-select"
                options={props?.data?.data?.categories ?? []}
                getOptionLabel={(option) => option?.name ?? ""}
                onChange={(event, newValue) => {
                  props?.setSelectedCategories(newValue?.map((v) => v?.term_id));
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    variant="outlined"
                    label={__("Filter by Category", "acadlix")}
                    placeholder={__("Select categories", "acadlix")}
                    size="small"
                  />
                )}
                sx={{
                  minWidth: '300px',
                }}
              />
            </Box>
            <CustomTextField
              name="title"
              size="small"
              label={__("Search Quiz...", "acadlix")}
              value={props?.search}
              onChange={(e) => { props?.setSearch(e?.target?.value) }}
            />
          </Box>
          {
            props?.isFetching ? (
              <CircularProgress
                size={20}
                sx={{
                  marginY: 2,
                  display: "flex",
                  justifyContent: "center",
                }}
              />
            ) : (
              <List
                sx={{
                  padding: 0,
                }}
              >
                {props?.data?.data?.quizzes?.length > 0 &&
                  props?.data?.data?.quizzes?.map((q, index) => (
                    <ListItem
                      key={index}
                      sx={{
                        padding: 0,
                      }}
                    >
                      <FormControlLabel
                        value={q?.ID}
                        label={`${q?.post_title} (${q?.category?.name ?? "Uncategorized"})`}
                        control={
                          <Checkbox
                            checked={
                              props?.watch("quiz_ids")?.find(
                                (quiz_id) => quiz_id === q?.ID
                              )
                                ? true
                                : false
                            }
                            onClick={(e) => {
                              const found = props?.watch("quiz_ids")?.find(
                                (quiz_id) => quiz_id === q?.ID
                              );
                              if (e?.target?.checked && !found) {
                                props?.setValue(
                                  "quiz_ids",
                                  [...props?.watch("quiz_ids"), q?.ID],
                                  {
                                    shouldDirty: true,
                                  }
                                );
                              } else if (!e?.target?.checked && found) {
                                props?.setValue(
                                  "quiz_ids",
                                  props
                                    ?.watch("quiz_ids")
                                    ?.filter((quiz_id) => quiz_id !== q?.ID),
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
            )
          }
        </CardContent>
      </Card>
    </Box>
  );
};
