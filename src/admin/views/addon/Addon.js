import React from 'react'
import { Box, Typography } from '@mui/material'
import Grid from '@mui/material/Grid2'
import { __ } from '@wordpress/i18n'
import LockedAddonCard from './sections/LockedAddonCard'
import InternalAddonCard from './sections/InternalAddonCard'
import ExternalAddonCard from './sections/ExternalAddonCard'
import { GetAddons } from '@acadlix/requests/admin/AdminAddonRequest'
import Loader from '@acadlix/components/Loader'

const Addon = () => {
  const { isFetching, data } = GetAddons();

  if (isFetching) {
    return <Loader />
  }

  return (
    <Box>
      <Grid
        container
        spacing={{
          xs: 2,
          sm: 4,
        }}
        sx={{
          padding: {
            xs: 2,
            sm: 4,
          },
        }}
      >
        <Grid size={{ xs: 12, lg: 12 }}>
          <Typography variant="h3">{__('Addon Manager', 'acadlix')}</Typography>
        </Grid>
        {
          data?.data?.addons?.length > 0 &&
          data?.data?.addons?.map((addon, index) => (
            <Grid size={{ xs: 12, lg: 4 }} key={index}>
              {
                addon?.internal ?
                  (
                    <>
                      {
                        addon?.pro
                          ?
                          (
                            acadlixOptions?.isPro && acadlixOptions?.isActive ?
                              <InternalAddonCard
                                {...addon}
                              />
                              :
                              <LockedAddonCard
                                {...addon}
                              />
                          )
                          :
                          <InternalAddonCard
                            {...addon}
                          />
                      }
                    </>
                  )
                  :
                  (
                    <ExternalAddonCard
                      {...addon}
                    />
                  )
              }
            </Grid>
          ))
        }
        {/* <Grid size={{ xs: 12, lg: 4 }}>
          <LockedAddonCard />
        </Grid>
        <Grid size={{ xs: 12, lg: 4 }}>
          <InternalAddonCard />
        </Grid>
        <Grid size={{ xs: 12, lg: 4 }}>
          <ExternalAddonCard />
        </Grid> */}
      </Grid>
    </Box>
  )
}

export default Addon