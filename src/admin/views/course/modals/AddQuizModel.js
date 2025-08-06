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
import React from "react";
import { GetQuizzesForCourse } from "@acadlix/requests/admin/AdminCourseRequest";
import CustomTextField from "@acadlix/components/CustomTextField";
import { IoClose, IoMdRefresh } from "@acadlix/helpers/icons";
import { __ } from "@wordpress/i18n";
import CustomRefresh from "@acadlix/components/CustomRefresh";

const AddQuizModel = (props) => {
  const { isFetching, data, refetch } = GetQuizzesForCourse();

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
          <AddFromExisting {...props} isFetching={isFetching} data={data} />
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
            {props?.isPending ? "...loading" : "Save Changes"}
          </Button>
        </DialogActions>
      </form>
    </>
  );
};

export default AddQuizModel;

const AddFromExisting = (props) => {
  const [search, setSearch] = React.useState("");

  if (props?.isFetching) {
    return (
      <CircularProgress
        size={20}
        sx={{
          marginY: 2,
          display: "flex",
          justifyContent: "center",
        }}
      />
    );
  }

  const handleSearch = (data) => {
    if (search === '') {
      return data;
    } else {
      return data?.filter(d => d?.post_title?.toLowerCase()?.includes(search?.toLowerCase()));
    }
  }

  return (
    <Box
      sx={{
        marginY: 2,
      }}
    >
      <Card>
        <CardContent>
          <Box>
            <CustomTextField
              fullWidth
              name="title"
              size="small"
              label={__("Search Quiz...", "acadlix")}
              value={search}
              onChange={(e) => { setSearch(e?.target?.value) }}
            />
          </Box>
          <List
            sx={{
              padding: 0,
            }}
          >
            {props?.data?.data?.quizzes?.length > 0 &&
              handleSearch(props?.data?.data?.quizzes)?.map((q, index) => (
                <ListItem
                  key={index}
                  sx={{
                    padding: 0,
                  }}
                >
                  <FormControlLabel
                    value={q?.ID}
                    label={q?.post_title}
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
        </CardContent>
      </Card>
    </Box>
  );
};
