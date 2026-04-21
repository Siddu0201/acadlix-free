import React from 'react'
import { __ } from "@wordpress/i18n";
import PasswordTextField from '@acadlix/components/PasswordTextField';

const OpenAiOption = (props) => {
  return (
    <PasswordTextField
      fullWidth
      size="small"
      label={__("Enter OpenAI API Key", "acadlix")}
      value={props?.watch("acadlix_openai_api_key")}
      onChange={(e) => {
        props?.setValue("acadlix_openai_api_key", e?.target?.value, {
          shouldDirty: true,
        });
      }}
    />
  )
}

export default OpenAiOption