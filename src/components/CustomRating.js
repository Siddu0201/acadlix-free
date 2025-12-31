import { FaRegStar, FaStar } from '@acadlix/helpers/icons';
import { Rating } from '@mui/material';
import PropTypes from 'prop-types'
import React from 'react'

const CustomRating = ({
  value = 0,
  fontSize = 16,
  style = {},
}) => {
  
  return (
    <Rating 
      name="custom-rating"
      value={Number(value)}
      icon={<FaStar fontSize="inherit" />} 
      emptyIcon={<FaRegStar fontSize="inherit" />}
      sx={{
        color: '#ffb400',
        fontSize: fontSize,
        ...style
      }}
      max={5}
      readOnly
    />
  )
}

export default CustomRating

CustomRating.prototype = {
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  fontSize: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
}