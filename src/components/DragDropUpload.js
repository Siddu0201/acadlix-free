import { Box, Button, IconButton, Typography } from '@mui/material';
import React from 'react';
import { __ } from '@wordpress/i18n';
import { IoClose } from '@acadlix/helpers/icons';

/**
 * DragDropUpload - Reusable drag & drop file upload component
 *
 * Props:
 *   files: array of selected files (for controlled usage, optional)
 *   onFiles: function(files[]) - called when files are selected/dropped
 *   accept: string (e.g. '.docx,.pdf,image/*')
 *   multiple: boolean (allow multiple files)
 *   sx: object (custom Box styles)
 *   buttonLabel: string (custom button text)
 *   placeholder: string (custom placeholder text)
 *   variant: 'default' | 'outlined' | 'filled' (design variant)
 */


const DragDropUpload = ({
    files = [],
    onFiles = null,
    accept = '', // now can be array or string
    multiple = false,
    sx = {},
    buttonLabel = __('Select File(s)', 'acadlix'),
    placeholder = __('Please select or drag file(s) to upload', 'acadlix'),
    maxFileSize = null, // in bytes
}) => {
    const inputRef = React.useRef();
    const [dragActive, setDragActive] = React.useState(false);
    const [selectedFiles, setSelectedFiles] = React.useState(files);
    const [fileSizeError, setFileSizeError] = React.useState('');

    // Convert accept to string if array
    const acceptArr = Array.isArray(accept) ? accept : (typeof accept === 'string' && accept ? accept.split(',').map(s => s.trim()) : []);
    const acceptStr = Array.isArray(accept) ? accept.join(',') : accept;

    React.useEffect(() => {
        if (Array.isArray(files) && files.length !== selectedFiles.length) {
            setSelectedFiles(files);
        }
    }, [files]);

    const removeFile = (fileToRemove) => {
        const updatedFiles = selectedFiles.filter(file => file !== fileToRemove);
        setSelectedFiles(updatedFiles);
        onFiles && onFiles(updatedFiles);
    }

    const filterBySize = (files) => {
        if (!maxFileSize) return files;
        const filtered = files.filter(file => file.size <= maxFileSize);
        if (filtered.length < files.length) {
            setFileSizeError(__('Some files were too large and not accepted.', 'acadlix'));
        } else {
            setFileSizeError('');
        }
        return filtered;
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setDragActive(false);
        let droppedFiles = Array.from(e.dataTransfer.files);
        if (acceptArr.length > 0) {
            droppedFiles = droppedFiles.filter(file => fileMatchesAccept(file, acceptArr));
        }
        droppedFiles = filterBySize(droppedFiles);
        if (!multiple) droppedFiles = droppedFiles.slice(0, 1);
        setSelectedFiles(droppedFiles);
        onFiles && onFiles(droppedFiles);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        setDragActive(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        setDragActive(false);
    };

    const handleFileChange = (e) => {
        let inputFiles = Array.from(e.target.files);
        if (acceptArr.length > 0) {
            inputFiles = inputFiles.filter(file => fileMatchesAccept(file, acceptArr));
        }
        inputFiles = filterBySize(inputFiles);
        if (!multiple) inputFiles = inputFiles.slice(0, 1);
        setSelectedFiles(inputFiles);
        onFiles && onFiles(inputFiles);
    };

    // Helper to check file against accept array
    function fileMatchesAccept(file, acceptArr) {
        if (!acceptArr || acceptArr.length === 0) return true;
        return acceptArr.some(type => {
            if (type.startsWith('.')) return file.name.endsWith(type);
            if (type.endsWith('/*')) return file.type.startsWith(type.replace('/*', ''));
            return file.type === type;
        });
    }

    return (
        <Box
            sx={{
                width: { xs: '90%', sm: '70%', md: '60%' },
                minHeight: 120,
                border: "2px dotted blue",
                paddingY: 4,
                paddingX: 1,
                backgroundColor: dragActive ? "#d0d1ff" : "#eaebff",
                marginY: 4,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 2,
                transition: 'background 0.2s',
                ...sx,
            }}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDragEnd={handleDragLeave}
            onDragEnter={handleDragOver}
        >
            <input
                ref={inputRef}
                id="file-upload"
                type="file"
                accept={acceptStr}
                multiple={multiple}
                style={{ display: 'none' }}
                onChange={handleFileChange}
            />
            <label htmlFor="file-upload">
                <Button variant="contained" color="primary" component="span">
                    {buttonLabel}
                </Button>
            </label>
            {fileSizeError && (
                <Typography variant="caption" color="error" sx={{ mt: 1 }}>
                    {fileSizeError}
                </Typography>
            )}
            {(!selectedFiles || selectedFiles.length === 0) && (
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        textAlign: 'center',
                    }}
                >
                    <Typography
                        variant="body1"
                        sx={{ margin: '10px 0px 2px 0px' }}
                    >
                        {placeholder}
                    </Typography>
                    {
                        acceptArr.length > 0 && (
                            <Typography variant="caption" color="textSecondary">
                                {__('Accepted file types:', 'acadlix')} {acceptArr.join(', ')}
                            </Typography>
                        )
                    }
                    {maxFileSize && (
                        <Typography variant="caption" color="textSecondary">
                            {__('Max file size:', 'acadlix')} {Math.round(maxFileSize / 1024 )} KB
                        </Typography>
                    )}
                </Box>
            )}
            {selectedFiles && selectedFiles.length > 0 && (
                <Box sx={{ width: '100%' }}>
                    {selectedFiles.map((file, idx) => (
                        <Typography key={idx} variant="body2" sx={{ marginTop: 1 }}>
                            {__('Selected file', 'acadlix')}: <b>{file.name}</b> ({Math.round(file.size / 1024)} KB)
                            <IconButton
                                color='error'
                                onClick={removeFile.bind(null, file)}
                            >
                                <IoClose />
                            </IconButton>
                        </Typography>
                    ))}
                </Box>
            )}
        </Box>
    );
};

export default DragDropUpload;