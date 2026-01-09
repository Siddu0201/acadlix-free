import { FaRegStar, FaStar } from '@acadlix/helpers/icons';
import { Rating } from '@mui/material';
import PropTypes from 'prop-types'
import React from 'react'

const CustomRating = ({
  value = 0,
  fontSize = 16,
  color = "#ffb400",
  style = {},
}) => {
  
  return (
    <Rating 
      name="custom-rating"
      value={Number(value)}
      icon={<FaStar fontSize="inherit" color={color} />} 
      emptyIcon={<FaRegStar fontSize="inherit" color={color} />}
      precision={0.5}
      sx={{
        // color: color,
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