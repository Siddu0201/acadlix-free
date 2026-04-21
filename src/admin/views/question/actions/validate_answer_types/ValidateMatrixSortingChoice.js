import CustomLatex from '@acadlix/modules/latex/CustomLatex'
import { Box, List, ListItem, Typography } from '@mui/material'
import React from 'react'

const ValidateMatrixSortingChoice = ({
  answer_data
}) => {
  return (
    <Box
      sx={{
        width: '100%',
        py: 1,
      }}
    >
      <List
        sx={{
          display: "grid",
          gap: 1,
          padding: `0 !important`,
          marginY: `0 !important`,
        }}
      >

        {answer_data?.map((data, index) => (
          <ListItem
            key={index}
            sx={{
              border: "1px solid black",
              borderRadius: 1,
              backgroundColor: "transparent",
            }}
          >
            <Box
              sx={{
                borderRight: "1px dotted black",
                padding: 1,
                paddingRight: 2,
              }}
            >
              <Typography component="span">
                <CustomLatex>
                  {data?.criteria}
                </CustomLatex>
              </Typography>
            </Box>
            <Box sx={{
              padding: 1,
              paddingLeft: 2,
            }}>
              <Typography component="span">
                <CustomLatex>
                  {data?.element}
                </CustomLatex>
              </Typography>
            </Box>

          </ListItem>
        ))}
      </List>
    </Box>
  )
}

export default ValidateMatrixSortingChoice