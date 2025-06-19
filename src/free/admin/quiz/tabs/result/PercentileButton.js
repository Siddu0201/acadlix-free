import React from 'react'
import GridItem1 from '@acadlix/components/GridItem1';
import FormControlLabel from '@mui/material/FormControlLabel';
import CustomSwitch from '@acadlix/components/CustomSwitch';
import { __ } from "@wordpress/i18n";

const PercentileButton = (props) => {
    return (
        <GridItem1 size={{ xs: 12, sm: 6, lg: 3 }}>
            <FormControlLabel
                control={
                    <CustomSwitch />
                }
                checked={props?.watch("meta.quiz_settings.show_percentile") ?? false}
                onChange={(e) => {
                    props?.setValue("meta.quiz_settings.show_percentile", e?.target?.checked, {
                        shouldDirty: true,
                    });
                }}
                label={__("Activate", "acadlix")}
                disabled={
                    props?.watch("meta.quiz_settings.hide_result")
                    // ||
                    // (props?.watch("meta.mode") === "advance_mode" &&
                    //   props?.watch("meta.advance_mode_type") !== "advance_panel") 
                    ||
                    !props?.watch("meta.quiz_settings.save_statistic")
                }
            />
        </GridItem1>
    )
}

export default PercentileButton