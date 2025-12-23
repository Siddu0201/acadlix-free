import { FaCrown } from '@acadlix/helpers/icons'
import { Box, Button, Icon, IconButton } from '@mui/material'
import PropTypes from 'prop-types'
import React from 'react'

const CustomFeatureElement = ({
  element = "button",
  icon = null,
  label = "",
  attributes = {},
  iconboxsx = {},
  iconsx = {},
}) => {

  if (element === 'button') {
    return (
      <Box
        sx={{
          position: 'relative',
          display: 'inline',
        }}
      >
        <Button {...attributes}>
          {label}
        </Button>
        <Box
          sx={{
            position: 'absolute',
            top: -9,
            right: -9,
            transform: 'rotate(45deg)',
            backgroundColor: 'warning.main',
            borderRadius: '50%',
            width: 18,
            height: 18,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1,
            boxShadow: 2,
            ...iconboxsx,
          }}
        >
          <FaCrown style={{
            fontSize: 12,
            ...iconsx
          }} />
        </Box>
      </Box>
    )
  }

  if (element === 'iconbutton') {
    return (
      <Box
        sx={{
          position: 'relative',
          display: 'inline',
        }}
      >
        <IconButton {...attributes} aria-label={label}>
          {icon}
        </IconButton>
        <Box
          sx={{
            position: 'absolute',
            top: -3,
            right: -3,
            transform: 'rotate(45deg)',
            backgroundColor: 'warning.main',
            borderRadius: '50%',
            width: 14,
            height: 14,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1,
            boxShadow: 1,
            ...iconboxsx,
          }}
        >
          <FaCrown style={{
            fontSize: 8,
            ...iconsx
          }} />
        </Box>
      </Box>
    )
  }

  if(element === 'text'){
    return (
      <Box
        sx={{
          position: 'relative',
          display: 'inline',
        }}
      >
        <span {...attributes}>{label}</span>
        <Box
          sx={{
            position: 'absolute',
            top: -8,
            right: -8,
            transform: 'rotate(45deg)',
            backgroundColor: 'warning.main',
            borderRadius: '50%',
            width: 14,
            height: 14,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1,
            boxShadow: 1,
            ...iconboxsx,
          }}
        >
          <FaCrown style={{
            fontSize: 9,
            ...iconsx
          }} />
        </Box>
      </Box>
    )
  }

  return (
    <div>CustomFeatureElement</div>
  )
}

export default CustomFeatureElement

CustomFeatureElement.prototype = {
  element: PropTypes.string.isRequired,
  icon: PropTypes.element,
  label: PropTypes.string,
  attributes: PropTypes.object,
  iconboxsx: PropTypes.object,
  iconsx: PropTypes.object,
}