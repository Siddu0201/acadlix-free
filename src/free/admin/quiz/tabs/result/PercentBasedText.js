import React from 'react'
import GridItem1 from '@acadlix/components/GridItem1';
import FormControlLabel from '@mui/material/FormControlLabel';
import CustomSwitch from '@acadlix/components/CustomSwitch';
import { __ } from "@wordpress/i18n";

const PercentBasedText = (props) => {
    return (
        <GridItem1 size={{ xs: 12, lg: 3 }}>
            <FormControlLabel
                control={
                    <CustomSwitch
                        checked={props?.watch("meta.quiz_settings.percent_based_result_text") ?? false}
                        onChange={(e) => {
                            props?.setValue(
                                "meta.quiz_settings.percent_based_result_text",
                                e?.target?.checked,
                                {
                                    shouldDirty: true,
                                }
                            );
                            if (e?.target?.checked) {
                                props?.setValue("meta.quiz_settings.result_text", [{ percent: 0, text: "" }], {
                                    shouldDirty: true,
                                });
                            } else {
                                props?.setValue("meta.quiz_settings.result_text", "", { shouldDirty: true });
                            }
                        }}
                    />
                }
                label={__("Activate", "acadlix")}
            />
        </GridItem1>
    )
}

export default PercentBasedText