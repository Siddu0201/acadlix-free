import React from 'react';
import { USER_LOGO } from '../utils/constants';
import Annotations from './Annotations';
import NotVisBtn from '../Buttons/NotVisBtn';
import { Typography } from '@mui/material';

const Review = () => {
  return (
    <box className='w-3/12 border-black border-2'>
    <box className='flex'>
        <img className='w-24 h-24' src = {USER_LOGO}  />
        <Typography style = {{
        margin : '2px auto 2px auto',
      }} variant="h6">John Smith</Typography>
    </box>
    <box className='bg-gray-300 '>
    <Annotations />
    <box className='bg-blue-500 text-white font-bold p-1 flex'>General Awareness</box>
    <Typography>Choose a Question</Typography>

    
    <box className='flex flex-wrap w-10/12'>
    <NotVisBtn no = '1'/>
    <NotVisBtn no = '2'/>
    <NotVisBtn no = '3'/>
    <NotVisBtn no = '4'/>
    <NotVisBtn no = '5'/>
    <NotVisBtn no = '6'/>
    <NotVisBtn no = '7'/>
    <NotVisBtn no = '8'/>
    <NotVisBtn no = '9'/>
    <NotVisBtn no = '10'/>
    <NotVisBtn no = '11'/>
    <NotVisBtn no = '12'/>
    <NotVisBtn no = '13'/>
    <NotVisBtn no = '14'/>
    <NotVisBtn no = '15'/>
    <NotVisBtn no = '16'/>
    <NotVisBtn no = '17'/>
    <NotVisBtn no = '18'/>
    <NotVisBtn no = '19'/>
    <NotVisBtn no = '20'/>
    </box>
    </box>
    <box className="bg-blue-200 flex justify-center">
    <button className="bg-blue-400 text-white p-2 m-1 w-24">Submit</button>
    </box>
    </box>
  )
}

export default Review;
