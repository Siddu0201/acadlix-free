import { Box, Button } from "@mui/material";
import React from "react";
import { useForm } from "react-hook-form";
import General from "./sections/General";
import Payment from "./sections/Payment";
import Instructor from "./sections/Instructor";
import Outcome from "./sections/Outcome";
import Faq from "./sections/Faq";
import FeaturedVideo from "./sections/FeaturedVideo";
import { PostCreateUpdateCourse } from "../../../requests/admin/AdminCourseRequest";

const CourseSettings = (props) => {
  const methods = useForm({
    defaultValues: {
      id: props?.course?.ID,
      post_status: props?.course?.post_status,
      users: props?.users ?? [],
      tab: "general",
      weeks: props?.course_setting?.weeks ?? 0,
      days: props?.course_setting?.days ?? 0,
      hours: props?.course_setting?.hours ?? 0,
      minutes: props?.course_setting?.minutes ?? 0,
      start_date: props?.course_setting?.start_date ?? null,
      end_date: props?.course_setting?.end_date ?? null,
      difficulty_level: props?.course_setting?.difficulty_level ?? "all_levels",
      question_and_answer: props?.course_setting?.question_and_answer ?? false,
      price: props?.course_setting?.price ?? 0,
      enable_sale_price: Boolean(Number(props?.course_setting?.enable_sale_price)),
      sale_price: props?.course_setting?.sale_price ?? 0,
      validity: props?.course_setting?.validity ?? 0,
      validity_type: props?.course_setting?.validity_type ?? "day",
      tax: Boolean(Number(props?.course_setting?.tax)),
      tax_percent: props?.course_setting?.tax_percent ?? 0,
      allow_repurchase: Boolean(Number(props?.course_setting?.allow_repurchase)),
      user_ids:
        props?.course_setting?.users?.length > 0
          ? props?.course_setting?.users?.map((u) => u?.user_id)
          : [],
      outcomes:
        props?.course_setting?.outcomes?.length > 0
          ? props?.course_setting?.outcomes?.map((o) => {
              return { id: o?.id, outcome: o?.outcome };
            })
          : [],
      faqs:
        props?.course_setting?.outcomes?.length > 0
          ? props?.course_setting?.faqs?.map((f) => {
              return { id: f?.id, question: f?.question, answer: f?.answer };
            })
          : [],
      video: {
        video_type: props?.course_setting?.video?.video_type ?? "",
        video_data: {
          html_5: props?.course_setting?.video?.video_data?.html_5 ?? "",
          external_link: props?.course_setting?.video?.video_data?.external_link ?? "",
          youtube: props?.course_setting?.video?.video_data?.youtube ?? "",
          vimeo: props?.course_setting?.video?.video_data?.vimeo ?? "",
          embedded: props?.course_setting?.video?.video_data?.embedded ?? "",
          shortcode: props?.course_setting?.video?.video_data?.shortcode ?? "",
        },
        video_thumbnail: props?.course_setting?.video?.video_thumbnail ?? "",
      },
    },
  });

  const courseMutation = PostCreateUpdateCourse();
  const handleSaveOrPublish = (e) => {
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
    if(e.key === 'Enter'){
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
          General
        </Button>
        <Button
          variant={
            methods?.watch("tab") === "payment" ? "contained" : "outlined"
          }
          color="primary"
          size="small"
          onClick={handleTabChange.bind(this, "payment")}
        >
          Payment
        </Button>
        <Button
          variant={
            methods?.watch("tab") === "instructor" ? "contained" : "outlined"
          }
          color="primary"
          size="small"
          onClick={handleTabChange.bind(this, "instructor")}
        >
          Instructor
        </Button>
        <Button
          variant={
            methods?.watch("tab") === "outcome" ? "contained" : "outlined"
          }
          color="primary"
          size="small"
          onClick={handleTabChange.bind(this, "outcome")}
        >
          Outcome
        </Button>
        {/* <Button
          variant={methods?.watch("tab") === "faq" ? "contained" : "outlined"}
          color="primary"
          size="small"
          onClick={handleTabChange.bind(this, "faq")}
        >
          FAQ(s)
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
          Featured Video
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
