import React from 'react'
import { GetStatisticByStatisticId } from '../../../requests/front/FrontStatisticRequest';
import { Link, useParams } from 'react-router-dom';
import AnswerSheet from '../../../modules/answersheet/AnswerSheet';
import { Box, Button, Card, CardContent, CardHeader, CircularProgress } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { TiArrowLeftThick } from '../../../helpers/icons';
import { __ } from "@wordpress/i18n";

const ViewAnswersheet = () => {
    const { statistic_ref_id } = useParams();
    const { data, isFetching } = GetStatisticByStatisticId(statistic_ref_id);

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
                        to={`/result`}
                    >
                        {__("Back", "acadlix")}
                    </Button>
                </Grid>
                <Grid size={{ xs: 12, lg: 12 }}>
                    <Card>
                        <CardHeader 
                            title={__("AnswerSheet", "acadlix")} 
                            subheader={`${isFetching ? "" : data?.data?.quiz?.post_title}`}
                        />
                        <CardContent>
                            {isFetching ?
                                <CircularProgress color="inherit" size={20} />
                                : (
                                    (data?.data?.statistic_ref && !data?.data?.quiz?.rendered_metas?.quiz_settings?.hide_answer_sheet) ?
                                    <AnswerSheet
                                        statistic={data?.data?.statistic}
                                        colorCode={colorCode}
                                        quiz={data?.data?.quiz}
                                    />
                                    :
                                    __("You are not allowed to access this page.", "acadlix")
                                )}
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    )
}

export default ViewAnswersheet
