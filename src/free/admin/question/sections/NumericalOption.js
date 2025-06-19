import React from 'react'
import { FormControlLabel, Radio } from '@mui/material'
import { __ } from '@wordpress/i18n'

const NumericalOption = (props) => {
    return (
        <FormControlLabel
            disabled
            value="numerical"
            control={<Radio />}
            label={__("Numerical", "acadlix")}
        />
    )
}

export default NumericalOption