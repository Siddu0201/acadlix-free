import React from 'react'
import { FormControlLabel, Radio } from '@mui/material'
import { __ } from '@wordpress/i18n'
import CustomFeatureElement from '@acadlix/components/CustomFeatureElement'

const RangeTypeOption = (props) => {
    return (
        <FormControlLabel
            disabled
            value="rangeType"
            control={<Radio />}
            label={<CustomFeatureElement 
                element="text"
                label={__("Range Type", "acadlix")}
                iconsx={{
                    color: '#fff',
                }}
            />}
        />
    )
}

export default RangeTypeOption