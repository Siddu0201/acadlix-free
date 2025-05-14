import React from 'react'
import Grid from '@mui/material/Grid2';
import { Card, CardContent, Typography } from '@mui/material';
import { __ } from '@wordpress/i18n';

const InstructionSection = (props) => {
    const loadPage = () => {
        props?.loadEditor("post_content", "post_content");
    }

    React.useEffect(() => {
        loadPage();
        window.addEventListener("load", loadPage);

        return () => {
            props?.removeEditor("post_content");
            window.removeEventListener("load", loadPage);
        };
    }, []);

    return (
        <Grid size={{ xs: 12, sm: 12 }}>
            <Card>
                <CardContent>
                    <Grid
                        container
                        spacing={4}
                        sx={{
                            color: "black",
                        }}
                    >
                        <Grid size={{ xs: 12, sm: 12 }}>
                            <Typography variant="h6">{__("Instruction", "acadlix")}</Typography>
                        </Grid>
                        <Grid size={{ xs: 12, sm: 12 }}>
                            <textarea
                                id="post_content"
                                style={{
                                    width: "100%",
                                }}
                                value={props?.watch("post_content") ?? ""}
                                onChange={(e) => {
                                    let value = e?.target?.value;
                                    if (window?.tinymce) {
                                        const editor = window.tinymce.get("post_content");
                                        if (editor && editor.getContent() !== value) {
                                            editor.setContent(value || "");
                                        }
                                    }
                                    props.setValue("post_content", value, {
                                        shouldDirty: true,
                                    });
                                }}
                            />
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>
        </Grid>
    )
}

export default InstructionSection