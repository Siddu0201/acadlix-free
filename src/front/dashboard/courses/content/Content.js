import { 
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  IconButton,
  Link,
  List,
  ListItem,
  Tooltip,
  Typography } from "@mui/material";
import Grid from "@mui/material/Grid2";
import React, { useEffect, useRef } from "react";
import { 
  FaAngleLeft,
  FaAngleRight,
  FaDownload,
  FaTrash } from "../../../../helpers/icons";
import AppFront from "../../../AppFront";
import VideoPlayer from "../../../../modules/video-player/VideoPlayer";
import { 
  PostDeleteAssignmentFile,
  PostSubmitAssignment,
  PostUpdateLessonTime,
  PostUploadAssignmentFile } from "../../../../requests/front/FrontDashboardRequest";
import { 
  getCurrentDateString,
  getDbFormatDate,
  getFormatDate,
  getVimeoVideoId,
  getYouTubeVideoId,
  strtotime } from "../../../../helpers/util";
import CustomLatex from "../../../../modules/latex/CustomLatex";
import { __, sprintf } from "@wordpress/i18n";
import { RawHTML } from "@wordpress/element";
import toast from "react-hot-toast";
import { getSettings } from "@wordpress/date";

const Content = (props) => {
  const loadEditor = (key, name = "", media = false, quicktags = false) => {
    window.wp.editor.initialize(key, {
      tinymce: {
        wpautop: true,
        plugins:
          "charmap colorpicker hr lists paste tabfocus textcolor fullscreen wordpress wpautoresize wpeditimage wpemoji wpgallery wplink wptextpattern wpview",
        toolbar1:
          "formatselect,bold,italic,bullist,numlist,blockquote,alignleft,aligncenter,alignright,link,wp_more,spellchecker,wp_adv,listbuttons",
        toolbar2:
          "styleselect,strikethrough,hr,forecolor,pastetext,removeformat,charmap,outdent,indent,undo,redo,wp_help",
        textarea_rows: 80,
        setup: function (editor) {
          editor.on("input change", function () {
            props?.setValue(name, window.wp.editor.getContent(key), {
              shouldDirty: true,
            });
          });
        },
      },
      quicktags: quicktags,
      mediaButtons: media,
    });
  };

  const removeEditor = (key) => {
    window.wp.editor.remove(key);
  };

  useEffect(() => {
    const targetElement = document.getElementById(
      `acadlix_course_listitem_${props?.courseSectionContentId}`
    );
    if (targetElement) {
      targetElement.scrollIntoView({
        behavior: "smooth", // Smooth scroll animation
        block: "start", // Align the element in the center of the viewport
      });
    }
  }, []);

  return (
    <>
      {props?.watch("sections")?.length > 0 &&
        props?.watch("sections")?.map((element, index, arr) =>
          element?.content?.map((c, c_index, c_arr) => (
            <React.Fragment key={c_index}>
              <Box
                sx={{
                  display: props?.active_content?.i - 1 === c?.i ? "" : "none",
                  position: "absolute",
                  top: "50%",
                  left: 0,
                  zIndex: 10,
                }}
              >
                <Tooltip title={c?.title} placement="right" arrow>
                  <IconButton
                    onClick={props?.handleNavigate.bind(this, c?.id)}
                    sx={{
                      borderRadius: 0,
                      paddingX: 1,
                      paddingY: 3,
                      color: "white",
                      backgroundColor: "black",
                      opacity: "0.2",
                      ":hover, :focus": {
                        color: "white",
                        backgroundColor: "black",
                        opacity: "1",
                      },
                    }}
                  >
                    <FaAngleLeft />
                  </IconButton>
                </Tooltip>
              </Box>
              <Box
                sx={{
                  display: props?.active_content?.i + 1 === c?.i ? "" : "none",
                  position: "absolute",
                  top: "50%",
                  right: 0,
                  zIndex: 10,
                }}
              >
                <Tooltip title={c?.title} placement="left" arrow>
                  <IconButton
                    onClick={props?.handleNavigate.bind(this, c?.id)}
                    sx={{
                      borderRadius: 0,
                      paddingX: 1,
                      paddingY: 3,
                      color: "white",
                      backgroundColor: "black",
                      opacity: "0.2",
                      opacity: "0.2",
                      ":hover, :focus": {
                        color: "white",
                        backgroundColor: "black",
                        opacity: "1",
                      },
                    }}
                  >
                    <FaAngleRight />
                  </IconButton>
                </Tooltip>
              </Box>
            </React.Fragment>
          ))
        )}
      <Box>
        {props?.watch("sections")?.length > 0 &&
          props
            ?.watch("sections")
            ?.map((s, index, s_arr) =>
              s?.content?.map((c, c_index, c_arr) => (
                <React.Fragment key={c?.id}>
                  {c?.id === props?.active_content?.id && (
                    <>
                      {c?.type === "lesson" ? (
                        c?.lesson_type === "video" ? (
                          <LessonVideoContent
                            {...props}
                            c={c}
                            c_index={c_index}
                            s={s}
                            index={index}
                            first={index === 0 && c_index === 0}
                            last={
                              index === s_arr?.length - 1 &&
                              c_index === c_arr?.length - 1
                            }
                          />
                        ) : (
                          <LessonTextContent
                            {...props}
                            c={c}
                            c_index={c_index}
                            s={s}
                            index={index}
                          />
                        )
                      ) : c?.type === "quiz" ? (
                        <QuizContent
                          {...props}
                          c={c}
                          c_index={c_index}
                          s={s}
                          index={index}
                        />
                      ) : c?.type === "assignment" ? (
                        <AssignmentContent
                          {...props}
                          c={c}
                          c_index={c_index}
                          s={s}
                          index={index}
                          loadEditor={loadEditor}
                          removeEditor={removeEditor}
                          current_meta_value={c?.assignment_meta_value?.submissions?.find((a) => a?.attempt === c?.assignment_meta_value?.current_attempt)}
                          current_meta_index={c?.assignment_meta_value?.submissions?.findIndex((a) => a?.attempt === c?.assignment_meta_value?.current_attempt)}
                        />
                      ) : (
                        <></>
                      )}
                    </>
                  )}
                </React.Fragment>
              ))
            )}
      </Box>
    </>
  );
};

export default Content;

const LessonVideoContent = (props) => {
  let src = "";
  const content = props?.watch(
    `sections.${props?.index}.content.${props?.c_index}`
  );


  switch (props?.c?.video?.video_type) {
    case "html_5":
      src = props?.c?.video?.video_data?.html_5;
      break;
    case "youtube":
      src =
        props?.c?.video?.video_data?.youtube !== ""
          ? `https://www.youtube.com/embed/${getYouTubeVideoId(
            props?.c?.video?.video_data?.youtube
          )}`
          : "";
      break;
    case "vimeo":
      src =
        props?.c?.video?.video_data?.vimeo !== ""
          ? `https://player.vimeo.com/video/${getVimeoVideoId(
            props?.c?.video?.video_data?.vimeo
          )}`
          : "";
      break;
    case "external_link":
      src = props?.c?.video?.video_data?.external_link;
      break;
    case "embedded":
      src = props?.c?.video?.video_data?.embedded;
      break;
    case "shortcode":
      if (props?.c?.video?.video_data?.shortcode !== "") {
        const parseShortcode = window?.wp?.shortcode?.next(
          "video",
          props?.c?.video?.video_data?.shortcode
        );
        let attribute = {};
        if (parseShortcode) {
          const { attrs } = parseShortcode?.shortcode;
          attribute = attrs?.named;
        }
        src = attribute?.mp4;
      } else {
        src = "";
      }
      break;
    default:
      src = "";
  }

  const updateTimeMutation = PostUpdateLessonTime();
  const updateDuration = ({ hours, minutes, seconds }) => {
    updateTimeMutation?.mutate({
      lesson_id: props?.c?.content_type_id,
      hours: hours,
      minutes: minutes,
      seconds: seconds
    }, {
      onSuccess: (data) => {
        if (data?.data?.success && data?.data?.lesson) {
          props?.setValue(
            `sections.${props?.index}.content.${props?.c_index}.hours`,
            String(data?.data?.lesson?.rendered_metas?.hours).padStart(2, '0'),
            { shouldDirty: true }
          );
          props?.setValue(
            `sections.${props?.index}.content.${props?.c_index}.minutes`,
            String(data?.data?.lesson?.rendered_metas?.minutes).padStart(2, '0'),
            { shouldDirty: true }
          );
          props?.setValue(
            `sections.${props?.index}.content.${props?.c_index}.seconds`,
            String(data?.data?.lesson?.rendered_metas?.seconds).padStart(2, '0'),
            { shouldDirty: true }
          )
        }
      }
    });
  }

  const handleNext = () => {
    if (!props?.last) {
      const nextContent = props
        ?.watch("sections")
        ?.find((s) => s?.content?.find((c) => c?.i === content?.i + 1))
        ?.content?.find((c) => c?.i === content?.i + 1);

      if (nextContent) {
        props?.handleNavigate(nextContent?.id);
      }
    }
  }

  const handlePrevious = () => {
    if (!props?.first) {
      const previousContent = props
        ?.watch("sections")
        ?.find((s) => s?.content?.find((c) => c?.i === content?.i - 1))
        ?.content?.find((c) => c?.i === content?.i - 1);

      if (previousContent) {
        props?.handleNavigate(previousContent?.id);
      }
    }
  }

  const handleEnded = () => {
    props?.handleComplete(
      props?.c?.id,
      props?.index,
      props?.c_index,
      props?.c?.i
    );
  }

  return (
    <Box id="acadlix-video-player">
      <VideoPlayer
        src={src}
        videoType={props?.c?.video?.video_type}
        hours={props?.c?.hours}
        minutes={props?.c?.minutes}
        seconds={props?.c?.seconds}
        onUpdateDuration={updateDuration}
        isFirst={props?.first}
        isLast={props?.last}
        hasNext={true}
        nextTitle=""
        hasPrev={true}
        previousTitle=""
        onClickNext={handleNext}
        onClickPrevious={handlePrevious}
        hasExternalFullscreen={true}
        onClickFullscreen={props?.handleFullScreen}
        onEnded={handleEnded}
        {...props}
      />
    </Box>
  );
};

const LessonTextContent = (props) => {
  React.useEffect(() => {
    const handleFullscreenChange = () => {
      props?.setValue("is_fullscreen", !!document.fullscreenElement, {
        shouldDirty: true,
      });
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    document.addEventListener("webkitfullscreenchange", handleFullscreenChange);
    document.addEventListener("mozfullscreenchange", handleFullscreenChange);
    document.addEventListener("MSFullscreenChange", handleFullscreenChange);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      document.removeEventListener(
        "webkitfullscreenchange",
        handleFullscreenChange
      );
      document.removeEventListener(
        "mozfullscreenchange",
        handleFullscreenChange
      );
      document.removeEventListener(
        "MSFullscreenChange",
        handleFullscreenChange
      );
    };
  }, []);
  return (
    <Box
      sx={{
        paddingX: {
          xs: 1,
          sm: 20,
        },
        paddingY: 2,
        height: "100%",
        display: "flex",
        flexDirection: "column",
        minHeight: {
          xs: props?.watch("is_fullscreen") ? "100%" : "80vh",
          sm: props?.watch("is_fullscreen") ? "100%" : "80vh",
          xl: props?.watch("is_fullscreen") ? "100%" : "80vh",
        },
        maxHeight: {
          xs: "80vh",
          sm: "80vh",
          xl: "80vh",
        },
        overflowY: "auto",
      }}
    >

      <CustomLatex>
        {props?.c?.content}
      </CustomLatex>
    </Box>
  );
};

const QuizContent = (props) => {
  React.useEffect(() => {
    const handleFullscreenChange = () => {
      props?.setValue("is_fullscreen", !!document.fullscreenElement, {
        shouldDirty: true,
      });
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    document.addEventListener("webkitfullscreenchange", handleFullscreenChange);
    document.addEventListener("mozfullscreenchange", handleFullscreenChange);
    document.addEventListener("MSFullscreenChange", handleFullscreenChange);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      document.removeEventListener(
        "webkitfullscreenchange",
        handleFullscreenChange
      );
      document.removeEventListener(
        "mozfullscreenchange",
        handleFullscreenChange
      );
      document.removeEventListener(
        "MSFullscreenChange",
        handleFullscreenChange
      );
    };
  }, []);
  return (
    <Box
      sx={{
        paddingX: {
          xs: 1,
          sm: 20,
        },
        paddingY: 2,
        height: "100%",
        display: "flex",
        flexDirection: "column",
        minHeight: {
          xs: props?.watch("is_fullscreen") ? "100%" : "80vh",
          sm: props?.watch("is_fullscreen") ? "100%" : "80vh",
          xl: props?.watch("is_fullscreen") ? "100%" : "80vh",
        },
        maxHeight: {
          xs: "80vh",
          sm: "80vh",
          xl: "80vh",
        },
        overflowY: "auto",
      }}
    >
      <AppFront
        quiz_id={props?.c?.content_type_id}
        order_item_id={props?.watch("order_item_id")}
        course_section_content_id={props?.c?.id}
        section_index={props?.index}
        content_index={props?.c_index}
        is_completed={props?.c?.is_completed}
        user_id={Number(acadlixOptions?.user?.ID)}
        handleComplete={props?.handleComplete}
        start={false}
        advance={false}
        hide_title={false}
        hide_description={false}
      />
    </Box>
  );
};

const AssignmentContent = (props) => {
  const fileInputRef = useRef(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [deleteIndex, setDeleteIndex] = React.useState(null);



  const loadPage = () => {
    setInterval(() => {
      props?.loadEditor(
        `assignment_answer_form_${props?.c?.id}_${props?.current_meta_index}`,
        `sections.${props?.index}.content.${props?.c_index}.assignment_meta_value.submissions.${props?.current_meta_index}.answer_text`,
        false
      );
    }, 500);
  }

  React.useEffect(() => {
    loadPage();
    window.addEventListener("load", loadPage);

    return () => {
      props?.removeEditor(`assignment_answer_form_${props?.c?.id}_${props?.current_meta_index}`);
      window.removeEventListener("load", loadPage);
    };
  }, []);

  const getStatus = (status = "pending") => {
    switch (status) {
      case "pending":
        return <Chip label="Pending" color="warning" />;
      case "draft":
        return <Chip label="Draft" color="grey" />;
      case "submitted":
        return <Chip label="Submitted" color="success" />;
      case "evaluated":
        return <Chip label="Evaluated" color="success" />;
      default:
        return <Chip label="Pending" color="warning" />;
    }
  }

  const validateFiles = (files) => {
    const maxFiles = props?.c?.assignment_settings?.number_of_uploads;
    const maxFileSize = props?.c?.assignment_settings?.max_file_size * 1024 * 1024;
    const allowedExtensions = props?.c?.assignment_settings?.allowed_mime_types?.map((a) => a?.extension);
    const filesArray = Array.from(files);

    if (maxFiles > 0 && (filesArray?.length + props?.current_meta_value?.answer_files?.length) > maxFiles) {
      toast.error(
        sprintf(
          // translators: %s is the number of files allowed
          __("You can only upload %s files.", "acadlix"),
          maxFiles
        )
      );
      return false;
    }

    for (const file of filesArray) {
      const ext = file?.name?.split('.')?.pop()?.toLowerCase();
      if (!allowedExtensions.includes(ext)) {
        toast.error(
          sprintf(
            // translators: %s is the file name
            __("%s has invalid extension.", "acadlix"),
            file.name
          )
        );
        return false;
      }

      if (file.size > maxFileSize) {
        toast.error(
          sprintf(
            // translators: %1$s is the file name, %2$s is the file size
            __("%1$s exceeds the %2$sMB limit.", "acadlix"),
            file.name,
            props?.c?.assignment_settings?.max_file_size
          )
        );
        return false;
      }
    }

    return filesArray;
  }

  const uploadAssignmentFileMutation = PostUploadAssignmentFile();
  const hanldeFileChange = (e) => {
    const selectedFiles = e.target.files;
    const valid = validateFiles(selectedFiles);
    if (!valid) {
      return;
    }
    const metaValue = {
      ...props?.c?.assignment_meta_value,
      submissions: props?.c?.assignment_meta_value?.submissions?.map((s, index) => {
        if (index === props?.current_meta_index) {
          return {
            ...s,
            student_status: s?.student_status === "pending" ? "draft" : s?.student_status,
          };
        }
        return s;
      }),
    };
    const formData = new FormData();
    for (const file of valid) {
      formData.append("files[]", file);
    }
    formData.append("order_item_id", props?.watch("order_item_id"));
    formData.append("course_section_content_id", props?.c?.id);
    formData.append("user_id", acadlixOptions?.user?.ID);
    formData.append("meta_type", "assignment");
    formData.append("meta_value", JSON.stringify(metaValue));
    formData.append("current_meta_index", props?.current_meta_index);
    uploadAssignmentFileMutation?.mutate(formData, {
      onSuccess: (data) => {
        if (data?.data?.success && data?.data?.meta_value) {
          props?.setValue(
            `sections.${props?.index}.content.${props?.c_index}.assignment_meta_value`,
            data?.data?.meta_value,
            {
              shouldDirty: true,
            }
          );
        }
        // Reset file input value
        if (fileInputRef?.current) {
          fileInputRef.current.value = '';
        }
      },
      onError: (error) => {
        toast.error(error?.response?.data?.message);
      }
    });

  }

  const deleteAssignmentFileMutation = PostDeleteAssignmentFile();
  const handleRemoveFile = (index) => {
    if (!confirm(__("Are you sure you want to delete this file?", "acadlix"))) {
      return;
    }
    const delete_file_data = props?.current_meta_value?.answer_files?.[index];
    if (!delete_file_data) {
      return;
    }
    setDeleteIndex(index);
    const metaValue = {
      ...props?.c?.assignment_meta_value,
      submissions: props?.c?.assignment_meta_value?.submissions?.map((s, s_index) => {
        if (s_index === props?.current_meta_index) {
          return {
            ...s,
            answer_files: s?.answer_files?.filter((_, i) => i !== index),
          };
        }
        return s;
      }),
    };
    deleteAssignmentFileMutation?.mutate({
      delete_file_data: delete_file_data,
      order_item_id: props?.watch("order_item_id"),
      course_section_content_id: props?.c?.id,
      user_id: acadlixOptions?.user?.ID,
      meta_type: "assignment",
      meta_value: metaValue,
    }, {
      onSuccess: (data) => {
        if (data?.data?.success && data?.data?.meta_value) {
          props?.setValue(
            `sections.${props?.index}.content.${props?.c_index}.assignment_meta_value`,
            data?.data?.meta_value,
            {
              shouldDirty: true,
            }
          );
          setDeleteIndex(null);
        }
      },
      onError: (error) => {
        toast.error(error?.response?.data?.message);
        setDeleteIndex(null);
      }
    });
  }

  const submitAssignmentMutation = PostSubmitAssignment();
  const handleSubmit = (is_submitted = false) => {
    const metaValue = {
      ...props?.c?.assignment_meta_value,
      submissions: props?.c?.assignment_meta_value?.submissions?.map((s, s_index) => {
        if (s_index === props?.current_meta_index) {
          return {
            ...s,
            student_status: is_submitted ? "submitted" : "draft",
            submitted_at: is_submitted ? getDbFormatDate(getCurrentDateString()) : "",
          };
        }
        return s;
      }),
    };
    submitAssignmentMutation?.mutate({
      order_item_id: props?.watch("order_item_id"),
      course_section_content_id: props?.c?.id,
      user_id: acadlixOptions?.user?.ID,
      meta_type: "assignment",
      meta_value: metaValue,
    }, {
      onSuccess: (data) => {
        setIsSubmitting(false);
        if (data?.data?.success && data?.data?.course_statistics) {
          props?.setValue(
            `sections.${props?.index}.content.${props?.c_index}.assignment_meta_value`,
            data?.data?.course_statistics?.meta_value,
            { shouldDirty: true }
          );
          if (is_submitted) {
            props?.handleComplete(
              props?.c?.id,
              props?.index,
              props?.c_index,
              props?.c?.i,
              false
            );
            props?.removeEditor(`assignment_answer_form_${props?.c?.id}_${props?.current_meta_index}`);
            window.removeEventListener("load", loadPage);
          }
        }
      },
      onError: (error) => {
        setIsSubmitting(false);
        toast.error(error?.response?.data?.message);
      }
    });
  }

  const handleSaveDraft = () => {
    handleSubmit();
  }

  const handleSubmitAssignment = () => {
    if (confirm(__("Please confirm your submission. Once submitted, you will not be able to make changes or resubmit the assignment.", "acadlix"))) {
      setIsSubmitting(true);
      handleSubmit(true);
    }
  }

  const getDeadline = (first_started_at = 0) => {
    if (!props?.c?.assignment_settings?.enable_deadline || props?.c?.assignment_settings?.deadline_value === 0) {
      return "";
    }
    let deadline = "";
    if (props?.c?.assignment_settings?.deadline_type === "days") {
      deadline = first_started_at + (props?.c?.assignment_settings?.deadline_value * 24 * 60 * 60 * 1000);
    } 
    
    if (props?.c?.assignment_settings?.deadline_type === "weeks") {
      deadline = first_started_at + (props?.c?.assignment_settings?.deadline_value * 7 * 24 * 60 * 60 * 1000);
    }
    return deadline;
  }


  const date_settings = getSettings();
  const current_date = getCurrentDateString();
  const first_started_at = props?.c?.assignment_meta_value?.first_started_at ? strtotime(props?.c?.assignment_meta_value?.first_started_at) : "";
  const deadline = first_started_at ? getDeadline(first_started_at) : "";
  const start_date = strtotime(props?.c?.assignment_settings?.start_date);
  const end_date = strtotime(props?.c?.assignment_settings?.end_date);

  if (props?.c?.assignment_settings?.start_date && current_date < start_date) {
    return (
      <Box sx={{ margin: 2 }}>
        <Alert severity="error">{`${__('Assignment will start on', 'acadlix')} ${getFormatDate(start_date)} ${date_settings?.timezone?.string} `}</Alert>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        paddingX: {
          xs: 1,
          sm: 20,
        },
        paddingY: 2,
        height: "100%",
        display: "flex",
        flexDirection: "column",
        minHeight: {
          xs: props?.watch("is_fullscreen") ? "100%" : "80vh",
          sm: props?.watch("is_fullscreen") ? "100%" : "80vh",
          xl: props?.watch("is_fullscreen") ? "100%" : "80vh",
        },
        maxHeight: {
          xs: "80vh",
          sm: "80vh",
          xl: "80vh",
        },
        overflowY: "auto",
      }}
    >
      <Box>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, sm: 12, md: 12, lg: 12, xl: 12 }}>
            <Typography variant="h5" sx={{
              fontWeight: 600,
            }}>
              {props?.c?.title}
            </Typography>
          </Grid>
          <Grid size={{ xs: 12, sm: 12, md: 12, lg: 12, xl: 12 }}>
            <CustomLatex>
              {props?.c?.content}
            </CustomLatex>
          </Grid>
          {
            (end_date || deadline) && (
              <>
              <Grid size={{ xs: 12, sm: 12, md: 12, lg: 12, xl: 12 }}>
                <Alert severity="warning">
                  {
                    current_date > deadline && current_date > end_date ? 
                      `${__('Deadline passed on', 'acadlix')} ${end_date > deadline ? getFormatDate(deadline) : getFormatDate(end_date)} ${date_settings?.timezone?.string} ` : 
                      `${__('Your Deadline:', 'acadlix')} ${end_date > deadline ? getFormatDate(deadline) : getFormatDate(end_date)} ${date_settings?.timezone?.string} `
                  }
                </Alert>
              </Grid>
              </>
            )
          }
          <Grid size={{ xs: 12, sm: 12, md: 12, lg: 12, xl: 12 }}>
            <Divider />
            <Grid
              container
              spacing={2}
              sx={{
                paddingY: 4,
              }}
            >              
              {
                props?.c?.assignment_settings?.max_points > 0 && (
                  <Grid size={{ xs: 12, sm: 6, md: 6, lg: 4 }}>
                    <Box sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                    }}>
                      <Typography variant="body2" color="text.secondary">
                        {__("Max. Points:", "acadlix")}
                      </Typography>
                      <Typography variant="body1" sx={{
                        fontWeight: 600,
                      }}>
                        {props?.c?.assignment_settings?.max_points}
                      </Typography>
                    </Box>
                  </Grid>
                )
              }
              <Grid size={{ xs: 12, sm: 6, md: 6, lg: 4 }}>
                <Box sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                }}>
                  <Typography variant="body2" color="text.secondary">
                    {__("Status:", "acadlix")}
                  </Typography>
                  <Box>
                    {getStatus(props?.current_meta_value?.student_status)}
                  </Box>
                </Box>
              </Grid>
            </Grid>
            <Divider />
          </Grid>
          {
            props?.current_meta_value?.student_status === "submitted" && (
              <Grid size={{ xs: 12, sm: 12, md: 12, lg: 12, xl: 12 }}>
                <Box>
                  <Grid container spacing={2}>
                    {
                      props?.c?.assignment_meta_value?.submissions?.map((s, index) => {
                        return (
                          <Grid size={{ xs: 12, sm: 12, md: 12, lg: 12, xl: 12 }} key={index}>
                            <Card>
                              <CardContent>
                                <Box sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "space-between",
                                }}>
                                  <Box sx={{
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "flex-start",
                                    gap: 1,
                                  }}>
                                    <Box sx={{
                                      display: "flex",
                                      alignItems: "center",
                                      gap: 1,
                                    }}>
                                      <Typography variant="body2" color="text.secondary">
                                        {__("Evaluation:", "acadlix")}
                                      </Typography>
                                      <Box>
                                        {getStatus(s?.evaluation_status)}
                                      </Box>
                                    </Box>
                                    <Box sx={{
                                      display: "flex",
                                      alignItems: "center",
                                      gap: 1,
                                    }}>
                                      <Typography variant="body2" color="text.secondary">
                                        {__("Feedback:", "acadlix")}
                                      </Typography>
                                      <Typography variant="body1" sx={{
                                        fontWeight: 600,
                                      }}>
                                        {s?.feedback ?? "-"}
                                      </Typography>
                                    </Box>
                                  </Box>
                                  <Box>
                                    {
                                      s?.evaluation_status === "evaluated" &&
                                      props?.c?.assignment_settings?.max_points > 0 && (
                                        <Typography variant="body1">
                                          {`${s?.points}/${props?.c?.assignment_settings?.max_points} ${__("Point(s)", "acadlix")}`}
                                        </Typography>
                                      )
                                    }
                                  </Box>
                                </Box>
                              </CardContent>
                            </Card>
                          </Grid>
                        );
                      })
                    }

                  </Grid>
                </Box>
              </Grid>
            )
          }
          {
            props?.c?.assignment_settings?.attachments?.length > 0 && (
              <>
                <Grid size={{ xs: 12, sm: 12, md: 12, lg: 12, xl: 12 }}>
                  <Typography variant="h6" sx={{
                    fontWeight: 600
                  }}>
                    {__("Attachments", "acadlix")}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 12, sm: 12, md: 12, lg: 12, xl: 12 }}>
                  <Grid container spacing={2}>
                    {props?.c?.assignment_settings?.attachments?.map((a, index) => {
                      return (
                        <Grid
                          size={{ xs: 12, sm: 12, md: 12, lg: 12, xl: 12 }}
                          key={index}
                        >
                          <Box>
                            <Typography variant="body1" sx={{
                              fontWeight: 600,
                            }}>
                              {a?.title}
                            </Typography>
                            {
                              a?.type === "upload" ? (
                                <Box sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 2,
                                }}>
                                  <Link
                                    href={a?.file_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    sx={{
                                      textDecoration: "none",
                                    }}
                                  >
                                    {a?.filename}
                                  </Link>
                                  <Link
                                    href={a?.file_url}
                                    download
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    sx={{
                                      textDecoration: "none",
                                    }}
                                  >
                                    <FaDownload />
                                  </Link>
                                </Box>
                              ) : (
                                <Link
                                  href={a?.link}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  sx={{
                                    textDecoration: "none",
                                  }}
                                >
                                  {a?.link}
                                </Link>
                              )
                            }
                          </Box>
                        </Grid>
                      )
                    })}
                  </Grid>
                </Grid>
              </>
            )
          }
          {
            (end_date || deadline) && (current_date > end_date || current_date > deadline) ?
              <></>
              :
              (
                <>
                  <Grid size={{ xs: 12, sm: 12, md: 12, lg: 12, xl: 12 }}>
                    <Typography variant="h6" sx={{
                      fontWeight: 600
                    }}>
                      {__("Assignment Submission", "acadlix")}
                    </Typography>
                  </Grid>
                  {
                    props?.current_meta_value?.student_status === "submitted" && (
                      <Grid size={{ xs: 12, sm: 12, md: 12, lg: 12, xl: 12 }}>
                        <Typography variant="body1" fontWeight={600}>
                          {__("Response", "acadlix")}
                        </Typography>
                      </Grid>
                    )
                  }
                  <Grid size={{ xs: 12, sm: 12, md: 12, lg: 12, xl: 12 }}>
                    {
                      props?.current_meta_value?.student_status === "submitted" ?
                        (
                          <CustomLatex>
                            {props?.current_meta_value?.answer_text}
                          </CustomLatex>
                        )
                        : (
                          <textarea
                            id={`assignment_answer_form_${props?.c?.id}_${props?.current_meta_index}`}
                            style={{
                              width: "100%",
                            }}
                            disabled={props?.current_meta_value?.student_status === "submitted"}
                            value={props?.current_meta_value?.answer_text}
                            onChange={(e) => {
                              let value = e?.target?.value;
                              if (window?.tinymce) {
                                const editor = window.tinymce.get(`assignment_answer_form_${props?.c?.id}_${props?.current_meta_index}`);
                                if (editor && editor.getContent() !== value) {
                                  editor.setContent(value || "");
                                }
                              }
                              props.setValue(`sections.${props?.index}.content.${props?.c_index}.assignment_meta_value.answer_text`,
                                value,
                                {
                                  shouldDirty: true,
                                });
                            }}
                          />
                        )
                    }
                  </Grid>
                  {
                    props?.current_meta_value?.answer_files?.length > 0 && (
                      <Grid size={{ xs: 12, sm: 12, md: 12, lg: 12, xl: 12 }}>
                        <Box>
                          <Typography variant="body1" fontWeight={600}>
                            {__("Uploads", "acadlix")}
                          </Typography>
                          <List>
                            {
                              props?.current_meta_value?.answer_files?.map((f, i) => (
                                <ListItem key={i} sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 2,
                                }}>
                                  <Typography variant="body2">
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
                                  {
                                    props?.current_meta_value?.student_status !== "submitted" && (
                                      <IconButton
                                        color="error"
                                        aria-label="delete"
                                        size="small"
                                        disabled={deleteAssignmentFileMutation?.isPending}
                                        onClick={() => handleRemoveFile(i)}
                                      >
                                        <FaTrash />
                                      </IconButton>
                                    )
                                  }
                                </ListItem>
                              ))
                            }
                          </List>
                        </Box>
                      </Grid>
                    )
                  }
                  {
                    props?.c?.assignment_settings?.allow_uploads && (
                      <Grid size={{ xs: 12, sm: 12, md: 12, lg: 12, xl: 12 }}>
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
                            props?.c?.assignment_settings?.number_of_uploads > 0 && (
                              <Typography variant="body1" component="div">
                                <RawHTML>
                                  {sprintf(
                                    /* translators: %s is the number of max attachments */
                                    __('Attach assignment files (Max. <strong>%s</strong> files)', "acadlix"),
                                    props?.c?.assignment_settings?.number_of_uploads
                                  )}
                                </RawHTML>
                              </Typography>
                            )}
                          <input
                            type="file"
                            multiple={props?.c?.assignment_settings?.number_of_uploads === 0 || props?.c?.assignment_settings?.number_of_uploads > 1}
                            onChange={hanldeFileChange}
                            ref={fileInputRef}
                            style={{ display: "none" }}
                            accept={props?.c?.assignment_settings?.allowed_mime_types?.map((t) => `.${t?.extension}`).join(",")}
                          />
                          <Button
                            variant="contained"
                            onClick={() => fileInputRef?.current?.click()}
                            sx={{
                              width: "max-content",
                            }}
                            disabled={props?.current_meta_value?.student_status === "submitted"}
                            loading={uploadAssignmentFileMutation?.isPending}
                          >
                            {__('Upload File(s)', "acadlix")}
                          </Button>
                          {
                            props?.c?.assignment_settings?.allowed_mime_types?.length > 0 && (
                              <Typography variant="body2" component="div">
                                <RawHTML>
                                  {sprintf(
                                    /* translators: %s is the number of max attachments */
                                    __('Only <strong>%s</strong> files are allowed', "acadlix"),
                                    props?.c?.assignment_settings?.allowed_mime_types?.map((t) => `.${t?.extension}`).join(", ")
                                  )}
                                </RawHTML>
                              </Typography>
                            )}
                          {
                            props?.c?.assignment_settings?.max_file_size > 0 && (
                              <Typography variant="body2" component="div">
                                <RawHTML>
                                  {sprintf(
                                    /* translators: %s is the number of max attachments */
                                    __('Total size of files should not exceed <strong>%s MB</strong>', "acadlix"),
                                    `${props?.c?.assignment_settings?.max_file_size}`
                                  )}
                                </RawHTML>
                              </Typography>
                            )}
                        </Box>
                      </Grid>
                    )
                  }
                  {
                    props?.current_meta_value?.student_status !== "submitted" && (
                      <Grid size={{ xs: 12, sm: 12, md: 12, lg: 12, xl: 12 }}>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "flex-start",
                            gap: 2,
                          }}
                        >
                          <Button
                            variant="outlined"
                            size="medium"
                            onClick={handleSaveDraft}
                            loading={submitAssignmentMutation?.isPending && !isSubmitting}
                          >
                            {__("Save Draft", "acadlix")}
                          </Button>
                          <Button
                            variant="contained"
                            size="medium"
                            onClick={handleSubmitAssignment}
                            loading={submitAssignmentMutation?.isPending && isSubmitting}
                          >
                            {__("Submit Assignment", "acadlix")}
                          </Button>
                        </Box>
                      </Grid>
                    )}
                </>
              )
          }
        </Grid>
      </Box>
    </Box >
  )
}