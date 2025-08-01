import React from 'react'
import { Accordion, AccordionDetails, AccordionSummary, Box, Card, CardContent, CardHeader, Typography } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { __ } from '@wordpress/i18n';
import CustomTypography from '@acadlix/components/CustomTypography';
import { IoIosArrowDown } from '@acadlix/helpers/icons';

const Palette = (props) => {
    return (
        <>
            <CardHeader
                title={__('Palette', 'acadlix')}
            />
            <CardContent>
                <Box>
                    {/* Primary */}
                    <Accordion sx={{
                        marginBottom: 2,
                    }}>
                        <AccordionSummary
                            expandIcon={<IoIosArrowDown style={{ color: props?.watch('palette.primary.contrastText') }} />}
                            aria-controls="panel1a-content"
                            id="panel1a-header"
                            sx={{
                                color: props?.watch('palette.primary.contrastText'),  
                                backgroundColor: props?.watch('palette.primary.main'),
                                '&:hover,&:focus': {
                                    backgroundColor: props?.watch('palette.primary.dark'),
                                },
                                '&.Mui-expanded': {
                                    backgroundColor: props?.watch('palette.primary.main'),
                                },
                            }}
                        >
                            <Typography
                                fontWeight={600}
                                color={props?.watch('palette.primary.contrastText')}
                            >
                                {__('Primary', 'acadlix')}
                            </Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Grid
                                container
                                rowSpacing={2}
                                spacing={2}
                                sx={{
                                    padding: 2,
                                }}
                            >
                                <Grid
                                    size={{ lg: 3, md: 6, sm: 6, xs: 12 }}
                                >
                                    <CustomTypography
                                    >
                                        {__('Main', 'acadlix')}
                                    </CustomTypography>
                                </Grid>
                                <Grid
                                    size={{ lg: 3, md: 6, sm: 6, xs: 12 }}
                                >
                                    <input
                                        type="color"
                                        name='primary_main'
                                        value={props?.watch('palette.primary.main')}
                                        onChange={(e) => props?.setValue('palette.primary.main', e.target.value, { shouldDirty: true })}
                                    />
                                </Grid>
                                <Grid
                                    size={{ lg: 3, md: 6, sm: 6, xs: 12 }}
                                >
                                    <CustomTypography>
                                        {__('Dark', 'acadlix')}
                                    </CustomTypography>
                                </Grid>
                                <Grid
                                    size={{ lg: 3, md: 6, sm: 6, xs: 12 }}
                                >
                                    <input
                                        type="color"
                                        name='primary_dark'
                                        value={props?.watch('palette.primary.dark')}
                                        onChange={(e) => props?.setValue('palette.primary.dark', e.target.value, { shouldDirty: true })}
                                    />
                                </Grid>
                                <Grid
                                    size={{ lg: 3, md: 6, sm: 6, xs: 12 }}
                                >
                                    <CustomTypography>
                                        {__('Light', 'acadlix')}
                                    </CustomTypography>
                                </Grid>
                                <Grid
                                    size={{ lg: 3, md: 6, sm: 6, xs: 12 }}
                                >
                                    <input
                                        type="color"
                                        name='primary_light'
                                        value={props?.watch('palette.primary.light')}
                                        onChange={(e) => props?.setValue('palette.primary.light', e.target.value, { shouldDirty: true })}
                                    />
                                </Grid>
                                <Grid
                                    size={{ lg: 3, md: 6, sm: 6, xs: 12 }}
                                >
                                    <CustomTypography>
                                        {__('Contrast Text', 'acadlix')}
                                    </CustomTypography>
                                </Grid>
                                <Grid
                                    size={{ lg: 3, md: 6, sm: 6, xs: 12 }}
                                >
                                    <input
                                        type="color"
                                        name='primary_contrast_text'
                                        value={props?.watch('palette.primary.contrastText')}
                                        onChange={(e) => props?.setValue('palette.primary.contrastText', e.target.value, { shouldDirty: true })}
                                    />
                                </Grid>
                            </Grid>
                        </AccordionDetails>
                    </Accordion>
                    {/* Success */}
                    <Accordion sx={{
                        marginBottom: 2,
                    }}>
                        <AccordionSummary
                            expandIcon={<IoIosArrowDown style={{ color: props?.watch('palette.success.contrastText') }} />}
                            aria-controls="panel1a-content"
                            id="panel1a-header"
                            sx={{
                                color: props?.watch('palette.success.contrastText'),
                                backgroundColor: props?.watch('palette.success.main'),
                                '&:hover,&:focus': {
                                    backgroundColor: props?.watch('palette.success.dark'),
                                },
                                '&.Mui-expanded': {
                                    backgroundColor: props?.watch('palette.success.main'),
                                },
                            }}
                        >
                            <Typography
                                fontWeight={600}
                                color={props?.watch('palette.success.contrastText')}
                            >
                                {__('Success', 'acadlix')}
                            </Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Grid
                                container
                                rowSpacing={2}
                                spacing={2}
                                sx={{
                                    padding: 2,
                                }}
                            >
                                <Grid
                                    size={{ lg: 3, md: 6, sm: 6, xs: 12 }}
                                >
                                    <CustomTypography
                                    >
                                        {__('Main', 'acadlix')}
                                    </CustomTypography>
                                </Grid>
                                <Grid
                                    size={{ lg: 3, md: 6, sm: 6, xs: 12 }}
                                >
                                    <input
                                        type="color"
                                        name='success_main'
                                        value={props?.watch('palette.success.main')}
                                        onChange={(e) => props?.setValue('palette.success.main', e.target.value, { shouldDirty: true })}
                                    />
                                </Grid>
                                <Grid
                                    size={{ lg: 3, md: 6, sm: 6, xs: 12 }}
                                >
                                    <CustomTypography>
                                        {__('Dark', 'acadlix')}
                                    </CustomTypography>
                                </Grid>
                                <Grid
                                    size={{ lg: 3, md: 6, sm: 6, xs: 12 }}
                                >
                                    <input
                                        type="color"
                                        name='success_dark'
                                        value={props?.watch('palette.success.dark')}
                                        onChange={(e) => props?.setValue('palette.success.dark', e.target.value, { shouldDirty: true })}
                                    />
                                </Grid>
                                <Grid
                                    size={{ lg: 3, md: 6, sm: 6, xs: 12 }}
                                >
                                    <CustomTypography>
                                        {__('Light', 'acadlix')}
                                    </CustomTypography>
                                </Grid>
                                <Grid
                                    size={{ lg: 3, md: 6, sm: 6, xs: 12 }}
                                >
                                    <input
                                        type="color"
                                        name='success_light'
                                        value={props?.watch('palette.success.light')}
                                        onChange={(e) => props?.setValue('palette.success.light', e.target.value, { shouldDirty: true })}
                                    />
                                </Grid>
                                <Grid
                                    size={{ lg: 3, md: 6, sm: 6, xs: 12 }}
                                >
                                    <CustomTypography>
                                        {__('Contrast Text', 'acadlix')}
                                    </CustomTypography>
                                </Grid>
                                <Grid
                                    size={{ lg: 3, md: 6, sm: 6, xs: 12 }}
                                >
                                    <input
                                        type="color"
                                        name='success_contrast_text'
                                        value={props?.watch('palette.success.contrastText')}
                                        onChange={(e) => props?.setValue('palette.success.contrastText', e.target.value, { shouldDirty: true })}
                                    />
                                </Grid>
                            </Grid>
                        </AccordionDetails>
                    </Accordion>
                    {/* Warning */}
                    <Accordion sx={{
                        marginBottom: 2,
                    }}>
                        <AccordionSummary
                            expandIcon={<IoIosArrowDown style={{ color: props?.watch('palette.warning.contrastText') }} />}
                            aria-controls="panel1a-content"
                            id="panel1a-header"
                            sx={{
                                color: props?.watch('palette.warning.contrastText'),
                                backgroundColor: props?.watch('palette.warning.main'),
                                '&:hover,&:focus': {
                                    backgroundColor: props?.watch('palette.warning.dark'),
                                },
                                '&.Mui-expanded': {
                                    backgroundColor: props?.watch('palette.warning.main'),
                                },
                            }}
                        >
                            <Typography
                                fontWeight={600}
                                color={props?.watch('palette.warning.contrastText')}
                            >
                                {__('Warning', 'acadlix')}
                            </Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Grid
                                container
                                rowSpacing={2}
                                spacing={2}
                                sx={{
                                    padding: 2,
                                }}
                            >
                                <Grid
                                    size={{ lg: 3, md: 6, sm: 6, xs: 12 }}
                                >
                                    <CustomTypography
                                    >
                                        {__('Main', 'acadlix')}
                                    </CustomTypography>
                                </Grid>
                                <Grid
                                    size={{ lg: 3, md: 6, sm: 6, xs: 12 }}
                                >
                                    <input
                                        type="color"
                                        name='warning_main'
                                        value={props?.watch('palette.warning.main')}
                                        onChange={(e) => props?.setValue('palette.warning.main', e.target.value, { shouldDirty: true })}
                                    />
                                </Grid>
                                <Grid
                                    size={{ lg: 3, md: 6, sm: 6, xs: 12 }}
                                >
                                    <CustomTypography>
                                        {__('Dark', 'acadlix')}
                                    </CustomTypography>
                                </Grid>
                                <Grid
                                    size={{ lg: 3, md: 6, sm: 6, xs: 12 }}
                                >
                                    <input
                                        type="color"
                                        name='warning_dark'
                                        value={props?.watch('palette.warning.dark')}
                                        onChange={(e) => props?.setValue('palette.warning.dark', e.target.value, { shouldDirty: true })}
                                    />
                                </Grid>
                                <Grid
                                    size={{ lg: 3, md: 6, sm: 6, xs: 12 }}
                                >
                                    <CustomTypography>
                                        {__('Light', 'acadlix')}
                                    </CustomTypography>
                                </Grid>
                                <Grid
                                    size={{ lg: 3, md: 6, sm: 6, xs: 12 }}
                                >
                                    <input
                                        type="color"
                                        name='warning_light'
                                        value={props?.watch('palette.warning.light')}
                                        onChange={(e) => props?.setValue('palette.warning.light', e.target.value, { shouldDirty: true })}
                                    />
                                </Grid>
                                <Grid
                                    size={{ lg: 3, md: 6, sm: 6, xs: 12 }}
                                >
                                    <CustomTypography>
                                        {__('Contrast Text', 'acadlix')}
                                    </CustomTypography>
                                </Grid>
                                <Grid
                                    size={{ lg: 3, md: 6, sm: 6, xs: 12 }}
                                >
                                    <input
                                        type="color"
                                        name='warning_contrast_text'
                                        value={props?.watch('palette.warning.contrastText')}
                                        onChange={(e) => props?.setValue('palette.warning.contrastText', e.target.value, { shouldDirty: true })}
                                    />
                                </Grid>
                            </Grid>
                        </AccordionDetails>
                    </Accordion>
                    {/* Info */}
                    <Accordion sx={{
                        marginBottom: 2,
                    }}>
                        <AccordionSummary
                            expandIcon={<IoIosArrowDown style={{ color: props?.watch('palette.info.contrastText') }} />}
                            aria-controls="panel1a-content"
                            id="panel1a-header"
                            sx={{
                                color: props?.watch('palette.info.contrastText'),
                                backgroundColor: props?.watch('palette.info.main'),
                                '&:hover,&:focus': {
                                    backgroundColor: props?.watch('palette.info.dark'),
                                },
                                '&.Mui-expanded': {
                                    backgroundColor: props?.watch('palette.info.main'),
                                },
                            }}
                        >
                            <Typography
                                fontWeight={600}
                                color={props?.watch('palette.info.contrastText')}
                            >
                                {__('Info', 'acadlix')}
                            </Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Grid
                                container
                                rowSpacing={2}
                                spacing={2}
                                sx={{
                                    padding: 2,
                                }}
                            >
                                <Grid
                                    size={{ lg: 3, md: 6, sm: 6, xs: 12 }}
                                >
                                    <CustomTypography
                                    >
                                        {__('Main', 'acadlix')}
                                    </CustomTypography>
                                </Grid>
                                <Grid
                                    size={{ lg: 3, md: 6, sm: 6, xs: 12 }}
                                >
                                    <input
                                        type="color"
                                        name='info_main'
                                        value={props?.watch('palette.info.main')}
                                        onChange={(e) => props?.setValue('palette.info.main', e.target.value, { shouldDirty: true })}
                                    />
                                </Grid>
                                <Grid
                                    size={{ lg: 3, md: 6, sm: 6, xs: 12 }}
                                >
                                    <CustomTypography>
                                        {__('Dark', 'acadlix')}
                                    </CustomTypography>
                                </Grid>
                                <Grid
                                    size={{ lg: 3, md: 6, sm: 6, xs: 12 }}
                                >
                                    <input
                                        type="color"
                                        name='info_dark'
                                        value={props?.watch('palette.info.dark')}
                                        onChange={(e) => props?.setValue('palette.info.dark', e.target.value, { shouldDirty: true })}
                                    />
                                </Grid>
                                <Grid
                                    size={{ lg: 3, md: 6, sm: 6, xs: 12 }}
                                >
                                    <CustomTypography>
                                        {__('Light', 'acadlix')}
                                    </CustomTypography>
                                </Grid>
                                <Grid
                                    size={{ lg: 3, md: 6, sm: 6, xs: 12 }}
                                >
                                    <input
                                        type="color"
                                        name='info_light'
                                        value={props?.watch('palette.info.light')}
                                        onChange={(e) => props?.setValue('palette.info.light', e.target.value, { shouldDirty: true })}
                                    />
                                </Grid>
                                <Grid
                                    size={{ lg: 3, md: 6, sm: 6, xs: 12 }}
                                >
                                    <CustomTypography>
                                        {__('Contrast Text', 'acadlix')}
                                    </CustomTypography>
                                </Grid>
                                <Grid
                                    size={{ lg: 3, md: 6, sm: 6, xs: 12 }}
                                >
                                    <input
                                        type="color"
                                        name='info_contrast_text'
                                        value={props?.watch('palette.info.contrastText')}
                                        onChange={(e) => props?.setValue('palette.info.contrastText', e.target.value, { shouldDirty: true })}
                                    />
                                </Grid>
                            </Grid>
                        </AccordionDetails>
                    </Accordion>
                    {/* Error */}
                    <Accordion sx={{
                        marginBottom: 2,
                    }}>
                        <AccordionSummary
                            expandIcon={<IoIosArrowDown style={{ color: props?.watch('palette.error.contrastText') }} />}
                            aria-controls="panel1a-content"
                            id="panel1a-header"
                            sx={{
                                color: props?.watch('palette.error.contrastText'),
                                backgroundColor: props?.watch('palette.error.main'),
                                '&:hover,&:focus': {
                                    backgroundColor: props?.watch('palette.error.dark'),
                                },
                                '&.Mui-expanded': {
                                    backgroundColor: props?.watch('palette.error.main'),
                                },
                            }}
                        >
                            <Typography
                                fontWeight={600}
                                color={props?.watch('palette.error.contrastText')}
                            >
                                {__('Error', 'acadlix')}
                            </Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Grid
                                container
                                rowSpacing={2}
                                spacing={2}
                                sx={{
                                    padding: 2,
                                }}
                            >
                                <Grid
                                    size={{ lg: 3, md: 6, sm: 6, xs: 12 }}
                                >
                                    <CustomTypography
                                    >
                                        {__('Main', 'acadlix')}
                                    </CustomTypography>
                                </Grid>
                                <Grid
                                    size={{ lg: 3, md: 6, sm: 6, xs: 12 }}
                                >
                                    <input
                                        type="color"
                                        name='error_main'
                                        value={props?.watch('palette.error.main')}
                                        onChange={(e) => props?.setValue('palette.error.main', e.target.value, { shouldDirty: true })}
                                    />
                                </Grid>
                                <Grid
                                    size={{ lg: 3, md: 6, sm: 6, xs: 12 }}
                                >
                                    <CustomTypography>
                                        {__('Dark', 'acadlix')}
                                    </CustomTypography>
                                </Grid>
                                <Grid
                                    size={{ lg: 3, md: 6, sm: 6, xs: 12 }}
                                >
                                    <input
                                        type="color"
                                        name='error_dark'
                                        value={props?.watch('palette.error.dark')}
                                        onChange={(e) => props?.setValue('palette.error.dark', e.target.value, { shouldDirty: true })}
                                    />
                                </Grid>
                                <Grid
                                    size={{ lg: 3, md: 6, sm: 6, xs: 12 }}
                                >
                                    <CustomTypography>
                                        {__('Light', 'acadlix')}
                                    </CustomTypography>
                                </Grid>
                                <Grid
                                    size={{ lg: 3, md: 6, sm: 6, xs: 12 }}
                                >
                                    <input
                                        type="color"
                                        name='error_light'
                                        value={props?.watch('palette.error.light')}
                                        onChange={(e) => props?.setValue('palette.error.light', e.target.value, { shouldDirty: true })}
                                    />
                                </Grid>
                                <Grid
                                    size={{ lg: 3, md: 6, sm: 6, xs: 12 }}
                                >
                                    <CustomTypography>
                                        {__('Contrast Text', 'acadlix')}
                                    </CustomTypography>
                                </Grid>
                                <Grid
                                    size={{ lg: 3, md: 6, sm: 6, xs: 12 }}
                                >
                                    <input
                                        type="color"
                                        name='error_contrast_text'
                                        value={props?.watch('palette.error.contrastText')}
                                        onChange={(e) => props?.setValue('palette.error.contrastText', e.target.value, { shouldDirty: true })}
                                    />
                                </Grid>
                            </Grid>
                        </AccordionDetails>
                    </Accordion>
                    {/* grey */}
                    <Accordion sx={{
                        marginBottom: 2,
                    }}>
                        <AccordionSummary
                            expandIcon={<IoIosArrowDown style={{ color: props?.watch('palette.grey.contrastText') }} />}
                            aria-controls="panel1a-content"
                            id="panel1a-header"
                            sx={{
                                color: props?.watch('palette.grey.contrastText'),
                                backgroundColor: props?.watch('palette.grey.main'),
                                '&:hover,&:focus': {
                                    backgroundColor: props?.watch('palette.grey.dark'),
                                },
                                '&.Mui-expanded': {
                                    backgroundColor: props?.watch('palette.grey.main'),
                                },
                            }}
                        >
                            <Typography
                                fontWeight={600}
                                color={props?.watch('palette.grey.contrastText')}
                            >
                                {__('Grey', 'acadlix')}
                            </Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Grid
                                container
                                rowSpacing={2}
                                spacing={2}
                                sx={{
                                    padding: 2,
                                }}
                            >
                                <Grid
                                    size={{ lg: 3, md: 6, sm: 6, xs: 12 }}
                                >
                                    <CustomTypography
                                    >
                                        {__('Main', 'acadlix')}
                                    </CustomTypography>
                                </Grid>
                                <Grid
                                    size={{ lg: 3, md: 6, sm: 6, xs: 12 }}
                                >
                                    <input
                                        type="color"
                                        name='grey_main'
                                        value={props?.watch('palette.grey.main')}
                                        onChange={(e) => props?.setValue('palette.grey.main', e.target.value, { shouldDirty: true })}
                                    />
                                </Grid>
                                <Grid
                                    size={{ lg: 3, md: 6, sm: 6, xs: 12 }}
                                >
                                    <CustomTypography>
                                        {__('Dark', 'acadlix')}
                                    </CustomTypography>
                                </Grid>
                                <Grid
                                    size={{ lg: 3, md: 6, sm: 6, xs: 12 }}
                                >
                                    <input
                                        type="color"
                                        name='grey_dark'
                                        value={props?.watch('palette.grey.dark')}
                                        onChange={(e) => props?.setValue('palette.grey.dark', e.target.value, { shouldDirty: true })}
                                    />
                                </Grid>
                                <Grid
                                    size={{ lg: 3, md: 6, sm: 6, xs: 12 }}
                                >
                                    <CustomTypography>
                                        {__('Light', 'acadlix')}
                                    </CustomTypography>
                                </Grid>
                                <Grid
                                    size={{ lg: 3, md: 6, sm: 6, xs: 12 }}
                                >
                                    <input
                                        type="color"
                                        name='grey_light'
                                        value={props?.watch('palette.grey.light')}
                                        onChange={(e) => props?.setValue('palette.grey.light', e.target.value, { shouldDirty: true })}
                                    />
                                </Grid>
                                <Grid
                                    size={{ lg: 3, md: 6, sm: 6, xs: 12 }}
                                >
                                    <CustomTypography>
                                        {__('Contrast Text', 'acadlix')}
                                    </CustomTypography>
                                </Grid>
                                <Grid
                                    size={{ lg: 3, md: 6, sm: 6, xs: 12 }}
                                >
                                    <input
                                        type="color"
                                        name='grey_contrast_text'
                                        value={props?.watch('palette.grey.contrastText')}
                                        onChange={(e) => props?.setValue('palette.grey.contrastText', e.target.value, { shouldDirty: true })}
                                    />
                                </Grid>
                            </Grid>
                        </AccordionDetails>
                    </Accordion>
                </Box>
            </CardContent>
        </>
    )
}

export default Palette