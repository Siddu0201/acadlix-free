import React from "react";
import { Link, useParams } from "react-router-dom";
import { GetStatisticById } from "../../../../requests/admin/AdminStatisticRequest";
import { Box, Button, Card, CardContent, CardHeader, CircularProgress } from "@mui/material";
import Grid from '@mui/material/Grid2';
import AnswerSheetContent from "./AnswerSheetContent";
import { TiArrowLeftThick } from "../../../../helpers/icons";
import { __ } from "@wordpress/i18n";

const QuizResultAnswerSheet = () => {
  const { statistic_ref_id, quiz_id } = useParams();
  const { data, isFetching } = GetStatisticById(quiz_id, statistic_ref_id);

  const colorCode = {
    button: "#13455b",
    timer: "#00f",
    answered: "#6ca54c",
    review: "#ffb800",
    answered_and_review: "#674787",
    correct: "#56AB2F",
    incorrect: "#FF6B6B",
    skipped: "#8f83f7",
    radio: "#0075ff",
    incorrect_number: "#f00",
    correct_number: "#6ca54c",
    overview_border: "#C3D1A3",
    overview_background: "#f8faf5",
    overview_button_border: "#CFCFCF",
    overview_button_background: "#fff",
    overview_button_text: "black",
    overview_button_active_text: "white",
    overview_button_active_border: "#7DB1D3",
    option_background: "#f8faf5",
    option_border: "#C3D1A3",
    hint_background: "#f8faf5",
    hint_border: "#C3D1A3",
    category_title: "#6451cd",
    leaderboard_header: "#9bbb59",
    leaderborad_text_background: "#f5faea",
  };

  return (
    <Box>
      <Grid
        container
        spacing={4}
        sx={{
          padding: 4,
        }}
      >
        <Grid size={{ xs: 12, lg: 12 }}>
          <Button
            variant="contained"
            startIcon={<TiArrowLeftThick />}
            size="medium"
            sx={{
              width: "fit-content",
            }}
            LinkComponent={Link}
            to={`/${quiz_id}/result`}
          >
            {__("Back", "acadlix")}
          </Button>
        </Grid>
        <Grid size={{ xs: 12, lg: 12 }}>
          <Card>
            <CardHeader title={__("AnswerSheet", "acadlix")} />
            <CardContent>
              {isFetching ?
                <CircularProgress color="inherit" size={20} />
                : (
                  <AnswerSheetContent
                    statistic={data?.data?.statistic}
                    colorCode={colorCode}
                    quiz={data?.data?.quiz}
                  />
                )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default QuizResultAnswerSheet;
