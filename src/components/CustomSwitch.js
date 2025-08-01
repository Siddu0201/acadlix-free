import { styled, Switch } from '@mui/material';
import React from 'react'

const CustomSwitch = styled((props) => (
    <Switch focusVisibleClassName=".Mui-focusVisible" disableRipple {...props} />
  ))(({ theme }) => ({
    width: 36,
    height: 20,
    padding: 0,
    marginRight: 10,
    marginLeft: 6,
    marginBottom: 4,
    marginTop: 4,
    '& .MuiSwitch-switchBase': {
      padding: 0,
      margin: 2,
      transitionDuration: '300ms',
      '&.Mui-checked': {
        transform: 'translateX(16px)',
        color: '#fff',
        '& + .MuiSwitch-track': {
          backgroundColor: theme.palette.primary.main,
          opacity: 1,
          border: 0,
        },
        '&.Mui-disabled + .MuiSwitch-track': {
          opacity: 0.5, 
        },
      },
      '&.Mui-focusVisible .MuiSwitch-thumb': {
        color: theme.palette.primary.main,
        border: `6px solid ${theme.palette.primary.contrastText}`,
      },
      '&.Mui-disabled .MuiSwitch-thumb': {
        color: theme.palette.grey.light,
      },
      '&.Mui-disabled + .MuiSwitch-track': {
        opacity: 0.4,
      },
    },
    '& .MuiSwitch-thumb': {
      boxSizing: 'border-box',
      width: 16,
      height: 16,
    },
    '& .MuiSwitch-track': {
      borderRadius: 26 / 2,
      backgroundColor: theme.palette.grey.main,
      opacity: 1,
      transition: theme.transitions.create(['background-color'], {
        duration: 500,
      }),
    },
    '& .MuiSwitch-input': {
      height: 0
    }
  }));

export default CustomSwitch
