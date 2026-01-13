import React from 'react'
import { FormControlLabel, Radio } from '@mui/material'
import { __ } from '@wordpress/i18n'
import CustomFeatureElement from '@acadlix/components/CustomFeatureElement'

const AssessmentOption = (props) => {
    return (
        <FormControlLabel
            disabled
            value="assessment"
            control={<Radio />}
            label={<CustomFeatureElement 
                element="text"
                label={__("Assessment", "acadlix")}
                iconsx={{
                    color: '#fff',
                }}
            />}
        />
    )
}

export default AssessmentOption