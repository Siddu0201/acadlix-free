import React from 'react'
import { Link, Outlet } from 'react-router-dom'
import {AppBar, Box, Button, Container, Toolbar, Typography} from "@mui/material"
import menus from '../menu/AdminMenu';


const AdminHeader = () => {

  return (
    <Box sx={{
        boxSizing: 'border-box',
        marginLeft: '-20px'
    }}>
      <AppBar position='static' sx={{
        width: 'auto',
        backgroundColor: 'white',
      }}>
        <Container maxWidth="xl">
            <Toolbar disableGutters variant='dense' sx={{
              justifyContent: 'space-between',
              minHeight: '60px',
              paddingX: 4
            }}>
              <Box>
                <Button component={Link} to="/" variant='text' sx={{
                  '&:focus': {
                    boxShadow: 'none'
                  }
                }}>
                  <Typography variant="h6" color="primary">
                    ACADLIX
                  </Typography>
                </Button>
              </Box>
              <div style={{ display: 'flex'}}>
                {menus.length > 0 && menus.map((menu, index) => (
                  <Button
                    key={index}
                    sx={{color: 'text.secondary', display: 'block' }}
                    component={Link}
                    to={menu?.path}
                  >
                    {menu?.name}
                  </Button>
                ))}
              </div>
            </Toolbar>
        </Container>
      </AppBar>
      <Outlet />
    </Box>
  )
}

export default AdminHeader
