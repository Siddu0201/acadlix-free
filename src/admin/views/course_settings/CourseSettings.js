import { Box, Button } from "@mui/material";
import React from "react";
import { useForm } from "react-hook-form";
import General from "./sections/General";
import Payment from "./sections/Payment";
import Instructor from "./sections/Instructor";
import Outcome from "./sections/Outcome";
import { PostCreateUpdateCourse } from "@acadlix/requests/admin/AdminCourseRequest";
import { __ } from "@wordpress/i18n";

const CourseSettings = (props) => {
  const baseDefaults = {
    id: props?.course?.ID,
    post_status: props?.course?.post_status,
    users: props?.users ?? [],
    tab: "general",
    meta: {
      duration: {
        type: props?.course?.rendered_metas?.duration?.type ?? "", // week, day, hour, minute
        duration: props?.course?.rendered_metas?.duration?.duration ?? 0,
      },
      start_date: props?.course?.rendered_metas?.start_date ?? null,
      end_date: props?.course?.rendered_metas?.end_date ?? null,
      difficulty_level: props?.course?.rendered_metas?.difficulty_level ?? "all_levels",
      enable_certificate: Boolean(Number(props?.course?.rendered_metas?.enable_certificate)),
      lock_completed_content: Boolean(Number(props?.course?.rendered_metas?.lock_completed_content)),
      disable_mark_as_incomplete: Boolean(Number(props?.course?.rendered_metas?.disable_mark_as_incomplete)),
      payment_type: props?.course?.rendered_metas?.payment_type ?? "one_time",
      price: props?.course?.rendered_metas?.price ?? 0,
      enable_sale_price: Boolean(Number(props?.course?.rendered_metas?.enable_sale_price)),
      sale_price: props?.course?.rendered_metas?.sale_price ?? 0,
      tax: Boolean(Number(props?.course?.rendered_metas?.tax)),
      tax_percent: props?.course?.rendered_metas?.tax_percent ?? 0,
      user_ids:
        props?.course?.rendered_metas?.user_ids?.length > 0
          ? props?.course?.rendered_metas?.user_ids
          : [],
      outcomes:
        props?.course?.rendered_metas?.outcomes?.length > 0
          ? props?.course?.rendered_metas?.outcomes
          : [],
      // faqs:
      //   props?.course_setting?.outcomes?.length > 0
      //     ? props?.course_setting?.faqs?.map((f) => {
      //         return { id: f?.id, question: f?.question, answer: f?.answer };
      //       })
      //     : [],
      // video: {
      //   video_type: props?.course_setting?.video?.video_type ?? "",
      //   video_data: {
      //     html_5: props?.course_setting?.video?.video_data?.html_5 ?? "",
      //     external_link: props?.course_setting?.video?.video_data?.external_link ?? "",
      //     youtube: props?.course_setting?.video?.video_data?.youtube ?? "",
      //     vimeo: props?.course_setting?.video?.video_data?.vimeo ?? "",
      //     embedded: props?.course_setting?.video?.video_data?.embedded ?? "",
      //     shortcode: props?.course_setting?.video?.video_data?.shortcode ?? "",
      //   },
      //   video_thumbnail: props?.course_setting?.video?.video_thumbnail ?? "",
      // },
    },
  };

  const filteredDefaults = window?.acadlixHooks?.applyFilters?.(
    "acadlix.admin.course_settings.defaultValues",
    baseDefaults,
    props ?? {}
  ) ?? baseDefaults;

  const methods = useForm({
    defaultValues: filteredDefaults,
  });

  if(process.env.REACT_APP_MODE == 'development'){
    console.log(methods?.watch());
  }

  const courseMutation = PostCreateUpdateCourse();
  const handleSaveOrPublish = (e) => {
    // e.preventDefault();
    courseMutation?.mutate(methods?.watch());
  };

  React.useEffect(() => {
    // Add event listeners for the save and publish buttons using vanilla JS
    const publishButton = document.getElementById("publish");
    const saveDraftButton = document.getElementById("save-post");

    if (publishButton) {
      publishButton.addEventListener("click", handleSaveOrPublish);
    }

    if (saveDraftButton) {
      saveDraftButton.addEventListener("click", handleSaveOrPublish);
    }

    // Cleanup the event listeners when the component is unmounted
    return () => {
      if (publishButton) {
        publishButton.removeEventListener("click", handleSaveOrPublish);
      }
      if (saveDraftButton) {
        saveDraftButton.removeEventListener("click", handleSaveOrPublish);
      }
    };
  }, []);

  const handleTabChange = (tab) => {
    methods?.setValue("tab", tab, { shouldDirty: true });
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
    }
  }

  return (
    <Box
      sx={{
        marginTop: 3,
      }}
    >
      <Box
        sx={{
          display: "flex",
          gap: 2,
        }}
      >
        <Button
          variant={
            methods?.watch("tab") === "general" ? "contained" : "outlined"
          }
          color="primary"
          size="small"
          onClick={handleTabChange.bind(this, "general")}
        >
          {__("General", "acadlix")}
        </Button>
        <Button
          variant={
            methods?.watch("tab") === "payment" ? "contained" : "outlined"
          }
          color="primary"
          size="small"
          onClick={handleTabChange.bind(this, "payment")}
        >
          {__("Payment", "acadlix")}
        </Button>
        <Button
          variant={
            methods?.watch("tab") === "instructor" ? "contained" : "outlined"
          }
          color="primary"
          size="small"
          onClick={handleTabChange.bind(this, "instructor")}
        >
          {__("Instructor", "acadlix")}
        </Button>
        <Button
          variant={
            methods?.watch("tab") === "outcome" ? "contained" : "outlined"
          }
          color="primary"
          size="small"
          onClick={handleTabChange.bind(this, "outcome")}
        >
          {__("Outcome", "acadlix")}
        </Button>
        {/* <Button
          variant={methods?.watch("tab") === "faq" ? "contained" : "outlined"}
          color="primary"
          size="small"
          onClick={handleTabChange.bind(this, "faq")}
        >
          {__("FAQ(s)", "acadlix")}
        </Button> */}
        {/* <Button
          variant={
            methods?.watch("tab") === "featured_video"
              ? "contained"
              : "outlined"
          }
          color="primary"
          size="small"
          onClick={handleTabChange.bind(this, "featured_video")}
        >
          {__("Featured Video", "acadlix")}
        </Button> */}
      </Box>
      <Box
        sx={{
          marginY: 3,
        }}
      >
        {methods?.watch("tab") === "general" && <General {...methods} handleKeyDown={handleKeyDown} />}
        {methods?.watch("tab") === "payment" && <Payment {...methods} handleKeyDown={handleKeyDown} />}
        {methods?.watch("tab") === "instructor" && <Instructor {...methods} handleKeyDown={handleKeyDown} />}
        {methods?.watch("tab") === "outcome" && <Outcome {...methods} handleKeyDown={handleKeyDown} />}
        {/* {methods?.watch("tab") === "faq" && <Faq {...methods} handleKeyDown={handleKeyDown} />} */}
        {/* {methods?.watch("tab") === "featured_video" && (
          <FeaturedVideo {...methods} handleKeyDown={handleKeyDown} />
        )} */}
      </Box>
    </Box>
  );
};

export default CourseSettings;
