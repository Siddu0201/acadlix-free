import React from 'react'
import CustomTextField from '@acadlix/components/CustomTextField';
import { __ } from "@wordpress/i18n";

const OpenAiOption = (props) => {
    return (
        <CustomTextField
            fullWidth
            size="small"
            disabled
            label={__("Enter OpenAI API Key", "acadlix")}
            // value={props?.watch("acadlix_openai_api_key")}
            // onChange={(e) => {
            //     props?.setValue("acadlix_openai_api_key", e?.target?.value, {
            //         shouldDirty: true,
            //     });
            // }}
        />
    )
}

export default OpenAiOption