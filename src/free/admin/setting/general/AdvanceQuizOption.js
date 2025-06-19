import React from 'react'
import Grid from '@mui/material/Grid2';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import CircularProgress from '@mui/material/CircularProgress';
import toast from 'react-hot-toast';
import { __ } from '@wordpress/i18n';
import { PostCreatePage } from "@acadlix/requests/admin/AdminSettingRequest";

const AdvanceQuizOption = (props) => {
    const [quizInput, setQuizInput] = React.useState("");
    const createPageMutation = PostCreatePage();
    return (
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
            <Autocomplete
                size="small"
                disabled
                // value={
                //     props?.watch("acadlix_advance_quiz_page_id") !== null
                //         ? props?.pages?.find(
                //             (p) =>
                //                 p?.ID ===
                //                 Number(props?.watch("acadlix_advance_quiz_page_id"))
                //         )
                //         : null
                // }
                options={props?.pages?.length > 0 ? props?.pages : []}
                getOptionLabel={(option) =>
                    `${option?.post_title} (#${option?.ID})` || ""
                }
                isOptionEqualToValue={(option, value) => {
                    return option?.ID === value?.ID;
                }}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        label={__("Select Advance Quiz Page", "acadlix")}
                        inputProps={{
                            ...params.inputProps,
                            autoComplete: "spoc_gender",
                        }}
                        InputProps={{
                            ...params.InputProps,
                            endAdornment: (
                                <React.Fragment>
                                    {quizInput !== "" && createPageMutation?.isPending ? (
                                        <CircularProgress color="inherit" size={20} />
                                    ) : null}
                                    {params.InputProps.endAdornment}
                                </React.Fragment>
                            ),
                        }}
                        onChange={(e) => setQuizInput(e.target.value)}
                    />
                )}
                onChange={(_, newValue) => {
                    props?.setValue(
                        "acadlix_advance_quiz_page_id",
                        newValue?.ID ?? null,
                        {
                            shouldDirty: true,
                        }
                    );
                }}
                PaperComponent={(data) => {
                    return (
                        <Paper>
                            {data?.children}
                            <Button
                                color="primary"
                                fullWidth
                                sx={{ justifyContent: "flex-start", pl: 2 }}
                                onMouseDown={(e) => {
                                    if (quizInput === "") {
                                        toast.error(__("Title cannot be empty.", "acadlix"));
                                        return;
                                    }
                                    createPageMutation?.mutate(
                                        {
                                            title: quizInput,
                                            user_id: acadlixOptions?.user_id,
                                        },
                                        {
                                            onSuccess: (data) => {
                                                props?.setPages(data?.data?.all_pages);
                                                props?.setValue(
                                                    "acadlix_advance_quiz_page_id",
                                                    data?.data?.page_id,
                                                    { shouldDirty: true }
                                                );
                                            },
                                        }
                                    );
                                }}
                            >
                                + {__("Add New", "acadlix")}
                            </Button>
                        </Paper>
                    );
                }}
            />
        </Grid>
    )
}

export default AdvanceQuizOption