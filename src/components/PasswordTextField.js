import { MdVisibility, MdVisibilityOff } from '@acadlix/helpers/icons';
import { IconButton, InputAdornment } from '@mui/material';
import React from 'react'
import CustomTextField from './CustomTextField';

const PasswordTextField = ({ 
    label = "",
    name = "",
    onChange = () => {},
    formProps = {},
}) => {
    const [visible, setVisible] = React.useState(false);
    return (
        <CustomTextField
            fullWidth
            size="small"
            type={visible ? "text" : "password"}
            label={label}
            value={formProps?.watch(name)}
            onChange={onChange}
            InputProps={{
                endAdornment: (
                    <InputAdornment position="end">
                        <IconButton
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
            }}
        />
    )
}

export default PasswordTextField