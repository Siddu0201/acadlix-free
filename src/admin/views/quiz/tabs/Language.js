import {
  Box,
  Button,
  Card,
  CardHeader,
  Divider,
  FormControlLabel,
  Grid,
  List,
  ListItem,
  ListItemText,
  Typography,
} from "@mui/material";
import React from "react";
import GridItem1 from "../../../../components/GridItem1";
import CustomSwitch from "../../../../components/CustomSwitch";
import { FaMinus } from "react-icons/fa";
import { MdAdd } from "react-icons/md";

const Language = (props) => {
  const [language, setLanguage] = React.useState([
    ...props?.languages?.map((val) => {
      return {
        language_id: val?.id,
        language_name: val?.language_name,
        show: props
          ?.watch("language_data")
          ?.find((value) => value?.language_id === val?.id)
          ? false
          : true,
      };
    }),
  ]);

  return (
    <Box sx={{ color: "black" }}>
      <Grid container>
        <GridItem1 xs={12} lg={12}>
          <Typography variant="h6">Language Options</Typography>
        </GridItem1>
        <GridItem1 xs={12} lg={12}>
          <FormControlLabel
            control={
              <CustomSwitch
                checked={props.watch("multi_language")}
                onChange={(e) => {
                  props?.setValue("multi_language", e?.target?.checked, {
                    shouldDirty: true,
                  });
                }}
              />
            }
            label="Multi Language"
          />
        </GridItem1>

        <GridItem1
          xs={12}
          lg={12}
          sx={{
            display: {
              xs: props?.watch("multi_language") ? "block" : "none",
              sm: props?.watch("multi_language") ? "flex" : "none",
            },
          }}
        >
          <Card
            sx={{
              marginX: 2,
              marginBottom: {
                xs: 2,
                md: 0,
              },
              width: "350px",
            }}
          >
            <CardHeader
              title="Language"
              subheader={`${
                language?.filter((val) => val?.show === true)?.length
              } languages.`}
            />
            <Divider />
            <List
              dense
              component="div"
              role="list"
              sx={{
                width: 350,
                height: 280,
                overflow: "auto",
              }}
            >
              {language?.length > 0 &&
                language?.map((value, _) => {
                  const labelId = `transfer-list-all-item-${value?.language_name}-label`;
                  return (
                    <ListItem
                      key={value?.id}
                      sx={{
                        display: value?.show ? "" : "none",
                      }}
                    >
                      <ListItemText
                        id={labelId}
                        primary={
                          value?.language_name?.length > 20
                            ? value?.language_name?.substring(0, 20) + "..."
                            : value?.language_name
                        }
                      />
                      <Button
                        variant="contained"
                        endIcon={<MdAdd />}
                        size="medium"
                        sx={{
                          ".MuiButton-endIcon": {
                            margin: 0,
                          },
                        }}
                        onClick={(e) => {
                          setLanguage(
                            language?.map((val) => {
                              if (val?.language_id === value?.language_id) {
                                val["show"] = false;
                              }
                              return val;
                            })
                          );
                          props?.setValue(
                            "language_data",
                            [
                              ...props?.watch("language_data"),
                              {
                                language_id: value?.language_id,
                                language_name: value?.language_name,
                                default: false,
                                instruction1: "",
                                instruction2: "",
                                term_and_condition_text: "",
                                term_and_condition_warning_text: "",
                              },
                            ],
                            { shouldDirty: true }
                          );
                        }}
                      ></Button>
                    </ListItem>
                  );
                })}
            </List>
          </Card>

          {/* Added Language  */}
          <Card
            sx={{
              marginX: 2,
              width: "350px",
            }}
          >
            <CardHeader
              title="Added Language"
              subheader={`${props?.watch("language_data")?.length} languages.`}
            />
            <Divider />
            <List
              dense
              component="div"
              role="list"
              sx={{
                width: 350,
                height: 230,
                overflow: "auto",
              }}
            >
              {props?.watch("language_data")?.length > 0 &&
                props?.watch("language_data")?.map((value, index) => {
                  const labelId = `transfer-list-all-item-${value?.language_name}-label`;
                  return (
                    <ListItem key={value?.language_id}>
                      <ListItemText
                        id={labelId}
                        primary={`${
                          value?.language_name?.length > 20
                            ? value?.language_name?.substring(0, 20) + "..."
                            : value?.language_name
                        } ${value?.default ? "(Default)" : ""}`}
                      />

                      <Button
                        variant="contained"
                        size="medium"
                        sx={{
                          ".MuiButton-endIcon": {
                            margin: 0,
                          },
                          marginRight: 1,
                          display: value?.default ? "none" : "",
                        }}
                        onClick={(e) => {
                          props?.setValue(
                            "language_data",
                            props?.watch("language_data")?.map((lang) => {
                              if (lang?.language_id === value?.language_id) {
                                lang["default"] = true;
                              } else {
                                lang["default"] = false;
                              }
                              return lang;
                            }),
                            { shouldDirty: true }
                          );
                        }}
                      >
                        Def.
                      </Button>
                      <Button
                        variant="contained"
                        color="error"
                        endIcon={<FaMinus />}
                        size="large"
                        sx={{
                          ".MuiButton-endIcon": {
                            margin: 0,
                          },
                          display: value?.default ? "none" : "",
                        }}
                        disabled={
                          props?.quiz?.questions_count > 0 &&
                          props?.quiz?.quiz_languages?.findIndex(
                            (lang) => lang?.language_id === value?.language_id
                          ) !== -1
                        }
                        onClick={(e) => {
                          setLanguage(
                            language?.map((val) => {
                              if (val?.language_id === value?.language_id) {
                                val["show"] = true;
                              }
                              return val;
                            })
                          );
                          props?.setValue(
                            "language_data",
                            props
                              ?.watch("language_data")
                              ?.filter(
                                (val) => val?.language_id !== value?.language_id
                              ),
                            { shouldDirty: true }
                          );
                        }}
                      ></Button>
                    </ListItem>
                  );
                })}
            </List>
          </Card>
        </GridItem1>
      </Grid>
    </Box>
  );
};

export default Language;
