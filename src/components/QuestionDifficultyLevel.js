import React from 'react';
import PropTypes from 'prop-types';
import { Chip } from '@mui/material';
import { __ } from '@wordpress/i18n';

const DEFAULT_OPTIONS = [
  { value: 'easy', label: __('Easy', 'acadlix'), color: 'success' },
  { value: 'medium', label: __('Medium', 'acadlix'), color: 'primary' },
  { value: 'hard', label: __('Hard', 'acadlix'), color: 'warning' },
  { value: 'expert', label: __('Expert', 'acadlix'), color: 'error' },
];

const QuestionDifficultyLevel = ({
  value = '',
  size = 'small',
  sx = {},
}) => {

  const options = DEFAULT_OPTIONS;

  const option = options.find((opt) => opt.value === value) || { value: '', label: '-' };

  return (
    <Chip
      key={option.value}
      label={option.label}
      size={size}
      color={option.color || 'default'}
      variant="filled"
      clickable
      sx={{
        textTransform: 'capitalize',
        fontWeight: 500,
        ...sx,
      }}
    />
  );
};

QuestionDifficultyLevel.propTypes = {
  value: PropTypes.string,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string.isRequired,
      label: PropTypes.node.isRequired,
      color: PropTypes.oneOf([
        'default',
        'primary',
        'secondary',
        'success',
        'error',
        'info',
        'warning',
      ]),
    }),
  ),
  size: PropTypes.oneOf(['small', 'medium']),
};

export default QuestionDifficultyLevel;