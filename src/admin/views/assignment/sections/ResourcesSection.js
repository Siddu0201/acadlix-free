import React from 'react'
import { Box, Button, Card, CardContent, Divider, FormControl, InputLabel, MenuItem, Select, Typography } from '@mui/material'
import Grid from '@mui/material/Grid2';
import { __ } from '@wordpress/i18n';
import CustomTextField from '../../../../components/CustomTextField';
import { MediaUpload } from "@wordpress/media-utils";

const ResourcesSection = (props) => {
    const handleAddResoures = () => {
        props?.setValue(
            "meta.resources",
            [
                ...props?.watch("meta.resources"),
                {
                    title: "",
                    type: "upload",
                    filename: "",
                    file_url: "",
                    link: "",
                },
            ],
            { shouldDirty: true }
        );
    };

    return (
        <Grid size={{ xs: 12, sm: 12 }}>
            <Card>
                <CardContent>
                    <Box
                        sx={{
                            marginY: 2,
                        }}>
                        <Box sx={{ color: "black" }}>
                            <Typography variant="h6">{__("Resources", "acadlix")}</Typography>
                            <Divider />
                        </Box>
                    </Box>
                    <Grid container spacing={2}>
                        {props?.watch("meta.resources")?.length > 0 &&
                            props
                                ?.watch("meta.resources")
                                ?.map((r, index) => (
                                    <Resources
                                        key={index}
                                        index={index}
                                        {...props}
                                        {...r}
                                    />
                                ))}

                        <Grid size={{ xs: 12, sm: 12 }}>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={handleAddResoures}
                            >
                                {__("Add Resources", "acadlix")}
                            </Button>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>
        </Grid>
    )
}

export default ResourcesSection

const Resources = (props) => {
    const handleMediaChange = (media) => {
        props?.setValue(`meta.resources.${props?.index}.filename`, media?.filename, {
            shouldDirty: true,
        });
        props?.setValue(`meta.resources.${props?.index}.file_url`, media?.url, {
            shouldDirty: true,
        });
    };
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
                            <CustomTextField
                                fullWidth
                                name="title"
                                size="small"
                                label={__("Enter Title", "acadlix")}
                                value={props?.watch(`meta.resources.${props?.index}.title`) ?? ""}
                                onChange={(e) => {
                                    props?.setValue(
                                        `meta.resources.${props?.index}.title`,
                                        e?.target?.value,
                                        {
                                            shouldDirty: true,
                                        }
                                    );
                                }}
                            />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 12 }}>
                            <FormControl fullWidth size="small">
                                <InputLabel id="demo-simple-select-label">{__("Type", "acadlix")}</InputLabel>
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    value={props?.watch(`meta.resources.${props?.index}.type`)}
                                    label={__("Type", "acadlix")}
                                    onChange={(e) => {
                                        props?.setValue(
                                            `meta.resources.${props?.index}.type`,
                                            e?.target?.value,
                                            {
                                                shouldDirty: true,
                                            }
                                        );
                                    }}
                                >
                                    <MenuItem value="upload">{__("Upload", "acadlix")}</MenuItem>
                                    <MenuItem value="link">{__("Link", "acadlix")}</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        {props?.type === "upload" && (
                            <Grid size={{ xs: 12, sm: 12 }}>
                                <MediaUpload
                                    onSelect={handleMediaChange}
                                    render={({ open }) => (
                                        <Button variant="contained" onClick={open}>
                                            {__("Upload File", "acadlix")}
                                        </Button>
                                    )}
                                />
                                {props?.filename && (
                                    <>
                                        <Typography variant="body1" sx={{ marginTop: 2 }}>
                                            {__("Selected file:", "acadlix")}{" "}
                                            <a href={props?.file_url} target="_blank">
                                                {props?.filename}
                                            </a>
                                        </Typography>
                                    </>
                                )}
                            </Grid>
                        )}
                        {props?.type === "link" && (
                            <Grid size={{ xs: 12, sm: 12 }}>
                                <CustomTextField
                                    fullWidth
                                    name="link"
                                    size="small"
                                    label={__("https://example.com/", "acadlix")}
                                    value={props?.watch(`meta.resources.${props?.index}.link`) ?? ""}
                                    onChange={(e) => {
                                        props?.setValue(
                                            `meta.resources.${props?.index}.link`,
                                            e?.target?.value,
                                            {
                                                shouldDirty: true,
                                            }
                                        );
                                    }}
                                />
                            </Grid>
                        )}
                        <Grid size={{ xs: 12, sm: 12 }}>
                            <Button
                                variant="contained"
                                color="error"
                                onClick={(e) => {
                                    props?.setValue(
                                        "meta.resources",
                                        props
                                            ?.watch("meta.resources")
                                            ?.filter((_, i) => i !== props?.index),
                                        { shouldDirty: true }
                                    );
                                }}
                            >
                                {__("Remove", "acadlix")}
                            </Button>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>
        </Grid>
    );
};