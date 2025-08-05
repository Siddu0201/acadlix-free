import React from 'react';
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import { __ } from '@wordpress/i18n';

const CustomLetterSpacing = ({ name, ...props }) => {
    const letterSpacings = getLetterSpacingOptions();

    return (
        <FormControl fullWidth>
            <InputLabel id="letter-spacing">{__('Letter Spacing', 'acadlix')}</InputLabel>
            <Select
                size="small"
                labelId="letter-spacing"
                id="letter-spacing"
                value={props?.watch(name)}
                label={__('Letter Spacing', 'acadlix')}
                onChange={(e) => props?.setValue(name, e.target.value, { shouldDirty: true })}
            >
                {letterSpacings.map((item) => (
                    <MenuItem key={item.value} value={item.value}>
                        {item.label}
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    );
};

const getLetterSpacingOptions = () => {
    const options = [];
    const start = -2.0;
    const end = 2.0;
    const step = 0.1;

    for (let i = 0; i <= (end - start) / step; i++) {
        const value = (start + i * step).toFixed(1);
        options.push({
            label: `${value}px`,
            value: `${value}px`,
        });
    }

    return options;
};

export default CustomLetterSpacing;
