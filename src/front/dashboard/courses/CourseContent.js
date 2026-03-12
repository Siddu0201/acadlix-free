import React, { useState, useEffect } from "react";
import {
  Box,
  Card,
  CardContent,
  Tab,
  useMediaQuery,
  useTheme,
  Typography,
  Backdrop,
  CircularProgress,
} from "@mui/material";
import Grid from '@mui/material/Grid';
import { TabContext, TabList, TabPanel } from "@mui/lab";
import CourseSidebar from "./contentTabs/CourseSidebar";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
  GetUserCourseById,
  PostMarkAsComplete,
  PostMarkAsIncomplete,
  PostSetActive,
} from "@acadlix/requests/front/FrontDashboardRequest";
import { useForm } from "react-hook-form";
import Content from "./content/Content";
import ContentOptions from "./content/ContentOptions";
import ContentHeader from "./content/ContentHeader";
import { __ } from "@wordpress/i18n";
import {
  getCurrentDateString,
  getDbFormatDate,
  strtotime
} from "@acadlix/helpers/util";
import CourseCompletionModal from "./modals/CourseCompletionModal";
import toast from "react-hot-toast";

const CourseContent = () => {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("sm"));
  const [open, setOpen] = useState(isDesktop ? true : false);
  const methods = useForm({
    defaultValues: {
      is_fullscreen: false,
      order_item_id: null,
      course_id: null,
      order_id: null,
      course_title: "",
      course_content: "",
      course_completion_percentage: 0,
      course_completed: false,
      sections: [],
    },
  });

  const { courseId, courseSectionContentId } = useParams();

  const navigate = useNavigate();

  const activeMutation = PostSetActive();
  const handleNavigate = (id = 0) => {
    if (id == 0) {
      toast.error("Invalid content id");
      return;
    }
    methods?.setValue(
      `sections`,
      methods?.watch("sections")?.map((s) => {
        let target = s?.content?.find((c) => c?.id === id);
        return {
          ...s,
          open: target ? true : s?.open,
          active: target ? true : false,
          content: s?.content?.map((c) => {
            return {
              ...c,
              is_active: id === c?.id ? true : false,
            };
          }),
        };
      }),
      { shouldDirty: true }
    );
    navigate(`/course/${methods?.watch("course_id")}/content/${id}`);

    const sectionIndex = methods?.watch("sections")?.findIndex((s) => s?.content?.find((c) => c?.id === id));
    const contentIndex = methods?.watch("sections")?.[sectionIndex]?.content?.findIndex((c) => c?.id === id);
    const content = methods?.watch(`sections.${sectionIndex}.content.${contentIndex}`);
    const metaType = content?.type;
    let assignmentUserStat = content?.type === "assignment" ? content?.assignment_user_stat : {};
    let isAssignmentStarted = false;
    const current_date = getCurrentDateString();
    const start_date = strtotime(content?.assignment_settings?.start_date);
    if (metaType === "assignment" &&
      !assignmentUserStat?.first_started_at
    ) {
      if ((start_date &&
        current_date >= start_date) ||
        !start_date) {
        isAssignmentStarted = true;
        assignmentUserStat = {
          ...assignmentUserStat,
          first_started_at: getDbFormatDate(current_date),
        };
      }
    }
    activeMutation?.mutate(
      {
        course_id: courseId,
        course_section_content_id: id,
        user_id: acadlixOptions?.user?.ID,
        meta_type: metaType,
        assignment_user_stat: assignmentUserStat,
        is_assignment_started: isAssignmentStarted,
      },
      {
        onSuccess: (data) => {
          // handle Success active
          if (data?.data?.success) {
            if (metaType === "assignment" && data?.data?.assignment_user_stat) {
              methods?.setValue(
                `sections.${sectionIndex}.content.${contentIndex}.assignment_user_stat.first_started_at`,
                data?.data?.assignment_user_stat?.first_started_at,
                { shouldDirty: true }
              );
              methods?.setValue(
                `sections.${sectionIndex}.content.${contentIndex}.assignment_user_stat.id`,
                data?.data?.assignment_user_stat?.id,
                { shouldDirty: true }
              );
              methods?.setValue(
                `sections.${sectionIndex}.content.${contentIndex}.assignment_user_stat.submissions`,
                data?.data?.assignment_user_stat?.submissions?.map((s) => {
                  return {
                    id: s?.id ?? null,
                    is_active: s?.is_active ?? true,
                    is_late: s?.is_late ?? false,
                    marks: s?.marks ?? 0,
                    answer_text: s?.answer_text ?? "",
                    answer_attachments: s?.answer_attachments ?? [],
                    feedback: s?.feedback ?? "",
                    feedback_attachments: s?.feedback_attachments ?? [],
                    submitted_at: s?.submitted_at ?? "",
                    evaluated_at: s?.evaluated_at ?? "",
                  };
                }),
                { shouldDirty: true }
              );
            }
            if (data?.data?.active_statistic) {
              methods?.setValue(
                `sections.${sectionIndex}.content.${contentIndex}.course_statistic_id`,
                data?.data?.active_statistic?.id,
                { shouldDirty: true }
              );
            }
          }
        },
      }
    );
  };

  const { data, isFetching } = GetUserCourseById(
    courseId,
    acadlixOptions?.user?.ID
  );

  React.useEffect(() => {
    if (data?.data?.course) {
      let course = data?.data?.course;
      methods?.setValue("course_id", course?.ID, { shouldDirty: true });
      methods?.setValue("course_completion_percentage", course?.completion_percentage, { shouldDirty: true });
      methods?.setValue("course_title", course?.post_title, {
        shouldDirty: true,
      });
      methods?.setValue("course_content", course?.rendered_post_content, {
        shouldDirty: true,
      });
      let i = 0;
      const sections = course?.sections?.map((s, index) => {
        let open = false;
        if (data?.data?.course_section_content_id) {
          open =
            s?.contents?.find(
              (c) =>
                c?.ID ==
                data?.data?.course_section_content_id
            )
              ? true
              : false;
        } else {
          open = index === 0 ? true : false;
        }
        return {
          id: s?.ID ?? null,
          title: s?.post_title ?? "",
          sort: s?.menu_order ?? "",
          description: s?.rendered_post_content ?? "",
          open: open,
          active: open,
          content:
            s?.contents?.map((c, c_index) => {
              const statistic = c?.course_statistics?.length > 0 ? c?.course_statistics?.[0] : {};
              return {
                i: i++,
                id: c?.ID ?? null,
                sort: c?.menu_order ?? "",
                content_type_id: c?.contentable?.id ?? null,
                course_statistic_id: statistic?.id ?? null,
                is_active: data?.data?.course_section_content_id == c?.ID,
                is_completed: Boolean(Number(statistic?.is_completed)) ?? false,
                type: c?.contentable?.type ?? "", // lesson/quiz/assignment,
                lesson_type: c?.contentable_data?.rendered_metas?.type ?? "video",
                title: c?.contentable?.title ?? "",
                content: c?.contentable_data?.rendered_post_content ?? "",
                video: {
                  video_type: c?.contentable_data?.rendered_metas?.video?.video_type ?? "",
                  video_data: {
                    html_5: c?.contentable_data?.rendered_metas?.video?.video_data?.html_5 ?? "",
                    external_link:
                      c?.contentable_data?.rendered_metas?.video?.video_data?.external_link ?? "",
                    youtube: c?.contentable_data?.rendered_metas?.video?.video_data?.youtube ?? "",
                    vimeo: c?.contentable_data?.rendered_metas?.video?.video_data?.vimeo ?? "",
                    embedded:
                      c?.contentable_data?.rendered_metas?.video?.video_data?.embedded ?? "",
                    shortcode:
                      c?.contentable_data?.rendered_metas?.video?.video_data?.shortcode ?? "",
                  },
                  video_thumbnail:
                    c?.contentable_data?.rendered_metas?.video?.video_thumbnail ?? "",
                },
                hours:
                  (c?.contentable_data?.rendered_metas?.hours ?? 0).toString().padStart(2, '0'),
                minutes:
                  (c?.contentable_data?.rendered_metas?.minutes ?? 0).toString().padStart(2, '0'),
                seconds:
                  (c?.contentable_data?.rendered_metas?.seconds ?? 0).toString().padStart(2, '0'),
                resources: c?.contentable_data?.rendered_metas?.resources ?? [],
                assignment_user_stat: {
                  id: statistic?.assignment_user_stat?.id ?? null,
                  assignment_id: c?.rendered_metas?.type === "assignment" ? c?.rendered_metas?.assignment_id : null,
                  course_statistic_id: statistic?.assignment_user_stat?.course_statistic_id ?? null, // Selected course + user context
                  user_status: statistic?.assignment_user_stat?.user_status ?? "pending", // 'pending', 'draft', 'submitted'
                  admin_status: statistic?.assignment_user_stat?.admin_status ?? "pending_review", // 'pending_review', 'evaluated', 'rejected', 're_eval_requested'
                  final_marks: statistic?.assignment_user_stat?.final_marks ?? null, // or 0 if initialized early
                  is_passed: statistic?.assignment_user_stat?.is_passed ?? false,
                  has_late_submission: statistic?.assignment_user_stat?.has_late_submission ?? false,
                  resubmission_allowed: statistic?.assignment_user_stat?.resubmission_allowed ?? false,
                  attempt_counts: statistic?.assignment_user_stat?.attempt_counts ?? 1,
                  first_started_at: statistic?.assignment_user_stat?.first_started_at ?? "",
                  submissions: statistic?.assignment_user_stat?.submissions ?
                    statistic?.assignment_user_stat?.submissions.map((s) => {
                      return {
                        id: s?.id ?? null,
                        is_active: s?.is_active ?? true,
                        is_late: s?.is_late ?? false,
                        marks: s?.marks ?? 0,
                        answer_text: s?.answer_text ?? "",
                        answer_attachments: s?.answer_attachments ?? [],
                        feedback: s?.feedback ?? "",
                        feedback_attachments: s?.feedback_attachments ?? [],
                        submitted_at: s?.submitted_at ?? "",
                        evaluated_at: s?.evaluated_at ?? "",
                      };
                    })
                    : [
                      {
                        id: null,
                        is_active: true,
                        is_late: false,
                        mark: 0,
                        answer_text: "",
                        answer_files: [], // Array of file metadata or file IDs
                        feedback_text: "",
                        feedback_files: [], // Array of file metadata or file IDs
                        submitted_at: "",
                        evaluated_at: "",
                      }
                    ],
                },
                assignment_settings: {
                  allow_uploads: Boolean(c?.contentable_data?.rendered_metas?.allow_uploads) ?? false,
                  number_of_uploads: c?.contentable_data?.rendered_metas?.number_of_uploads ?? 1,
                  allowed_mime_types: c?.contentable_data?.rendered_metas?.allowed_mime_types ?? [],
                  max_file_size: c?.contentable_data?.rendered_metas?.max_file_size ?? 2,
                  enable_marking: Boolean(c?.contentable_data?.rendered_metas?.enable_marking) ?? false,
                  max_points: c?.contentable_data?.rendered_metas?.max_points ?? 0,
                  start_date: c?.contentable_data?.rendered_metas?.start_date ?? "",
                  end_date: c?.contentable_data?.rendered_metas?.end_date ?? "",
                  enable_deadline: Boolean(c?.contentable_data?.rendered_metas?.enable_deadline) ?? false,
                  deadline_type: c?.contentable_data?.rendered_metas?.deadline_type ?? "days",
                  deadline_value: c?.contentable_data?.rendered_metas?.deadline_value ?? 0,
                  attachments: c?.contentable_data?.rendered_metas?.attachments?.length > 0 ?
                    c?.contentable_data?.rendered_metas?.attachments?.map((a) => {
                      return {
                        title: a?.title,
                        type: a?.type,
                        filename: a?.filename,
                        file_url: a?.file_url,
                        link: a?.link,
                      };
                    })
                    : [],
                },
              };
            }) ?? [],
        };
      }) ?? [];

      const filteredSection = window?.acadlixHooks?.applyFilters?.(
        "acadlix.front.courseContent.sections",
        sections,
        course,
        data?.data?.course_statistic,
        courseSectionContentId
      ) ?? sections;

      methods?.setValue(
        "sections",
        filteredSection,
        {
          shouldDirty: true,
        }
      );
      if (filteredSection?.length > 0) {
        const activeId = filteredSection
          ?.find((s) => s?.active)
          ?.content?.find((c) => c?.is_active)?.id;
        handleNavigate(activeId);
      }
    }

  }, [data?.data]);

  if (process?.env?.REACT_APP_MODE === 'development') {
    console.log(methods?.watch("sections"));
  }


  const [value, setValue] = useState("1");

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleOpen = () => {
    setOpen((curr) => !curr);
    if (value === "1") {
      setValue("2");
    }
  };

  const handleFullScreen = () => {
    if (methods?.watch("is_fullscreen")) {
      methods?.setValue("is_fullscreen", false, {
        shouldDirty: true,
      });

      if (document?.fullscreenElement) {
        if (document?.exitFullscreen) {
          document?.exitFullscreen();
        } else if (document?.mozCancelFullScreen) {
          document?.mozCancelFullScreen(); // Firefox
        } else if (document?.webkitExitFullscreen) {
          document?.webkitExitFullscreen(); // Safari
        } else if (document?.msExitFullscreen) {
          document?.msExitFullscreen(); // IE/Edge
        }
      }
    } else {
      let elem = document.getElementById("acadlix_course_content");
      methods?.setValue("is_fullscreen", true, {
        shouldDirty: true,
      });
      if (elem?.requestFullscreen) {
        elem?.requestFullscreen();
      } else if (elem?.webkitRequestFullscreen) {
        /* Safari */
        elem?.webkitRequestFullscreen();
      } else if (elem?.msRequestFullscreen) {
        /* IE11 */
        elem?.msRequestFullscreen();
      }
    }
  };

  const completeMutation = PostMarkAsComplete();
  const incompleteMutation = PostMarkAsIncomplete();

  const handleComplete = (
    course_section_content_id = 0,
    index = 0,
    c_index = 0,
    i = 0,
    move_next = true,
  ) => {
    completeMutation?.mutate(
      {
        course_id: methods?.watch("course_id"),
        course_section_content_id: course_section_content_id,
        user_id: acadlixOptions?.user?.ID,
      },
      {
        onSuccess: (data) => {
          if (data?.data?.success) {
            methods?.setValue(
              `sections.${index}.content.${c_index}.is_completed`,
              true,
              { shouldDirty: true }
            );
            methods?.setValue(
              "course_completion_percentage",
              data?.data?.course_completion_percentage,
              { shouldDirty: true }
            );
            if (move_next) {
              const content = methods
                ?.watch("sections")
                ?.find((s) => s?.content?.find((co) => co?.i == i + 1))
                ?.content?.find((co) => co?.i == i + 1);
              if (content) {
                handleNavigate(content?.id);
              }
            }

            if (data?.data?.course_full_completed) {
              // toast.success(__("Congatulations! Your have successfully completed your course.", "acadlix"), {
              //   position: "top-center"
              // })
              methods?.setValue("course_completed", true, { shouldDirty: true });
            }
          }
        },
      }
    );
  };

  const handleIncomplete = (
    course_section_content_id = 0,
    index = 0,
    c_index = 0
  ) => {
    incompleteMutation?.mutate(
      {
        course_id: methods?.watch("course_id"),
        course_section_content_id: course_section_content_id,
        user_id: acadlixOptions?.user?.ID,
      },
      {
        onSuccess: (data) => {
          if (data?.data?.success) {
            methods?.setValue(
              `sections.${index}.content.${c_index}.is_completed`,
              false,
              { shouldDirty: true }
            );
            methods?.setValue(
              "course_completion_percentage",
              data?.data?.course_completion_percentage,
              { shouldDirty: true }
            );
            methods?.setValue("course_completed", false, { shouldDirty: true });
          }
        },
      }
    );
  };

  const active_content = methods
    ?.watch("sections")
    ?.find((s) => s?.active)
    ?.content?.find((c) => c?.is_active);

  const location = useLocation();
  useEffect(() => {
    const targetElement = document.getElementById(
      `acadlix_course_listitem_${courseSectionContentId}`
    );
    if (targetElement) {
      targetElement.scrollIntoView({
        behavior: "smooth", // Smooth scroll animation
        block: "start", // Align the element in the center of the viewport
      });
    }

    // Scroll to header when user change location mainly for mobile
    const headerElement = document.getElementById("acadlix_course_content_header");
    if (headerElement) {
      headerElement.scrollIntoView({
        behavior: "smooth", // Smooth scroll animation
        block: "start", // Align the element in the center of the viewport
      });
    }
  }, [location]);

  const enable_course_protection = acadlixOptions?.settings?.acadlix_enable_content_protection === "yes";

  const handleKeyDown = (e) => {
    // Disable Ctrl+C, Ctrl+V, Ctrl+U, and F12
    if (
      (e.ctrlKey && (e.key === 'c' || e.key === 'v' || e.key === 'u' || e.key === 's')) ||
      e.key === 'F12'
    ) {
      e.preventDefault();
      alert("Protected content.");
    }
  };
  return (
    <Box
      onContextMenu={(e) => {
        if (enable_course_protection) {
          e.preventDefault();
        }
      }}
      onKeyDown={(e) => {
        if (enable_course_protection) {
          handleKeyDown(e);
        }
      }}
      tabIndex={0}
      sx={{
        userSelect: enable_course_protection ? 'none' : 'auto',        // Disables text selection
        WebkitUserSelect: enable_course_protection ? 'none' : 'auto',  // For Safari
        MozUserSelect: enable_course_protection ? 'none' : 'auto',     // For Firefox
        msUserSelect: enable_course_protection ? 'none' : 'auto',      // For IE/Edge
        '& *': {
          userSelect: enable_course_protection ? 'none' : 'auto',      // Ensures children are also protected
        }
      }}
    >
      {(isFetching ||
        incompleteMutation?.isPending ||
        completeMutation?.isPending) && (
          <Backdrop
            sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
            open={
              isFetching ||
              incompleteMutation?.isPending ||
              completeMutation?.isPending
            }
          >
            <CircularProgress color="inherit" />
          </Backdrop>
        )}

      {
        methods?.watch("course_completed") &&
        <CourseCompletionModal {...methods} />
      }
      <Box>
        <Grid
          container
          sx={{
            height: "100%",
          }}
        >
          {/* Sidebar */}
          <Grid size={{ xs: 0, sm: open ? 4 : 0, md: open ? 3 : 0 }}
            sx={{
              display: {
                xs: "none",
                sm: open ? "block" : "none",
              },
              height: "100%",
            }}
          >
            <Card
              sx={{
                borderRadius: 0,
                borderRight: `1px solid #d1d7dc`,
              }}
            >
              <CardContent
                sx={{
                  padding: 0,
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  ":last-child": {
                    padding: 0,
                  },
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    paddingY: 3,
                    paddingLeft: 5,
                    paddingRight: 3,
                    borderBottom: "1px solid #d1d7dc",
                  }}
                >
                  <Box>
                    <Typography
                      variant="h4"
                      component="div"
                    >
                      {__("Course content", "acadlix")}
                    </Typography>
                  </Box>
                </Box>
                <Box
                  sx={{
                    overflowY: "auto",
                  }}
                >
                  <CourseSidebar
                    {...methods}
                    handleNavigate={handleNavigate}
                    handleComplete={handleComplete}
                    handleIncomplete={handleIncomplete}
                  />
                </Box>
              </CardContent>
            </Card>
          </Grid>
          {/* Content */}
          <Grid size={{ xs: 12, sm: open ? 8 : 12, md: open ? 9 : 12 }}
            sx={{
              height: "100%",
              overflowY: "auto",
            }}
          >
            <Box
              sx={{
                borderBottom: "1px solid #d1d7dc",
                display: "flex",
                flexDirection: "column",
                position: "relative",
              }}
            >
              {/* Content Header  */}
              <ContentHeader {...methods} handleOpen={handleOpen} open={open} />
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  flex: 1,
                  // overflowY: "auto",
                  position: "relative",
                  paddingBottom:
                    active_content?.type === "lesson" &&
                      active_content?.lesson_type === "video"
                      ? 0
                      : 10,
                  backgroundColor: "#fff",
                }}
                id={`acadlix_course_content`}
              >
                <Box
                  sx={{
                    flex: 1,
                    overflowY: "auto",
                  }}
                >
                  {(courseSectionContentId !== undefined || courseSectionContentId !== 0) &&
                    methods?.watch("sections")?.length > 0 && (
                      <Content
                        {...methods}
                        courseSectionContentId={courseSectionContentId}
                        handleNavigate={handleNavigate}
                        handleFullScreen={handleFullScreen}
                        active_content={active_content}
                        handleComplete={handleComplete}
                        handleIncomplete={handleIncomplete}
                        completeMutation={completeMutation}
                        incompleteMutation={incompleteMutation}
                      />
                    )}
                </Box>
                {methods?.watch("sections")?.length > 0 && (
                  <ContentOptions
                    {...methods}
                    courseSectionContentId={courseSectionContentId}
                    handleNavigate={handleNavigate}
                    handleFullScreen={handleFullScreen}
                    active_content={active_content}
                    handleComplete={handleComplete}
                    handleIncomplete={handleIncomplete}
                    completeMutation={completeMutation}
                    incompleteMutation={incompleteMutation}
                  />
                )}
              </Box>
            </Box>
            <Box
              sx={{
                paddingX: {
                  xs: 0,
                  sm: open ? 0 : "6%",
                },
              }}
            >
              <TabContext value="1">
                <Box>
                  <TabList
                    onChange={handleChange}
                    variant="scrollable"
                    scrollButtons
                    allowScrollButtonsMobile
                  >
                    {!open && <Tab label={__("Course Content", "acadlix")} value="1"
                      sx={{
                        boxShadow: "none",
                        "&.Mui-selected": {
                          backgroundColor: "transparent",
                          borderColor: "transparent",
                        },
                      }} />}
                    {/* <Tab
                      label={__("Course Overview", "acadlix")}
                      value="2"
                      sx={{
                        boxShadow: "none",
                        "&.Mui-selected": {
                          backgroundColor: "transparent",
                          borderColor: "transparent",
                        },
                      }}
                    /> */}
                  </TabList>
                </Box>
                <Box
                  sx={{
                    paddingX: {
                      xs: 2,
                      sm: 9,
                    },
                  }}
                  id="acadlix_course_content"
                >
                  {!open && (
                    <TabPanel value="1">
                      <CourseSidebar
                        {...methods}
                        handleNavigate={handleNavigate}
                      />
                    </TabPanel>
                  )}
                  {/* <TabPanel value="2">
                    <CourseOverview {...methods} />
                  </TabPanel> */}
                </Box>
              </TabContext>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default CourseContent;
