import { Alert, Box, Button, Chip, IconButton, Link, List, ListItem, Typography } from '@mui/material';
import React, { useEffect, useRef } from 'react'
import { __, sprintf } from '@wordpress/i18n';
import { getCurrentDateString, getStripHtml } from '@acadlix/helpers/util';
import CustomLatex from '@acadlix/modules/latex/CustomLatex';
import { RawHTML } from "@wordpress/element";
import { PostDeleteAssessmentFile, PostUploadAssessmentFile } from '@acadlix/requests/front/FrontQuizRequest';
import { FaTrash } from '@acadlix/helpers/icons';

const TypeAssessment = (props) => {
  const getTextLength = () => {
    const answer = props?.watch(`questions.${props?.index}.language.${props?.lang_index}.answer_data.${props?.type}.yourAnswer`) || "";
    return getStripHtml(answer)?.trim().length;
  }

  const getCharacterLimit = () => {
    const limit = props?.watch(
      `questions.${props?.index}.language.${props?.lang_index}.answer_data.${props?.type}.characterLimit`
    );
    return Number(limit) > 0 ? Number(limit) : 0; // 0 = infinite
  }

  const loadEditor = (key, name = "") => {
    window.wp.editor.initialize(key, {
      tinymce: {
        wpautop: true,
        toolbar1:
          "bold,italic,bullist,numlist,alignleft,aligncenter,alignright",
        textarea_rows: 20,
        setup: function (editor) {
          editor.on("input change", function (e) {
            handleChange(
              editor.getContent(),
            );
          });
        },
      },
      quicktags: false,
      mediaButtons: false,
    });
  };

  const removeEditor = (key) => {
    window.wp.editor.remove(key);
  };

  const updateResult = () => {
    let solved = false;
    if(props?.watch(`questions.${props?.index}.language.${props?.lang_index}.answer_data.${props?.type}.yourAnswer`)?.trim()?.length > 0) {
      solved = true;
    }
    if(props?.watch(`questions.${props?.index}.language.${props?.lang_index}.answer_data.${props?.type}.allowUploads`) && props?.watch(`questions.${props?.index}.language.${props?.lang_index}.answer_data.${props?.type}.yourUploads`)?.length > 0) {
      solved = true;
    }
    props?.setValue(
      `questions.${props?.index}.result`,
      {
        ...props?.watch(`questions.${props?.index}.result`),
        solved_count: solved ? 1 : 0,
        answer_data: props?.watch(`questions.${props?.index}.language.${props?.lang_index}.answer_data.${props?.type}`) ?? null,
        attempted_at: getCurrentDateString(),
      },
    );
  }

  const handleChange = (content) => {
    let value = content;
    props?.setValue(
      `questions.${props?.index}.language.${props?.lang_index}.answer_data.${props?.type}.yourAnswer`,
      value ?? "",
      { shouldDirty: true }
    );

    updateResult(value?.trim()?.length > 0);
  };

  const loadPage = () => {
    loadEditor(
      `your_answer_${props?.index}`,
      `questions.${props?.index}.language.${props?.lang_index}.answer_data.${props?.type}.yourAnswer`
    );
  };

  useEffect(() => {
    loadPage();
    window.addEventListener("load", loadPage);

    return () => {
      removeEditor(`your_answer_${props?.index}`);
      window.removeEventListener("load", loadPage);
    };
  }, []);

  const fileInputRef = useRef(null);
  const [fileError, setFileError] = React.useState(null);
  const validateFiles = (files) => {
    const maxFiles = props?.watch(`questions.${props?.index}.language.${props?.lang_index}.answer_data.${props?.type}.number_of_uploads`)
    const maxFileSize = props?.watch(`questions.${props?.index}.language.${props?.lang_index}.answer_data.${props?.type}.max_file_size`) * 1024 * 1024;
    const allowedExtensions = props?.watch(`questions.${props?.index}.language.${props?.lang_index}.answer_data.${props?.type}.allowed_mime_types`)?.map((a) => a?.extension);
    const filesArray = Array.from(files);

    setFileError(null);

    if (maxFiles > 0 && (filesArray?.length + props?.watch(`questions.${props?.index}.language.${props?.lang_index}.answer_data.${props?.type}.yourUploads`)?.length) > maxFiles) {
      setFileError(sprintf(
        // translators: %s is the number of files allowed
        __("You can only upload %s files.", "acadlix"),
        maxFiles
      ));
      return false;
    }

    for (const file of filesArray) {
      const ext = file?.name?.split('.')?.pop()?.toLowerCase();
      if (!allowedExtensions.includes(ext)) {
        setFileError(sprintf(
          // translators: %s is the file name
          __("%s has invalid extension.", "acadlix"),
          file.name
        ));
        return false;
      }

      if (file?.size > maxFileSize && maxFileSize > 0) {
        setFileError(sprintf(
          // translators: %1$s is the file name, %2$s is the file size
          __("%1$s exceeds the %2$sMB limit.", "acadlix"),
          file.name,
          props?.watch(`questions.${props?.index}.language.${props?.lang_index}.answer_data.${props?.type}.max_file_size`)
        ));
        return false;
      }
    }
    console.log("Valid files: ", filesArray);
    return filesArray;
  }

  const uploadAssessmentFileMutation = PostUploadAssessmentFile(props?.watch('id'));
  const hanldeFileChange = (e) => {
    const selectedFiles = e.target.files;
    const valid = validateFiles(selectedFiles);
    if (!valid) {
      return;
    }
    const formData = new FormData();
    for (const file of valid) {
      formData.append("files[]", file);
    }
    uploadAssessmentFileMutation?.mutate(formData, {
      onSuccess: (data) => {
        if (data?.data?.success && data?.data?.answer_attachments) {
          props?.setValue(
            `questions.${props?.index}.language.${props?.lang_index}.answer_data.${props?.type}.yourUploads`,
            [
              ...props?.watch(`questions.${props?.index}.language.${props?.lang_index}.answer_data.${props?.type}.yourUploads`) || [],
              ...data?.data?.answer_attachments,
            ],
            {
              shouldDirty: true,
            }
          );
          updateResult();
        }
        // Reset file input value
        if (fileInputRef?.current) {
          fileInputRef.current.value = '';
        }
      },
      onError: (error) => {
        setFileError(error?.response?.data?.message);
      }
    });

  }

  const [deleteIndex, setDeleteIndex] = React.useState(null);
  const deleteAssessmentFileMutation = PostDeleteAssessmentFile(props?.watch('id'));
  const handleRemoveFile = (index) => {
    if (!confirm(__("Are you sure you want to delete this file?", "acadlix"))) {
      return;
    }
    setFileError(null);
    const delete_file_data = props?.watch(`questions.${props?.index}.language.${props?.lang_index}.answer_data.${props?.type}.yourUploads`)?.[index];
    if (!delete_file_data) {
      return;
    }
    setDeleteIndex(index);
    const answerAttachments = props?.watch(`questions.${props?.index}.language.${props?.lang_index}.answer_data.${props?.type}.yourUploads`)?.filter((_, i) => i !== index);
    deleteAssessmentFileMutation?.mutate({
      delete_file_data: delete_file_data,
      answer_attachments: answerAttachments,
    }, {
      onSuccess: (data) => {
        if (data?.data?.success && data?.data?.answer_attachments) {
          props?.setValue(
            `questions.${props?.index}.language.${props?.lang_index}.answer_data.${props?.type}.yourUploads`,
            data?.data?.answer_attachments,
            {
              shouldDirty: true,
            }
          );
          setDeleteIndex(null);
        }
        updateResult();
      },
      onError: (error) => {
        setFileError(error?.response?.data?.message);
        setDeleteIndex(null);
      }
    });
  }

  return (
    <Box
      sx={{
        width: "auto",
        // backgroundColor:
        //   props?.watch(`questions.${props?.index}.check`)
        //     ? props?.watch(`questions.${props?.index}.result.correct_count`)
        //       ? (theme) => theme.palette.success.light
        //       : (theme) => theme.palette.error.light
        //     : "",
        border:
          props?.watch("mode") !== "advance_mode" || props?.watch("view_answer") || props?.watch(`questions.${props?.index}.check`)
            ? (theme) => `1px solid ${theme.palette.grey[300]}`
            : "none",
        borderRadius: 1,
        padding: props?.watch("mode") !== "advance_mode" || props?.watch("view_answer") ? "5px" : 2,
        marginY: props?.watch("mode") !== "advance_mode" || props?.watch("view_answer") ? "5px" : 0,
        overflow: "auto",
      }}
    >
      {(props?.watch("view_answer") ||
        props?.watch(`questions.${props?.index}.check`)) && (
          <Typography component="div">
            <b>{__("Your answer", "acadlix")}</b>
          </Typography>
        )}
      <Box
        sx={{
          display: "flex",
        }}
      >
        {
          props?.watch("view_answer") ||
            props?.watch(`questions.${props?.index}.check`) ? (
            <Box sx={{
              width: "100%",
              display: "flex",
              flexDirection: "column",
              gap: 2,
            }}>
              {
                props?.watch(`questions.${props?.index}.language.${props?.lang_index}.answer_data.${props?.type}.yourUploads`)?.length > 0 && (
                  <Box>
                    <List>
                      <ListItem sx={{
                        padding: 1
                      }}>
                        <Typography variant="h6" component="div">
                          {__("Uploads", "acadlix")}
                        </Typography>
                      </ListItem>
                      {
                        props?.watch(`questions.${props?.index}.language.${props?.lang_index}.answer_data.${props?.type}.yourUploads`)?.map((f, i) => (
                          <ListItem key={i} sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                            padding: 1,
                          }}>
                            <Typography variant="body2" component="div">
                              <Link
                                href={f?.file_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                sx={{
                                  textDecoration: "none",
                                }}
                              >
                                {f?.file_name}
                              </Link>
                            </Typography>
                          </ListItem>
                        ))
                      }
                    </List>
                  </Box>
                )
              }
              <CustomLatex>
                {props?.watch(`questions.${props?.index}.language.${props?.lang_index}.answer_data.${props?.type}.yourAnswer`) || ""}
              </CustomLatex>
            </Box>
          ) : (
            <Box sx={{
              width: "100%",
              display: "flex",
              flexDirection: "column",
              gap: 2,
            }}>
              {
                fileError && (
                  <Alert severity="error">
                    {fileError}
                  </Alert>
                )
              }
              {
                props?.watch(`questions.${props?.index}.language.${props?.lang_index}.answer_data.${props?.type}.yourUploads`)?.length > 0 && (
                  <Box>
                    <List>
                      <ListItem sx={{
                        padding: 1
                      }}>
                        <Typography variant="h6" component="div">
                          {__("Uploads", "acadlix")}
                        </Typography>
                      </ListItem>
                      {
                        props?.watch(`questions.${props?.index}.language.${props?.lang_index}.answer_data.${props?.type}.yourUploads`)?.map((f, i) => (
                          <ListItem key={i} sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                            padding: 1,
                          }}>
                            <Typography variant="body2" component="div">
                              <Link
                                href={f?.file_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                sx={{
                                  textDecoration: "none",
                                }}
                              >
                                {f?.file_name}
                              </Link>
                            </Typography>
                            <IconButton
                              className="acadlix-icon-btn"
                              color="error"
                              aria-label="delete"
                              size="small"
                              onClick={() => handleRemoveFile(i)}
                              loading={deleteAssessmentFileMutation?.isPending && i === deleteIndex}
                            >
                              <FaTrash />
                            </IconButton>
                          </ListItem>
                        ))
                      }
                    </List>
                  </Box>
                )
              }
              {
                props?.watch(`questions.${props?.index}.language.${props?.lang_index}.answer_data.${props?.type}.allowUploads`) && (
                  <Box sx={{
                    padding: {
                      xs: 2,
                      sm: 6,
                      md: 6,
                      lg: 6,
                      xl: 6,
                    },
                    backgroundColor: "lightgrey",
                    borderRadius: 2,
                    display: "flex",
                    flexDirection: "column",
                    gap: 2,
                  }}>
                    {
                      props?.watch(`questions.${props?.index}.language.${props?.lang_index}.answer_data.${props?.type}.number_of_uploads`) > 0 && (
                        <Typography variant="body1" component="div">
                          <RawHTML>
                            {sprintf(
                              /* translators: %s is the number of max attachments */
                              __('Attach assessment files (Max. <strong>%s</strong> files)', "acadlix"),
                              props?.watch(`questions.${props?.index}.language.${props?.lang_index}.answer_data.${props?.type}.number_of_uploads`)
                            )}
                          </RawHTML>
                        </Typography>
                      )}
                    <input
                      type="file"
                      multiple={props?.watch(`questions.${props?.index}.language.${props?.lang_index}.answer_data.${props?.type}.number_of_uploads`) === 0 || props?.watch(`questions.${props?.index}.language.${props?.lang_index}.answer_data.${props?.type}.number_of_uploads`) > 1}
                      onChange={hanldeFileChange}
                      ref={fileInputRef}
                      style={{ display: "none" }}
                      accept={props?.watch(`questions.${props?.index}.language.${props?.lang_index}.answer_data.${props?.type}.allowed_mime_types`)?.map((t) => `.${t?.extension}`).join(",")}
                    />
                    <Button
                      className="acadlix-btn"
                      variant="contained"
                      onClick={() => fileInputRef?.current?.click()}
                      sx={{
                        width: "max-content",
                      }}
                      loading={uploadAssessmentFileMutation?.isPending}
                    >
                      {__('Upload File(s)', "acadlix")}
                    </Button>
                    {
                      props?.watch(`questions.${props?.index}.language.${props?.lang_index}.answer_data.${props?.type}.allowed_mime_types`)?.length > 0 && (
                        <Typography variant="body2" component="div">
                          <RawHTML>
                            {sprintf(
                              /* translators: %s is the number of max attachments */
                              __('Only <strong>%s</strong> files are allowed', "acadlix"),
                              props?.watch(`questions.${props?.index}.language.${props?.lang_index}.answer_data.${props?.type}.allowed_mime_types`)?.map((t) => `.${t?.extension}`).join(", ")
                            )}
                          </RawHTML>
                        </Typography>
                      )}
                    {
                      props?.watch(`questions.${props?.index}.language.${props?.lang_index}.answer_data.${props?.type}.max_file_size`) > 0 && (
                        <Typography variant="body2" component="div">
                          <RawHTML>
                            {sprintf(
                              /* translators: %s is the number of max attachments */
                              __('Total size of files should not exceed <strong>%s MB</strong>', "acadlix"),
                              `${props?.watch(`questions.${props?.index}.language.${props?.lang_index}.answer_data.${props?.type}.max_file_size`)}`
                            )}
                          </RawHTML>
                        </Typography>
                      )}
                  </Box>
                )}
              <textarea
                {
                ...props?.register(
                  `questions.${props?.index}.language.${props?.lang_index}.answer_data.${props?.type}.yourAnswer`
                )
                }
                id={`your_answer_${props?.index}`}
                style={{
                  width: "100%",
                }}
                rows={6}
              />
              {
                getCharacterLimit() > 0 && (
                  <Box sx={{
                    textAlign: "end",
                  }}>
                    <Chip
                      label={`${__("Character Count", "acadlix")}: ${getTextLength()} / ${getCharacterLimit()}`}
                      size="small"
                      color={getTextLength() > getCharacterLimit() ? "error" : "default"}
                    />
                  </Box>
                )
              }
            </Box>
          )
        }
      </Box>
      {
        Boolean(props?.watch(`questions.${props?.index}.result.is_evaluated`)) &&
        props?.watch(`questions.${props?.index}.result.evaluation_remark`) &&
        (
          <>
            <Typography component="div">
              <b>{__("Evaluation remarks", "acadlix")}</b>
            </Typography>
            <Box>
              <CustomLatex>
                {props?.watch(`questions.${props?.index}.result.evaluation_remark`) || ""}
              </CustomLatex>
            </Box>
          </>
        )
      }
    </Box>
  )
}

export default TypeAssessment