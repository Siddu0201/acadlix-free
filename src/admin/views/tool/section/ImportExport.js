import CustomFeatureTooltip from '@acadlix/components/CustomFeatureTooltip';
import { Avatar, Box, Button, Card, CardContent, Divider, Grid, Link, TextField, Typography } from '@mui/material';
import React from 'react'
import { useForm } from 'react-hook-form'
import { __ } from '@wordpress/i18n';
import toast from 'react-hot-toast';
import { useExcelImport } from '@acadlix/hooks/useExcelImport';
import { PostImportUsers } from '@acadlix/requests/admin/AdminToolRequest';

const ImportExport = () => {
  const methods = useForm({
    defaultValues: window?.acadlixHooks?.applyFilters(
      'acadlix.admin.tool.import_export.default_values',
      {
        users: [],
      }
    ) || {}
  });

  const [fileName, setFileName] = React.useState("");

  const excelImport = useExcelImport();
  const handleFile = async (file) => {
    const fileExtension = file?.name.split(".").pop().toLowerCase();
    if (["csv", "xlsx"]?.includes(fileExtension)) {
      setFileName(file.name);
      try {
        const columns = [
          { header: "user_login", key: "user_login" },
          { header: "user_pass", key: "user_pass" },
          { header: "user_email", key: "user_email" },
          { header: "first_name", key: "first_name" },
          { header: "last_name", key: "last_name" },
          { header: "country_code", key: "country_code" },
          { header: "phone", key: "phone" },
          { header: "address", key: "address" },
          { header: "postcode", key: "postcode" },
          { header: "city", key: "city" },
          { header: "state", key: "state" },
          { header: "country", key: "country" },
        ];
        let userData = await excelImport(file, { columns });
        userData = userData.map(user => {
          let country_code = user?.country_code?.trim() || "";
          let isocode = "";
          if(country_code.includes("/")) {
            let parts = country_code.split("/");
            country_code = parts[0];
            isocode = parts[1] || "";
          }
          return {
            ...user,
            country_code,
            isocode,
          }
        });
        // console.log("Parsed User Data:", userData);
        methods?.setValue("users", userData, {
          shouldDirty: true,
        });
      } catch (error) {
        console.error(error);
        toast.error("Invalid file.");
      }
    } else {
      setFileName("");
      toast.error("Only .csv and .xlsx files are allowed.");
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
  };

  const userImportMutation = PostImportUsers();
  const handleImportUsers = () => {
    const users = methods?.watch("users") || [];
    if (users.length === 0) {
      toast?.error("Please upload file.");
      return;
    }

    userImportMutation.mutate({users: users}, {
      onSuccess: (response) => {
        toast?.success(response?.data?.data?.message || "Users imported successfully.");
        methods?.reset();
        setFileName("");
        window.location.reload();
      }
    });
  }

  return (
    <Card>
      <CardContent>
        <Box>
          {/* Student import */}
          <Box
            sx={{
              marginY: 2,
            }}
          >
            <Typography variant="h4">{__("Student Import(CSV/Excel)", "acadlix")}
              <CustomFeatureTooltip
                plan={"open"}
                msg={__("Import students from a CSV/Excel file.", "acadlix")}
              />
            </Typography>
            <Divider />
          </Box>
          <Grid
            container
            spacing={2}
            sx={{
              alignItems: "center",
            }}
          >
            <Grid size={{ xs: 12, sm: 12, lg: 12 }}>
              <Box sx={{
                display: "flex",
                gap: 2
              }}>
                <Typography variant="body1">
                  {__('Download sample files:', 'acadlix')}
                </Typography>
                <Box sx={{ display: "flex", gap: 2 }}>
                  <Link
                    sx={{ width: "fit-content" }}
                    component="a"
                    href={acadlixOptions?.sample_url + '/excel/sample_user_file.xlsx'}
                    download
                  >
                    {__('Student Import Format', 'acadlix')}
                  </Link>
                </Box>
              </Box>
              <Box
                sx={{
                  width: "100%",
                  border: "2px dotted blue",
                  backgroundColor: "#eaebff",
                  paddingY: 2,
                  marginY: 2,
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
                    accept: ".csv, .xlsx",
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
                    {__("Please select a file to be uploaded (Accepted file formats: .csv, .xlsx)", "acadlix")}
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
            <Grid size={{ xs: 12, sm: 12, lg: 12 }}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleImportUsers}
                loading={userImportMutation.isPending}
              >
                {__("Import Student", "acadlix")}
              </Button>
            </Grid>
          </Grid>
        </Box>
      </CardContent>
    </Card>
  )
}

export default ImportExport