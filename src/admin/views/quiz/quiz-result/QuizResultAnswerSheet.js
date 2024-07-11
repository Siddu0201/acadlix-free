import React from "react";
import { useParams } from "react-router-dom";
import { GetStatisticById } from "../../../../requests/admin/AdminStatisticRequest";
import { Box, Card, CardContent, CardHeader, Grid } from "@mui/material";
import { useForm } from "react-hook-form";

const QuizResultAnswerSheet = () => {
  const methods = useForm({
    defaultValues: {
      questions: [],
    },
  });

  const { statistic_ref_id } = useParams();

  const { data, isFetching } = GetStatisticById(statistic_ref_id);
  console.log(data?.data);
  React.useMemo(() => {
    console.log(data?.data?.statistic);
    if (data?.data?.statistic?.length > 0) {
      methods?.setValue(
        "questions",
        data?.data?.statistic?.map((stat) => {
        //   return {
        //     question_id: stat?.question_id,
        //     subject_name: stat?.question?.subject?.subject_name ?? "Uncategorized",
        //     online: stat?.question?.online,
        //     sort: stat?.question?.sort,
        //     title: stat?.question?.title,
        //     points: stat?.question?.points,
        //     negative_points: stat?.question?.negative_points,
        //     different_points_for_each_answer: Boolean(
        //       Number(stat?.question?.different_points_for_each_answer)
        //     ),
        //     different_incorrect_msg: Boolean(
        //       Number(stat?.question?.different_incorrect_msg)
        //     ),
        //     hint_enabled: Boolean(Number(stat?.question?.hint_enabled)),
        //     answer_type: stat?.question?.answer_type,
        //     result: {
        //       correct_count: stat?.correct_count,
        //       incorrect_count: stat?.incorrect_count,
        //       solved_count: stat?.solved_count,
        //       hint_count: stat?.hint_count,
        //       time: stat?.question_time,
        //       answer_data: stat?.answer_data,
        //     },
        //     language:
        //       stat?.question?.question_languages?.map((lang) => {
        //         return {
        //           language_id: lang?.language_id,
        //           language_name: lang?.language?.language_name,
        //           default: Boolean(Number(lang?.default)),
        //           selected: Boolean(Number(lang?.default)),
        //           question: parse(lang?.question),
        //           correct_msg: parse(lang?.correct_msg),
        //           incorrect_msg: parse(lang?.incorrect_msg),
        //           hint_msg: parse(lang?.hint_msg),
        //           answer_data: {
        //             singleChoice: updateAnswer(
        //               JSON.parse(lang?.answer_data)?.singleChoice,
        //               Boolean(Number(props?.quiz?.random_option)),
        //               Boolean(Number(props?.quiz?.do_not_randomize_last_option))
        //             ),
        //             multipleChoice: updateAnswer(
        //               JSON.parse(lang?.answer_data)?.multipleChoice,
        //               Boolean(Number(props?.quiz?.random_option)),
        //               Boolean(Number(props?.quiz?.do_not_randomize_last_option))
        //             ),
        //             trueFalse: JSON.parse(lang?.answer_data)?.trueFalse,
        //             sortingChoice:
        //               question?.answer_type === "sortingChoice"
        //                 ? arrayRandomize(
        //                     JSON.parse(lang?.answer_data)?.sortingChoice
        //                   )
        //                 : [],
        //             matrixSortingChoice:
        //               question?.answer_type === "matrixSortingChoice"
        //                 ? randomizePosition(
        //                     JSON.parse(lang?.answer_data)?.matrixSortingChoice
        //                   )
        //                 : [],
        //             fillInTheBlank: JSON.parse(lang?.answer_data)
        //               ?.fillInTheBlank,
        //             numerical: JSON.parse(lang?.answer_data)?.numerical,
        //             rangeType: JSON.parse(lang?.answer_data)?.rangeType,
        //           },
        //         };
        //       }) ?? [],
        //   };
        }),
        { shouldDirty: true }
      );
    }
  }, [data]);

  return (
    <Box>
      <Grid
        container
        spacing={4}
        sx={{
          padding: 4,
        }}
      >
        <Grid item xs={12} lg={12}>
          <Card>
            <CardHeader title="AnswerSheet" />
            <CardContent>Hello</CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default QuizResultAnswerSheet;
