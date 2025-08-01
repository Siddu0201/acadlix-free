import { Box, Button, ClickAwayListener, Fade, IconButton, Paper, Popper, Typography } from '@mui/material';
import React from 'react'
import { SketchPicker } from 'react-color';

const CustomColorPicker = ({ 
    name = '',
    ...props
}) => {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [open, setOpen] = React.useState(false);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
        setOpen((prev) => !prev);
    };

    return (
        <>
            <IconButton
                sx={{
                    width: 40,
                    height: 40,
                    borderRadius: 1,
                    border: '1px solid #ccc',
                    backgroundColor: props?.watch(name),
                    '&:hover, &:focus': {
                        backgroundColor: props?.watch(name),
                        boxShadow: (theme) => theme.shadows[3],
                    },
                }}
                onClick={handleClick}
            />

            <Popper
                // Note: The following zIndex style is specifically for documentation purposes and may not be necessary in your application.
                sx={{ zIndex: 1200 }}
                open={open}
                anchorEl={anchorEl}
                placement="bottom"
                transition
            >
                {({ TransitionProps }) => (
                    <Fade {...TransitionProps} timeout={350}>
                        <Box>
                            <ClickAwayListener onClickAway={() => setOpen(false)}>
                                <Paper>
                                    <SketchPicker
                                        color={props?.watch(name)}
                                        onChange={(color) => {
                                            props?.setValue(name, `rgba(${color.rgb.r}, ${color.rgb.g}, ${color.rgb.b}, ${color.rgb.a})`, { shouldDirty: true })
                                        }}
                                    />
                                </Paper>
                            </ClickAwayListener>
                        </Box>
                    </Fade>
                )}
            </Popper>
        </>
    )
}

export default CustomColorPicker