import React from 'react'
import { FormControlLabel, Radio } from '@mui/material'
import { __ } from '@wordpress/i18n'

const RangeTypeOption = (props) => {
    return (
        <FormControlLabel
            value="rangeType"
            control={<Radio />}
            label={__("Range Type", "acadlix")}
        />
    )
}

export default RangeTypeOption