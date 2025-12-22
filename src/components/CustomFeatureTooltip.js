import { CiLock, RiQuestionFill } from '@acadlix/helpers/icons';
import { IconButton, Tooltip, Box, Link, Typography } from '@mui/material';
import PropTypes from 'prop-types';
import React from 'react';
import { __ } from '@wordpress/i18n';
import { RawHTML } from '@wordpress/element';

const CustomFeatureTooltip = ({
  plan = 'open',
  msg = 'Default tooltip message',
  placement = 'right-start',
  iconsx = {},
  redirectTo = '',
  upgradeUrl = 'https://acadlix.com/pricing/',
}) => {
  const isLocked = plan !== 'open';

  const tooltipContent = (
    <Box sx={{ maxWidth: 250 }}>
      <Box sx={{ fontSize: 12, mb: isLocked ? 0.5 : 0 }}>
        <RawHTML>
          {msg}
        </RawHTML>
      </Box>

      {isLocked && upgradeUrl && (
        <Link
          href={upgradeUrl}
          target="_blank"
          rel="noopener noreferrer"
          underline="hover"
          sx={{
            fontSize: 12,
            fontWeight: 500,
            cursor: 'pointer',
            color: 'warning.main',
            '&:hover, &:focus': {
              color: 'warning.light',
            },
          }}
        >
          {__("Upgrade to Pro →", "acadlix")}
        </Link>
      )}
      {
        !isLocked && redirectTo && (
          <Typography
            variant="caption"
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end', 
              gap: 0.5,
              mt: 1,
              fontSize: 10,
              color: '#fff'
            }}
          >
            <RiQuestionFill style={{ fontSize: 10 }} />
            {__("Click the icon to learn more", "acadlix")}
          </Typography>
        )
      }
    </Box>
  );

  const handleClick = () => {
    if (isLocked && upgradeUrl) {
      window.open(upgradeUrl, '_blank', 'noopener,noreferrer');
      return;
    }
    if (redirectTo && !isLocked) {
      window.open(redirectTo, '_blank', 'noopener,noreferrer');
      return;
    }
  };

  return (
    <Tooltip title={tooltipContent} placement={placement}>
      <IconButton
        onClick={handleClick}
        sx={{
          fontSize: '1.25rem',
          ...iconsx,
        }}
      >
        {plan === 'open' ? <RiQuestionFill /> : <CiLock />}
      </IconButton>
    </Tooltip>
  );
};

export default CustomFeatureTooltip;

CustomFeatureTooltip.propTypes = {
  plan: PropTypes.oneOf(['open', 'pro', 'locked']).isRequired,
  msg: PropTypes.string.isRequired,
  placement: PropTypes.string,
  iconsx: PropTypes.object,
  upgradeUrl: PropTypes.string,
};
