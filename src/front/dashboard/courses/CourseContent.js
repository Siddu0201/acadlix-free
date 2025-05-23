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
import Grid from '@mui/material/Grid2';
import { TabContext, TabList, TabPanel } from "@mui/lab";
import CourseOverview from "./contentTabs/CourseOverview";
import CourseSidebar from "./contentTabs/CourseSidebar";
import { Navigate, useLocation, useNavigate, useParams } from "react-router-dom";
import {
  GetUserOrderById,
  PostMarkAsComplete,
  PostMarkAsIncomplete,
  PostSetActive,
} from "../../../requests/front/FrontDashboardRequest";
import { useForm } from "react-hook-form";
import Content from "./content/Content";
import ContentOptions from "./content/ContentOptions";
import ContentHeader from "./content/ContentHeader";
import { __ } from "@wordpress/i18n";
import { getCurrentDate, getFormatDate, strtotime } from "../../../helpers/util";

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
      sections: [],
    },
  });

  const { orderItemId, courseSectionContentId } = useParams();

  const navigate = useNavigate();
  const handleNavigate = (id = 0) => {
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
      })
    );
    navigate(`/course/${methods?.watch("order_item_id")}/content/${id}`);
    const sectionIndex = methods?.watch("sections")?.findIndex((s) => s?.content?.find((c) => c?.id === id));
    const contentIndex = methods?.watch("sections")?.[sectionIndex]?.content?.findIndex((c) => c?.id === id);
    const content = methods?.watch(`sections.${sectionIndex}.content.${contentIndex}`);
    const metaType = content?.type;
    let metaValue = content?.type === "assignment" ? content?.assignment_meta_value : null;
    let is_assignment_started = false;
    const current_date = getCurrentDate(true);
    const start_date = strtotime(content?.assignment_settings?.start_date);

    if(metaType === "assignment" &&
      !metaValue?.first_started_at
    ) {
      if((start_date &&
          current_date >= start_date) || 
          start_date === "") {
          is_assignment_started = true;
          metaValue = {
            ...metaValue,
            first_started_at: getFormatDate(current_date),
          };
      }
    }
    activeMutation?.mutate(
      {
        order_item_id: orderItemId,
        course_section_content_id: id,
        user_id: acadlixOptions?.user?.ID,
        meta_type: metaType,
        meta_value: metaValue,
        is_assignment_started: is_assignment_started,
      },
      {
        onSuccess: (data) => {
          // handle Success active
          if(data?.data?.success && metaType === "assignment" && data?.data?.meta_value) {
            methods?.setValue(
              `sections.${sectionIndex}.content.${contentIndex}.assignment_meta_value`,
              data?.data?.meta_value,
              { shouldDirty: true }
            );
          }
        },
      }
    );
  };

  const { data, isFetching } = GetUserOrderById(
    orderItemId,
    acadlixOptions?.user?.ID
  );

  React.useEffect(() => {
    if (data?.data?.order_item) {
      let item = data?.data?.order_item;
      methods?.setValue("order_item_id", item?.id, { shouldDirty: true });
      methods?.setValue("course_id", item?.course_id, { shouldDirty: true });
      methods?.setValue("order_id", item?.order_id, { shouldDirty: true });
      methods?.setValue("course_title", item?.course?.post_title, {
        shouldDirty: true,
      });
      methods?.setValue("course_content", item?.course?.rendered_post_content, {
        shouldDirty: true,
      });
      let i = 0;
      methods?.setValue(
        "sections",
        item?.course?.sections?.map((s, index) => {
          let open = false;
          if (courseSectionContentId === undefined) {
            if (data?.data?.course_statistic?.length > 0) {
              open =
                s?.contents?.findIndex(
                  (c) =>
                    c?.ID ==
                    data?.data?.course_statistic?.find((cs) => cs?.is_active)
                      ?.course_section_content_id
                ) !== -1
                  ? true
                  : false;
            } else {
              open = index === 0 ? true : false;
            }
          } else {
            open =
              s?.contents?.findIndex((c) => c?.ID == courseSectionContentId) !==
                -1
                ? true
                : false;
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
                let active = false;
                if (courseSectionContentId === undefined) {
                  if (data?.data?.course_statistic?.length > 0) {
                    active =
                      c?.ID ==
                      data?.data?.course_statistic?.find((cs) => cs?.is_active)
                        ?.course_section_content_id;
                  } else {
                    active = c_index === 0 ? true : false;
                  }
                } else {
                  active = c?.ID == courseSectionContentId;
                }
                const statistic = data?.data?.course_statistic?.find(
                  (cs) => cs?.course_section_content_id === c?.ID
                ) ?? {};
                return {
                  i: i++,
                  id: c?.ID ?? null,
                  sort: c?.menu_order ?? "",
                  content_type_id: c?.contentable?.id ?? null,
                  is_active: active,
                  is_completed: Boolean(statistic?.is_completed) ?? false,
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
                  assignment_meta_value: {
                    first_started_at: statistic?.meta_value?.first_started_at ?? "",
                    submissions: statistic?.meta_value?.submissions ?
                      statistic?.meta_value?.submissions?.map((s) => {
                        return {
                          attempt: s?.attempt ?? 1,
                          answer_text: s?.answer_text ?? "",
                          answer_files: s?.answer_files ?? [],
                          student_status: s?.status ?? "pending", // pending/draft/submitted
                          evaluation_status: s?.evaluation_status ?? "pending", // pending/evaluated
                          points: s?.points ?? 0,
                          feedbacks: s?.feedbacks ?? "",
                          feedback_by: s?.feedback_by ?? null,
                          submitted_at: s?.submitted_at ?? null,
                          evaluated_at: s?.evaluated_at ?? null,
                        };
                      })
                      : [
                        {
                          attempt: 1,
                          answer_text: "",
                          answer_files: [],
                          student_status: "pending", // pending/draft/submitted
                          evaluation_status: "pending", // pending/evaluated
                          points: 0,
                          feedbacks: "",
                          feedback_by: null,
                          submitted_at: null,
                          evaluated_at: null,
                        }
                      ],
                    current_attempt: statistic?.meta_value?.attempt ?? 1,
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
        }) ?? []
      );
      if (courseSectionContentId === undefined && methods?.watch("sections")?.length > 0) {
        handleNavigate(methods
          ?.watch("sections")
          ?.find((s) => s?.active)
          ?.content?.find((c) => c?.is_active)?.id);
      }
    }
  }, [data?.data]);

  const [value, setValue] = useState(isDesktop ? "2" : "1");

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleOpen = () => {
    setOpen((curr) => !curr);
    if (value === "1") {
      setValue("2");
    }
  };

  const activeMutation = PostSetActive();

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
        order_item_id: methods?.watch("order_item_id"),
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
            if (move_next) {
              const content = methods
                ?.watch("sections")
                ?.find((s) => s?.content?.find((co) => co?.i == i + 1))
                ?.content?.find((co) => co?.i == i + 1);
              if (content) {
                handleNavigate(content?.id);
              }
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
        order_item_id: methods?.watch("order_item_id"),
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
  }, [location]);


  return (
    <Box
      onContextMenu={(e) => e.preventDefault()}
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
                      sx={{
                        fontSize: 19,
                        fontWeight: 600,
                      }}
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
                  {courseSectionContentId !== undefined &&
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
              <TabContext value={value}>
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
                    <Tab
                      label={__("Course Overview", "acadlix")}
                      value="2"
                      sx={{
                        boxShadow: "none",
                        "&.Mui-selected": {
                          backgroundColor: "transparent",
                          borderColor: "transparent",
                        },
                      }}
                    />
                  </TabList>
                </Box>
                <Box
                  sx={{
                    paddingX: {
                      xs: 2,
                      sm: 9,
                    },
                  }}
                >
                  {!open && (
                    <TabPanel value="1">
                      <CourseSidebar
                        {...methods}
                        handleNavigate={handleNavigate}
                      />
                    </TabPanel>
                  )}
                  <TabPanel value="2">
                    <CourseOverview {...methods} />
                  </TabPanel>
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
