import React from 'react';
import { Table, TableHead, TableRow, TableCell, Typography } from '@mui/material';
import '../styling.css';

const ResultTable = () => {
  return (
    <div>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell className='pos'>Pos.</TableCell>
            <TableCell className='person-name'>Name</TableCell>
            <TableCell className='ent'>Entered On</TableCell>
            <TableCell className='pts'>Points</TableCell>
            <TableCell className='pts'>Result</TableCell>
          </TableRow>
        </TableHead>
        <TableRow>
          <TableCell>1.</TableCell>
          <TableCell>Admin</TableCell>
          <TableCell>2024/01/17 3:28 PM</TableCell>
          <TableCell>1</TableCell>
          <TableCell>100%</TableCell>
        </TableRow>
      </Table>
    </div>
  );
};

export default ResultTable;
