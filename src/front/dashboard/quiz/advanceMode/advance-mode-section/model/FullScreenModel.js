import { Box, Button, Dialog, DialogContent, styled, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react'
import { __ } from "@wordpress/i18n";

const FullScreenModel = (props) => {
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [showModal, setShowModal] = useState(false);

    const handleFullscreen = () => {
        const element = document.documentElement; // Fullscreen mode ke liye poore document ko target karein
        if (element.requestFullscreen) {
            element.requestFullscreen();
        }
        setIsFullscreen(true);
        setShowModal(false);
    };

    const checkFullscreen = () => {
        if (!document.fullscreenElement) {
            setIsFullscreen(false);
            setShowModal(true);
        }
    };

    useEffect(() => {
        document.addEventListener("fullscreenchange", checkFullscreen);
        return () => {
            document.removeEventListener("fullscreenchange", checkFullscreen);
        };
    }, []);

    const BootstrapDialog = styled(Dialog)(({ theme }) => ({
        "& .MuiDialogContent-root": {
            padding: theme.spacing(2),
        },
        "& .MuiDialogActions-root": {
            padding: theme.spacing(1),
        },
    }));

    return (
        <BootstrapDialog
            maxWidth={props?.isDesktop ? "lg" : "xs"}
            open={showModal}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogContent>
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        flexDirection: "column",
                        gap: 6,
                        padding: 6,
                    }}
                >
                    <Typography>
                        {__("Please click here to fullscreen.", "acadlix")}
                    </Typography>
                    <Button variant='contained' onClick={handleFullscreen}>Fullscreen</Button>  
                </Box>
            </DialogContent>
        </BootstrapDialog>
    )
}

export default FullScreenModel
