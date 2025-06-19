import React from 'react'
import GridItem1 from "@acadlix/components/GridItem1";
import FormControlLabel from "@mui/material/FormControlLabel";
import CustomSwitch from "@acadlix/components/CustomSwitch";
import { __ } from "@wordpress/i18n";

const ClearResponseButton = (props) => {
    return (
        <GridItem1 size={{ xs: 12, sm: 6, lg: 3 }}>
            <FormControlLabel
                control={<CustomSwitch />}
                checked={props?.watch("meta.quiz_settings.show_clear_response_button") ?? false}
                onChange={(e) => {
                    props?.setValue(
                        "meta.quiz_settings.show_clear_response_button",
                        e?.target?.checked,
                        { shouldDirty: true }
                    );
                }}
                label={__("Activate", "acadlix")}
            />
        </GridItem1>
    )
}

export default ClearResponseButton