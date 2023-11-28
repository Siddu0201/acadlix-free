import { Autocomplete, Button, Card, CardContent, CardHeader, Checkbox, FormControl, FormControlLabel, FormLabel, Grid, Radio, RadioGroup, TextField, Typography } from '@mui/material'
import React from 'react'

const Language = () => {
  return (
    <Grid item xs={12} sm={12}>
        <Card>
            <CardHeader title="Language" />
            <CardContent>
                <Grid container spacing={4}>
                    <Grid item xs={12} sm={3}>
                        <Autocomplete
                            multiple
                            fullWidth
                            size="small"
                            options={['English', 'Hindi']}
                            renderOption={(props, option, { selected }) => (
                                <li {...props}>
                                  <Checkbox
                                    style={{ marginRight: 8 }}
                                    checked={selected}
                                  />
                                  {option}
                                </li>
                            )}
                            renderInput={(params) => (
                                <TextField {...params} label="Add Language" />
                            )}
                        />
                    </Grid>
                    <Grid item xs={12} sm={9}>
                        <FormControl sx={{
                            flexDirection: 'row',
                            alignItems: 'center',
                        }}>
                            <FormLabel sx={{
                                paddingX: 3
                            }}>Change Language:</FormLabel>
                            <RadioGroup row>
                                <FormControlLabel
                                    control={<Radio />}
                                    value="English"
                                    label={
                                        <>
                                            English
                                            <Button 
                                                variant='outlined' 
                                                size="small"
                                                sx={{
                                                    marginX: 2
                                                }}
                                            >
                                                Make Default
                                            </Button>
                                        </>
                                    }
                                />
                                <FormControlLabel
                                    control={<Radio />}
                                    value="Hindi"
                                    label={
                                        <>
                                            Hindi
                                            <Button 
                                                variant='outlined' 
                                                size="small"
                                                sx={{
                                                    marginX: 2
                                                }}
                                            >
                                                Make Default
                                            </Button>
                                        </>
                                    }
                                />
                            </RadioGroup>
                        </FormControl>
                    </Grid>
                </Grid>
            </CardContent>
        </Card>
    </Grid>
  )
}

export default Language
