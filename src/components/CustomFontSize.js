import { useTheme } from '@emotion/react';
import React from 'react'
import { 
    FormControl, 
    InputLabel, 
    MenuItem, 
    Select 
} from '@mui/material'
import { __ } from '@wordpress/i18n'

const CustomFontSize = ({
    name,
    ...props
}) => {
    const theme = useTheme();
    const getFontSize = () => Array.from({ length: 96 }, (_, i) => i + 5);

    return (
        <FormControl fullWidth>
            <InputLabel id="font-size">{__('Font Size', 'acadlix')}</InputLabel>
            <Select
                size='small'
                labelId="font-size"
                id="font-size"
                value={props?.watch(name)}
                label={__('Font Weight', 'acadlix')}
                onChange={(e) => props?.setValue(name, e.target.value, { shouldDirty: true })}
            >
                {
                    getFontSize().map((item) => (
                        <MenuItem key={item} value={theme.typography.pxToRem(item)}>{`${item}px`}</MenuItem>
                    ))
                }
            </Select>
        </FormControl>
    )
}

export default CustomFontSize