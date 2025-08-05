import React from 'react'
import { Box, Divider, Typography } from '@mui/material'
import TypographyH1 from './variants/TypographyH1'
import TypographyH2 from './variants/TypographyH2'
import TypographyH3 from './variants/TypographyH3'
import TypographyH4 from './variants/TypographyH4'
import TypographyH5 from './variants/TypographyH5'
import TypographyH6 from './variants/TypographyH6'
import TypographyBody1 from './variants/TypographyBody1'
import TypographyBody2 from './variants/TypographyBody2'
import TypographySubtitle1 from './variants/TypographySubtitle1'
import TypographySubtitle2 from './variants/TypographySubtitle2'
import { __ } from '@wordpress/i18n'

const TypographyMobile = (props) => {
    return (
        <Box>
            {/* H1 */}
            <Box
                sx={{
                    marginY: 2,
                    backgroundColor: 'grey.light',
                }}
            >
                <Typography
                    variant="h6"
                    sx={{
                        paddingX: 2,
                        paddingY: 1,
                    }}
                >
                    {__("H1", "acadlix")}
                </Typography>
                <Divider />
            </Box>
            <TypographyH1
                type="mobile"
                {...props}
            />
            {/* H2 */}
            <Box
                sx={{
                    marginY: 2,
                    backgroundColor: 'grey.light',
                }}
            >
                <Typography
                    variant="h6"
                    sx={{
                        paddingX: 2,
                        paddingY: 1,
                    }}
                >
                    {__("H2", "acadlix")}
                </Typography>
                <Divider />
            </Box>
            <TypographyH2
                type="mobile"
                {...props}
            />
            {/* H2 */}
            <Box
                sx={{
                    marginY: 2,
                    backgroundColor: 'grey.light',
                }}
            >
                <Typography
                    variant="h6"
                    sx={{
                        paddingX: 2,
                        paddingY: 1,
                    }}
                >
                    {__("H3", "acadlix")}
                </Typography>
                <Divider />
            </Box>
            <TypographyH3
                type="mobile"
                {...props}
            />
            {/* H4 */}
            <Box
                sx={{
                    marginY: 2,
                    backgroundColor: 'grey.light',
                }}
            >
                <Typography
                    variant="h6"
                    sx={{
                        paddingX: 2,
                        paddingY: 1,
                    }}
                >
                    {__("H4", "acadlix")}
                </Typography>
                <Divider />
            </Box>
            <TypographyH4
                type="mobile"
                {...props}
            />
            {/* H5 */}
            <Box
                sx={{
                    marginY: 2,
                    backgroundColor: 'grey.light',
                }}
            >
                <Typography
                    variant="h6"
                    sx={{
                        paddingX: 2,
                        paddingY: 1,
                    }}
                >
                    {__("H5", "acadlix")}
                </Typography>
                <Divider />
            </Box>
            <TypographyH5
                type="mobile"
                {...props}
            />
            {/* H6 */}
            <Box
                sx={{
                    marginY: 2,
                    backgroundColor: 'grey.light',
                }}
            >
                <Typography
                    variant="h6"
                    sx={{
                        paddingX: 2,
                        paddingY: 1,
                    }}
                >
                    {__("H6", "acadlix")}
                </Typography>
                <Divider />
            </Box>
            <TypographyH6
                type="mobile"
                {...props}
            />
            {/* body1 */}
            <Box
                sx={{
                    marginY: 2,
                    backgroundColor: 'grey.light',
                }}
            >
                <Typography
                    variant="h6"
                    sx={{
                        paddingX: 2,
                        paddingY: 1,
                    }}
                >
                    {__("Body1", "acadlix")}
                </Typography>
                <Divider />
            </Box>
            <TypographyBody1
                type="mobile"
                {...props}
            />
            {/* body2 */}
            <Box
                sx={{
                    marginY: 2,
                    backgroundColor: 'grey.light',
                }}
            >
                <Typography
                    variant="h6"
                    sx={{
                        paddingX: 2,
                        paddingY: 1,
                    }}
                >
                    {__("Body2", "acadlix")}
                </Typography>
                <Divider />
            </Box>
            <TypographyBody2
                type="mobile"
                {...props}
            />
            {/* subtitle1 */}
            <Box
                sx={{
                    marginY: 2,
                    backgroundColor: 'grey.light',
                }}
            >
                <Typography
                    variant="h6"
                    sx={{
                        paddingX: 2,
                        paddingY: 1,
                    }}
                >
                    {__("Subtitle1", "acadlix")}
                </Typography>
                <Divider />
            </Box>
            <TypographySubtitle1
                type="mobile"
                {...props}
            />
            {/* subtitle2 */}
            <Box
                sx={{
                    marginY: 2,
                    backgroundColor: 'grey.light',
                }}
            >
                <Typography
                    variant="h6"
                    sx={{
                        paddingX: 2,
                        paddingY: 1,
                    }}
                >
                    {__("Subtitle2", "acadlix")}
                </Typography>
                <Divider />
            </Box>
            <TypographySubtitle2
                type="mobile"
                {...props}
            />
        </Box>
    )
}

export default TypographyMobile