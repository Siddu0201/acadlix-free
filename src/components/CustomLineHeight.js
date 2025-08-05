import { useTheme } from '@emotion/react';
import React from 'react'
import {
    FormControl,
    InputLabel,
    MenuItem,
    Select
} from '@mui/material'
import { __ } from '@wordpress/i18n'

const CustomLineHeight = ({ name, ...props }) => {
    const theme = useTheme();
    const generateLineHeightOptions = () => {
        const options = [];
        for (let i = 1; i <= 2; i += 0.05) {
            // Round to two decimal places to avoid floating-point issues
            const value = parseFloat(i.toFixed(2));
            const label = `${Math.round(value * 100)}%`;
            options.push({ label, value });
        }
        return options;
    };

    return (
        <FormControl fullWidth>
            <InputLabel id="line-height">{__('Line Height', 'acadlix')}</InputLabel>
            <Select
                size='small'
                labelId="line-height"
                id="line-height"
                value={props?.watch(name)}
                label={__('Line Height', 'acadlix')}
                onChange={(e) => props?.setValue(name, e.target.value, { shouldDirty: true })}
            >
                {
                    generateLineHeightOptions().map((item) => (
                        <MenuItem key={item.value} value={item.value}>{item.label}</MenuItem>
                    ))
                }
            </Select>
        </FormControl>
    )
}

export default CustomLineHeight