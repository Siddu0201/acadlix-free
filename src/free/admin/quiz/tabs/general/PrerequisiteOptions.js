import React from 'react'
import GridItem1 from "@acadlix/components/GridItem1";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Box from "@mui/material/Box";
import { __ } from "@wordpress/i18n";

const PrerequisiteOptions = (props) => {
    const [prerequisite, setPrerequisite] = React.useState(null);

    const handleAddPrerequisite = () => {
        props?.setValue(
            "prerequisite",
            [
                ...props?.watch("prerequisite"),
                prerequisite,
            ]
        );
        setPrerequisite(null);
    }

    const handleRemovePrerequisite = (index) => {
        props?.setValue(
            "prerequisite",
            props?.watch("prerequisite").filter((_, i) => i !== index)
        );
    }
    return (
        <>
            <GridItem1 size={{ xs: 12, sm: 6, lg: 3 }} sx={{
                display: "flex",
                gap: 2
            }}>
                <Autocomplete
                    size="small"
                    fullWidth
                    value={
                        prerequisite !== null
                            ? prerequisite
                            : null
                    }
                    options={
                        props?.watch("quizzes")?.length > 0
                            ? props?.watch("quizzes")?.filter(val => !props?.watch("prerequisite")?.some(p => p?.ID === val?.ID))
                            : []
                    }
                    getOptionLabel={(option) => option?.post_title || ""}
                    isOptionEqualToValue={(option, value) => option?.ID === value?.ID}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            slotProps={{
                                input: {
                                    ...params.InputProps,
                                    autoComplete: "prerequisite",
                                }
                            }}
                            variant="outlined"
                            label={__('Select Quiz', 'acadlix')}
                        />
                    )}
                    onChange={(_, newValue) => {
                        if (!newValue) {
                            setPrerequisite(null);
                            return;
                        }
                        setPrerequisite(newValue);
                    }}
                />
                <Button
                    variant="contained"
                    color="primary"
                    size="small"
                    onClick={handleAddPrerequisite}
                >
                    {__('Add', 'acadlix')}
                </Button>
            </GridItem1>
            <GridItem1 size={{ xs: 12, sm: 12, lg: 6 }}></GridItem1>
            <GridItem1 size={{ xs: 12, sm: 6, lg: 3 }}>
                <List>
                    {props?.watch("prerequisite").map((value, index) => (
                        <ListItem
                            key={index}
                            disableGutters
                            secondaryAction={
                                <React.Fragment>
                                    <Box sx={{
                                        display: "flex",
                                        gap: 1
                                    }}>
                                        <Button
                                            variant="outlined"
                                            color="error"
                                            size="small"
                                            onClick={handleRemovePrerequisite.bind(this, index)}
                                        >
                                            {__('Delete', 'acadlix')}
                                        </Button>
                                    </Box>
                                </React.Fragment>
                            }
                        >
                            <ListItemText
                                primary={value?.post_title}
                            />
                        </ListItem>
                    ))}
                </List>
            </GridItem1>
        </>
    )
}

export default PrerequisiteOptions