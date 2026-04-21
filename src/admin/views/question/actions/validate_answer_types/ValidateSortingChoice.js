import CustomLatex from '@acadlix/modules/latex/CustomLatex'
import { Box, List, ListItem } from '@mui/material'
import React from 'react'

const ValidateSortingChoice = ({
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
              backgroundColor: "white",
            }}
          >
            <CustomLatex>
              {data?.option}
            </CustomLatex>
          </ListItem>
        ))}
      </List>
    </Box>
  )
}

export default ValidateSortingChoice