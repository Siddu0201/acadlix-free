import React from 'react';
import { Button } from '@mui/material';

const CustomButton = (props) => {
  return (
    <Button
      variant="contained"
      className='customButton'
      sx={{
        textTransform: 'none',
        marginRight: '5px',
        height: '30px', // Adjust the height to make the button smaller
        marginTop: '10px',
        marginBottom: '5px',
        backgroundColor: '#13455b',
        borderRadius: '11px',
        color: 'white',
        paddingLeft: '10px',
        paddingRight: '10px',
        fontSize: 'small',
      }}
    >
      {props.btname}
    </Button>
  );
};

export default CustomButton;
