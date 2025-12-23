import React from 'react'
import { FormControlLabel, Radio } from '@mui/material'
import { __ } from '@wordpress/i18n'
import CustomFeatureElement from '@acadlix/components/CustomFeatureElement'

const NumericalOption = (props) => {
    return (
        <FormControlLabel
            disabled
            value="numerical"
            control={<Radio />}
            label={
                <CustomFeatureElement
                    element="text"
                    label={__("Numerical", "acadlix")}
                    iconsx={{
                        color: '#fff',
                    }}
                />
            }
        />
    )
}

export default NumericalOption