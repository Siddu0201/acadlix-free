import React from 'react';
import PropTypes from 'prop-types';
import { Autocomplete, TextField } from '@mui/material';
import { __ } from '@wordpress/i18n';

// Default common mime types
const DEFAULT_MIME_TYPES = [
    { extension: 'pdf', label: 'PDF' },
    { extension: 'doc', label: 'Word' },
    { extension: 'docx', label: 'Word' },
    { extension: 'xls', label: 'Excel' },
    { extension: 'xlsx', label: 'Excel' },
    { extension: 'txt', label: 'Text' },
    { extension: 'ppt', label: 'PowerPoint' },
    { extension: 'pptx', label: 'PowerPoint' },
    { extension: 'jpeg', label: 'Images' },
    { extension: 'jpg', label: 'Images' },
    { extension: 'png', label: 'Images' },
];

/**
 * MimeAutocomplete - Reusable component for selecting allowed mime types/extensions
 *
 * @param {Array} mimeTypes - Additional or custom mime types [{extension, label}]
 * @param {Array} value - Selected mime types (controlled)
 * @param {Function} onChange - Callback when selection changes
 * @param {String} label - Field label
 * @param {String} placeholder - Field placeholder
 * @param {Boolean} multiple - Allow multiple selection
 * @param {Object} textFieldProps - Extra props for TextField
 * @param {Object} autocompleteProps - Extra props for Autocomplete
 */
const MimeAutocomplete = ({
    mimeTypes = [],
    value = [],
    onChange,
    label = __('Allowed Mime Type(s)', 'acadlix'),
    placeholder = __('Select Mime Type(s)', 'acadlix'),
    multiple = true,
    textFieldProps = {},
    autocompleteProps = {},
    ...rest
}) => {
    // Merge and deduplicate by extension
    const allMimeTypes = React.useMemo(() => {
        const map = new Map();
        [...DEFAULT_MIME_TYPES, ...mimeTypes].forEach((item) => {
            if (item && item.extension) {
                map.set(item.extension, { ...item });
            }
        });
        return Array.from(map.values());
    }, [mimeTypes]);

    return (
        <Autocomplete
            size="small"
            fullWidth
            multiple={multiple}
            id="mime-types"
            options={allMimeTypes}
            value={value}
            onChange={(e, newValue) => onChange && onChange(newValue)}
            getOptionLabel={(option) => `${option.label} (.${option.extension})`}
            disableCloseOnSelect={multiple}
            filterSelectedOptions
            isOptionEqualToValue={(option, val) => option?.extension === val?.extension}
            renderInput={(params) => (
                <TextField
                    {...params}
                    variant="outlined"
                    label={label}
                    placeholder={placeholder}
                    autoComplete="off"
                    {...textFieldProps}
                />
            )}
            {...autocompleteProps}
            {...rest}
        />
    );
};

MimeAutocomplete.propTypes = {
    mimeTypes: PropTypes.arrayOf(
        PropTypes.shape({
            extension: PropTypes.string.isRequired,
            label: PropTypes.string.isRequired,
        })
    ),
    value: PropTypes.array,
    onChange: PropTypes.func,
    label: PropTypes.string,
    placeholder: PropTypes.string,
    multiple: PropTypes.bool,
    textFieldProps: PropTypes.object,
    autocompleteProps: PropTypes.object,
};

export default MimeAutocomplete;