import { Autocomplete, Button, CircularProgress, DialogActions, DialogContent, DialogTitle, Grid, IconButton, Paper, TextField, Typography } from "@mui/material";
import React from "react";
import {
  GetCategories,
  PostCreateCategory,
} from "../../../../requests/admin/AdminCategoryRequest";
import { useForm } from "react-hook-form";
import { IoClose } from "../../../../helpers/icons";
import { PostSetCategory } from "../../../../requests/admin/AdminQuizRequest";

const CategoryModel = (props) => {
  const methods = useForm({
    defaultValues: {
      category_id: null,
    },
  });
  const [input, setInput] = React.useState("");
  const [categories, setCategories] = React.useState([]);
  const createCategoryMutation = PostCreateCategory();

  const createCategory = () => {
    if (!input) {
      methods?.setError(`category_id`, {
        type: "custom",
        message: "Category cannot be empty",
      });
      return;
    }

    if (categories?.filter(
      (d) => d?.name?.toLowerCase() === input?.toLowerCase()
    )?.length > 0) {
      methods?.setError(`category_id`, {
        type: "custom",
        message: "Category name is already exist",
      });
      return;
    }

    createCategoryMutation.mutate(
      { category_name: input },
      {
        onSuccess: (data) => {
          methods?.clearErrors("category_id");
          setCategories(data?.data?.categories);
          methods?.setValue(
            "category_id",
            data?.data?.category?.term_id ?? null,
            {
              shouldDirty: true,
            }
          );
        },
      }
    );
  };

  const getCategories = GetCategories();

  React.useMemo(() => {
    if (getCategories?.data?.data?.categories?.length > 0) {
      setCategories(getCategories?.data?.data?.categories);
    }
  }, [getCategories?.data?.data]);

  const setCategory = PostSetCategory();
  const handleSubmit = (data) => {
    if(!data?.category_id){
      methods?.setError(`category_id`, {
        type: "custom",
        message: "Category cannot be empty",
      });
      return;
    }
    setCategory?.mutate(
      {
        quiz_ids: props?.watch("quiz_ids"),
        ...data,
      },
      {
        onSettled: () => {
          props?.setValue("action", "", { shouldDirty: true });
          props?.setValue("quiz_ids", [], { shouldDirty: true });
          props?.handleClose();
        },
      }
    );
  };

  return (
    <>
      <DialogTitle id="alert-dialog-title" sx={{ m: 0, p: 2 }}>
        Set Category
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
      <DialogContent>
        <Grid container gap={4}>
          <Grid item xs={12} lg={12}>
            <Autocomplete
              size="small"
              value={
                methods?.watch("category_id") !== null
                  ? categories?.find(
                    (option) => methods?.watch("category_id") === option?.term_id
                  )
                  : null
              }
              options={categories ? categories : []}
              getOptionLabel={(option) => option?.name || ""}
              isOptionEqualToValue={(option, value) => option?.term_id === value?.term_id}
              renderInput={(params) => (
                <TextField
                  {...params}
                  inputProps={{
                    ...params.inputProps,
                    autoComplete: "category",
                  }}
                  label="Select Quiz Category"
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <React.Fragment>
                        {createCategoryMutation?.isPending ? (
                          <CircularProgress color="inherit" size={20} />
                        ) : null}
                        {params.InputProps.endAdornment}
                      </React.Fragment>
                    ),
                  }}
                  onChange={(e) => setInput(e.target.value)}
                />
              )}
              onChange={(_, newValue) => {
                methods?.setValue("category_id", newValue?.term_id ?? null, {
                  shouldDirty: true,
                });
              }}
              PaperComponent={(data) => {
                return (
                  <Paper>
                    {data?.children}
                    <Button
                      color="primary"
                      fullWidth
                      sx={{ justifyContent: "flex-start", pl: 2 }}
                      onMouseDown={createCategory}
                    >
                      + Add New
                    </Button>
                  </Paper>
                );
              }}
            />
            {Boolean(methods?.formState?.errors?.category_id) && (
              <Typography component="p" color="error">
                {methods?.formState?.errors?.category_id?.message}
              </Typography>
            )}
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button variant="contained" color="error" onClick={props?.handleClose}>
          Cancel
        </Button>
        <Button
          variant="contained"
          type="submit"
          onClick={methods?.handleSubmit(handleSubmit)}
          disabled={setCategory?.isPending}
        >
          {setCategory?.isPending ? "...loading" : "Save Change"}
        </Button>
      </DialogActions>
    </>
  );
};

export default CategoryModel;
