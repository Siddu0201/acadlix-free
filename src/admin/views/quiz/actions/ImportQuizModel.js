import { IoClose } from '@acadlix/helpers/icons';
import { Avatar, Box, Button, DialogActions, DialogContent, DialogTitle, Grid, IconButton, TextField, Typography } from '@mui/material';
import React from 'react'
import { useForm } from 'react-hook-form';
import { __ } from '@wordpress/i18n';
import toast from 'react-hot-toast';
import { PostImportQuiz } from '@acadlix/requests/admin/AdminQuizRequest';

const ImportQuizModel = (props) => {
  const methods = useForm({
    defaultValues: {
      quizzes: [],
    }
  });

  if (process?.env?.REACT_APP_MODE === 'development') {
    console.log(methods.watch("quizzes"));
  }


  const [fileName, setFileName] = React.useState("");

  const handleFile = (file) => {
    const fileExtension = file?.name.split(".").pop().toLowerCase();
    if (["json"]?.includes(fileExtension)) {
      setFileName(file.name);
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const jsonData = JSON.parse(event.target.result);
          console.log(jsonData);
          methods?.setValue("quizzes", jsonData, {
            shouldDirty: true,
          });
        } catch (error) {
          console.error(error);
          toast.error("Invalid JSON file.");
        }
      };
      reader.readAsText(file);
    } else {
      setFileName("");
      toast.error("Only .json files are allowed.");
    }
  };

  const handleFileChange = (event) => {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      handleFile(file);
    }
  }
  const handleDragOver = (event) => {
    event.preventDefault();
  }
  const handleDrop = (event) => {
    event.preventDefault();
    if (event.dataTransfer.files.length > 0) {
      const file = event.dataTransfer.files[0];
      handleFile(file);
    }
  }

  const importMutation = PostImportQuiz();
  const handleSubmit = (data) => {
    if (!fileName) {
      toast?.error("Please upload file.");
      return;
    }

    if (methods?.watch("quizzes")?.length === 0) {
      toast?.error("No quiz is available please check your document.");
      return;
    }
    importMutation.mutate(data, {
      onSuccess: (response) => {
        toast.success(response?.data?.message);
        window?.location?.reload();
      },
      onError: (error) => {
        toast.error(error?.response?.data?.message);
      }
    });
  };

  return (
    <>
      <DialogTitle id="alert-dialog-import-quiz" sx={{ m: 0, p: 2 }}>
        {__("Import Quiz (JSON)", "acadlix")}
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
          <Grid size={{ xs: 12, lg: 12 }}>
            <Box
              sx={{
                width: "100%",
                height: "90%",
                border: "2px dotted blue",
                backgroundColor: "#eaebff",
                paddingY: 2,
                marginY: 4,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 2,
              }}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
            >
              <Avatar
                src={`${acadlixOptions?.image_url}/file-upload-site-3.jpg`}
                sx={{ height: "150px", width: "150px" }}
              />
              <TextField
                inputProps={{
                  accept: ".json",
                }}
                id="file-upload"
                type="file"
                style={{ display: "none" }}
                onChange={handleFileChange}
              />
              <label htmlFor="file-upload">
                <Button variant="contained" color="primary" component="span">
                  {__("Select File", "acadlix")}
                </Button>
              </label>
              {!fileName && (
                <Typography
                  variant="body1"
                  sx={{ margin: "10px 0px 10px 0px" }}
                >
                  {__("Please select a file to be uploaded (Accepted file format: .json)", "acadlix")}
                </Typography>
              )}
              {fileName && (
                <>
                  <Typography
                    variant="body1"
                    sx={{ marginTop: 2 }}
                  >
                    {__("Selected file", "acadlix")}: <b>{fileName}</b>
                  </Typography>
                </>
              )}
            </Box>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button variant="contained" color="error" onClick={props?.handleClose}>
          {__("Cancel", "acadlix")}
        </Button>
        <Button
          variant="contained"
          type="submit"
          onClick={methods?.handleSubmit(handleSubmit)}
          loading={importMutation?.isPending}
        >
          {__("Save Changes", "acadlix")}
        </Button>
      </DialogActions>
    </>
  )
}

export default ImportQuizModel