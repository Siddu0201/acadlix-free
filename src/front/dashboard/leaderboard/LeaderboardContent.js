import { Alert } from '@mui/material';
import React from 'react'
import { useForm } from 'react-hook-form';
import { __, sprintf } from '@wordpress/i18n';
import LeaderboardSection from '../quiz/normalMode/normal-quiz-section/LeaderboardSection';

const LeaderboardContent = (props) => {
    const baseSettings = {
        id: props?.quiz?.ID,
        title: props?.quiz?.post_title,
        leaderboard: Boolean(Number(props?.quiz?.rendered_metas?.quiz_settings?.leaderboard)),
        leaderboard_total_number_of_entries:
            props?.quiz?.rendered_metas?.quiz_settings?.leaderboard_total_number_of_entries, // 0 => all,
        toplist: [...props?.toplist],
        toplist_count: props?.toplist_count || 0,
    };

    const filteredDefaults = window?.acadlixHooks?.applyFilters(
        "acadlix.front.leaderboard.defaultValues",
        baseSettings,
        {
            quiz: props?.quiz,
            toplist: props?.toplist,
            toplist_count: props?.toplist_count,
        }
    ) ?? baseSettings;

    const methods = useForm({
        defaultValues: filteredDefaults,
    });

    if (process.env.REACT_APP_MODE === 'development') {
        console?.log(methods?.watch());
    }
    if (!methods?.watch("leaderboard")) {
        return <Alert severity="info">
            {
                sprintf(
                    /* translators: %s - quiz title */
                    __("Leaderboard is disabled for this quiz (%s).", "acadlix"),
                    methods?.watch("title")
                )
            }
        </Alert>;
    }
    return (
        <LeaderboardSection
            {...methods}
            {...props}
            via_shortcode={true}
        />
    )
}

export default LeaderboardContent