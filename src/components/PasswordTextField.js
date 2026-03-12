import { MdVisibility, MdVisibilityOff } from '@acadlix/helpers/icons';
import { IconButton, InputAdornment } from '@mui/material';
import React from 'react'
import CustomTextField from './CustomTextField';

const PasswordTextField = React.forwardRef((props, ref) => {
  const [visible, setVisible] = React.useState(false);
  return (
    <CustomTextField
      {...props}
      ref={ref}
      type={visible ? "text" : "password"}
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <IconButton
              className='acadlix-icon-btn'
              aria-label="toggle password visibility"
              onClick={() => setVisible(!visible)}
              onMouseDown={(e) => e.preventDefault()}
              onMouseUp={(e) => e?.preventDefault()}
              edge="end"
              sx={{
                boxShadow: "none",
              }}
            >
              {visible ? <MdVisibilityOff /> : <MdVisibility />}
            </IconButton>
          </InputAdornment>
        ),
        ...props?.InputProps
      }}
    />
  )
});

export default PasswordTextField;