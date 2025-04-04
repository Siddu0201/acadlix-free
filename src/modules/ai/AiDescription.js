import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    Grid2,
    IconButton,
    InputLabel,
    MenuItem,
    Select,
    styled,
    TextField,
    Typography,
    useMediaQuery,
    useTheme
} from '@mui/material'
import React from 'react'
import { __ } from '@wordpress/i18n'
import { IoClose } from '../../helpers/icons';
import PropTypes from 'prop-types';
import { PostGenerateDescription, PostImproveDescription } from '../../requests/ai/AiCommonRequest';
import toast from 'react-hot-toast';
import CustomTypography from '../../components/CustomTypography';
import CustomTextField from '../../components/CustomTextField';
import { RawHTMl } from "@wordpress/element";

const AiDescription = ({
    title = '',
    description = '',
    type = 'quiz',
    handleAddDescription = null,
    language = '',
}) => {
    const [open, setOpen] = React.useState(false);
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

    const handleOpen = () => {
        if (!title) {
            toast.error(__("Please enter title", "acadlix"));
            return
        }
        setOpen(true);
    }

    const handleClose = () => {
        setOpen(false);
    };

    const BootstrapDialog = styled(Dialog)(({ theme }) => ({
        "& .MuiDialogContent-root": {
            padding: theme.spacing(2),
        },
        "& .MuiDialogActions-root": {
            padding: theme.spacing(1),
        },
        "& .MuiPaper-root": {
            width: "100%",
        },
    }));

    return (
        <>
            <BootstrapDialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                fullScreen={fullScreen}
            // maxWidth="md"
            >
                <DescriptionModel
                    handleClose={handleClose}
                    handleOpen={handleOpen}
                    title={title}
                    description={description}
                    type={type}
                    handleAddDescription={handleAddDescription}
                    language={language}
                />
            </BootstrapDialog>
            <Button
                aria-label="ai"
                size='small'
                variant='contained'
                color='primary'
                onClick={handleOpen}
            >
                Generate From AI
            </Button>
        </>
    )
}

AiDescription.prototype = {
    title: PropTypes.string,
    description: PropTypes.string,
    type: PropTypes.string,
    handleAddDescription: PropTypes.func,
    language: PropTypes.string
};

export default AiDescription

const DescriptionModel = ({
    handleClose = null,
    handleOpen = null,
    title = '',
    description = '',
    type = 'quiz',
    language = '',
    handleAddDescription = null,
}) => {
    const [minWords, setMinWords] = React.useState(250);
    const [maxWords, setMaxWords] = React.useState(500);
    const [level, setLevel] = React.useState("All Level");
    const [tone, setTone] = React.useState("Formal & Professional");
    const [prompt, setPrompt] = React.useState("");
    const [response, setResponse] = React.useState("");

    const generateMutation = PostGenerateDescription();
    const handleGenerateDescription = () => {

        if (!title) {
            toast.error(__("Please enter title", "acadlix"));
            return
        }
        setResponse("");
        const data = {
            title: title,
            prompt: prompt,
            type: type,
            min_words: minWords,
            max_words: maxWords,
            level: level,
            tone: tone,
            language: language
        };
        generateMutation.mutate(data, {
            onSuccess: (data) => {
                setResponse(data?.data?.description);
            },
            onError: (error) => {
                toast.error(error?.response?.data?.message);
            }
        });

    }

    const improveMutation = PostImproveDescription();
    const handleImproveDescription = () => {

    }

    return (
        <>
            <DialogTitle id="alert-dialog-title">
                {__("Generate Quiz Description From AI", "acadlix")}
            </DialogTitle>
            <IconButton
                aria-label="close"
                onClick={handleClose}
                sx={{
                    position: "absolute",
                    right: 8,
                    top: 8,
                    color: (theme) => theme.palette.grey[500],
                }}
            >
                <IoClose />
            </IconButton>
            <DialogContent sx={{
                marginX: 2
            }}>
                <Grid2
                    container
                    spacing={4}>
                    <Grid2 size={{ xs: 12, lg: 12 }}>
                        <Grid2 container spacing={2}>

                            <Grid2 size={{ xs: 12, lg: 3 }}>
                                <CustomTypography>
                                    {__("Min. Words", "acadlix")}
                                </CustomTypography>
                            </Grid2>
                            <Grid2 size={{ xs: 12, lg: 3 }}>
                                <CustomTextField
                                    fullWidth
                                    placeholder={__("Min. Words", "acadlix")}
                                    size="small"
                                    type="number"
                                    value={minWords}
                                    onChange={(e) => {
                                        setMinWords(e.target.value);
                                    }}
                                    sx={{
                                        "& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button":
                                        {
                                            display: "none",
                                        },
                                        "& input[type=number]": {
                                            MozAppearance: "textfield",
                                        },
                                    }}
                                    inputProps={{
                                        sx: {
                                            border: `0 !important`,
                                            boxShadow: `none !important`,
                                            minHeight: `auto !important`,
                                        },
                                    }}
                                />
                            </Grid2>
                            <Grid2 size={{ xs: 12, lg: 3 }}>
                                <CustomTypography>
                                    {__("Max. Words", "acadlix")}
                                </CustomTypography>
                            </Grid2>
                            <Grid2 size={{ xs: 12, lg: 3 }}>
                                <CustomTextField
                                    fullWidth
                                    placeholder={__("Min. Words", "acadlix")}
                                    size="small"
                                    type="number"
                                    value={maxWords}
                                    onChange={(e) => {
                                        setMaxWords(e.target.value);
                                    }}
                                    sx={{
                                        "& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button":
                                        {
                                            display: "none",
                                        },
                                        "& input[type=number]": {
                                            MozAppearance: "textfield",
                                        },
                                    }}
                                    inputProps={{
                                        sx: {
                                            border: `0 !important`,
                                            boxShadow: `none !important`,
                                            minHeight: `auto !important`,
                                        },
                                    }}
                                />
                            </Grid2>
                            <Grid2 size={{ xs: 12, lg: 3 }}>
                                <CustomTypography>
                                    {__("Level", "acadlix")}
                                </CustomTypography>
                            </Grid2>
                            <Grid2 size={{ xs: 12, lg: 3 }}>
                                <FormControl fullWidth size="small">
                                    <InputLabel id="demo-simple-select-label">
                                        {__("Level", "acadlix")}
                                    </InputLabel>
                                    <Select
                                        labelId="demo-simple-select-label"
                                        id="demo-simple-select"
                                        value={level}
                                        label={__("Level", "acadlix")}
                                        onChange={(e) => {
                                            setLevel(e.target.value);
                                        }}
                                    >
                                        <MenuItem value="All Level">{__("All Level", "acadlix")}</MenuItem>
                                        <MenuItem value="Beginner">{__("Beginner", "acadlix")}</MenuItem>
                                        <MenuItem value="Intermediate">{__("Intermediate", "acadlix")}</MenuItem>
                                        <MenuItem value="Advanced">{__("Advanced", "acadlix")}</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid2>
                            <Grid2 size={{ xs: 12, lg: 3 }}>
                                <CustomTypography>
                                    {__("Tone", "acadlix")}
                                </CustomTypography>
                            </Grid2>
                            <Grid2 size={{ xs: 12, lg: 3 }}>
                                <FormControl fullWidth size="small">
                                    <InputLabel id="demo-simple-select-label">
                                        {__("Tone", "acadlix")}
                                    </InputLabel>
                                    <Select
                                        labelId="demo-simple-select-label"
                                        id="demo-simple-select"
                                        value={tone}
                                        label={__("Tone", "acadlix")}
                                        onChange={(e) => {
                                            setTone(e.target.value);
                                        }}
                                    >
                                        <MenuItem value="Formal & Professional">{__("Formal & Professional", "acadlix")}</MenuItem>
                                        <MenuItem value="Conversational & Friendly" > {__("Conversational & Friendly", "acadlix")}</MenuItem>
                                        <MenuItem value="Persuasive & Sales-Oriented">{__("Persuasive & Sales-Oriented", "acadlix")}</MenuItem>
                                        <MenuItem value="Storytelling & Creative">{__("Storytelling & Creative", "acadlix")}</MenuItem>
                                        <MenuItem value="Inspiring & Motivational">{__("Inspiring & Motivational", "acadlix")}</MenuItem>
                                        <MenuItem value="Humorous & Witty">{__("Humorous & Witty", "acadlix")}</MenuItem>
                                        <MenuItem value="Technical & Precise">{__("Technical & Precise", "acadlix")}</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid2>
                        </Grid2>
                    </Grid2>
                    <Grid2 size={{ xs: 12, lg: 12 }}>
                        <TextField
                            fullWidth
                            multiline
                            rows={4}
                            label={__("Prompt (Optional)", "acadlix")}
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            slotProps={{
                                htmlInput: {
                                    sx: {
                                        border: `0 !important`,
                                        boxShadow: `none !important`,
                                        minHeight: `auto !important`,
                                    },
                                }
                            }}
                        />
                    </Grid2>
                    <Grid2 size={{ xs: 12, lg: 12 }}>
                        <Box sx={{
                            display: "flex",
                            gap: 2,
                            alignItems: "center"
                        }}>
                            <Button
                                variant="contained"
                                color="primary"
                                loading={generateMutation.isPending}
                                onClick={handleGenerateDescription}
                            >
                                {__("Generate", "acadlix")}
                            </Button>
                            {/* <Button
                                variant="contained"
                                color="secondary"
                                loading={improveMutation.isPending}
                                onClick={handleImproveDescription}
                            >
                                {__("Improve", "acadlix")}
                            </Button> */}
                        </Box>
                    </Grid2>
                    <Grid2 size={{ xs: 12, lg: 12 }}>
                        <Typography variant='h6'>{__('Response', 'acadlix')}</Typography>
                        <Typography variant="body1" component="div">
                            {
                                (generateMutation?.isPending || improveMutation?.isPending) ?
                                    __('Generating...', 'acadlix') :
                                    <RawHTML>{response}</RawHTML>
                            }
                        </Typography>
                        {
                            response &&
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={() => {
                                    handleAddDescription(response)
                                    handleClose()
                                }}
                            >
                                {__("Add", "acadlix")}
                            </Button>
                        }
                    </Grid2>
                </Grid2>
            </DialogContent>
            <DialogActions>
                <Button
                    variant="contained"
                    color="error"
                    onClick={handleClose}
                    autoFocus
                >
                    {__("Close", "acadlix")}
                </Button>
            </DialogActions>
        </>
    )
}

DescriptionModel.prototype = {
    handleClose: PropTypes.func,
    handleOpen: PropTypes.func,
    title: PropTypes.string,
    description: PropTypes.string,
    type: PropTypes.string,
    handleAddDescription: PropTypes.func,
    language: PropTypes.string
}
