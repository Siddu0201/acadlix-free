import { FormControl, InputLabel, MenuItem, Select } from '@mui/material'
import React from 'react'
import { __ } from '@wordpress/i18n'

const CustomFontWeight = ({
    name,
    ...props
}) => {
    return (
        <FormControl fullWidth>
            <InputLabel id="font-weight">{__('Font Weight', 'acadlix')}</InputLabel>
            <Select
                size='small'
                labelId="font-weight"
                id="font-weight"
                value={props?.watch(name)}
                label={__('Font Weight', 'acadlix')}
                onChange={(e) => props?.setValue(name, e.target.value, { shouldDirty: true })}
            >
                <MenuItem value="100">100</MenuItem>
                <MenuItem value="200">200</MenuItem>
                <MenuItem value="300">300</MenuItem>
                <MenuItem value="400">400</MenuItem>
                <MenuItem value="500">500</MenuItem>
                <MenuItem value="600">600</MenuItem>
                <MenuItem value="700">700</MenuItem>
                <MenuItem value="800">800</MenuItem>
                <MenuItem value="900">900</MenuItem>
            </Select>
        </FormControl>
    )
}

export default CustomFontWeight