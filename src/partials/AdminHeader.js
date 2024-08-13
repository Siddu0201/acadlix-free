import React from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  AppBar,
  Box,
  Button,
  Container,
  IconButton,
  Menu,
  MenuItem,
  Toolbar,
} from "@mui/material";
import menus from "../menu/AdminMenu";
import AcadlixLogo from "../images/acadlix_logo.png";
import MenuIcon from "@mui/icons-material/Menu";

const AdminHeader = () => {
  const [anchorElNav, setAnchorElNav] = React.useState(null);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        boxSizing: "border-box",
        marginLeft: {
          md: "-20px",
          xs: "-10px",
        },
      }}
    >
      <AppBar
        position="static"
        sx={{
          width: "auto",
          backgroundColor: "white",
        }}
      >
        <Container maxWidth="xl">
          <Toolbar
            disableGutters
            variant="dense"
            sx={{
              justifyContent: "space-between",
              minHeight: {
                md: "60px",
                xs: "45px",
              },
              paddingX: {
                md: 4,
                xs: 1,
              },
            }}
          >
            <Box>
              <Button
                LinkComponent={Link}
                to="/"
                variant="text"
                sx={{
                  "&:focus": {
                    boxShadow: "none",
                  },
                }}
              >
                <Box
                  component="img"
                  sx={{
                    height: {
                      md: 40,
                      xs: 30,
                    },
                  }}
                  alt="Acadlix logo."
                  src={AcadlixLogo}
                />
              </Button>
            </Box>
            <Box
              sx={{
                display: {
                  md: "flex",
                  xs: "none",
                },
              }}
            >
              {menus.length > 0 &&
                menus.map((menu, index) => (
                  <Button
                    key={index}
                    variant={location.pathname.startsWith(menu?.path) ? "contained" :"text"}
                    sx={{ display: "block" }}
                    LinkComponent={Link}
                    to={menu?.path}
                  >
                    {menu?.name}
                  </Button>
                ))}
            </Box>
            <Box
              sx={{
                display: {
                  md: "none",
                  xs: "flex",
                },
              }}
            >
              <Box>
                <IconButton
                  size="large"
                  aria-label="account of current user"
                  aria-controls="menu-appbar"
                  aria-haspopup="true"
                  onClick={handleOpenNavMenu}
                  color="primary"
                >
                  <MenuIcon />
                </IconButton>
                <Menu
                  id="menu-appbar"
                  anchorEl={anchorElNav}
                  anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "left",
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "left",
                  }}
                  open={Boolean(anchorElNav)}
                  onClose={handleCloseNavMenu}
                  sx={{
                    display: { xs: "block", md: "none" },
                  }}
                >
                  {menus.length > 0 &&
                    menus.map((menu, index) => (
                      <MenuItem 
                        key={index}
                        onClick={() => {
                          navigate(menu?.path);
                          handleCloseNavMenu();
                        }} 
                        sx={{
                        paddingX: 2,
                        paddingY: 1
                      }}>
                        <Button
                          key={index}
                          variant={location.pathname.startsWith(menu?.path) ? "contained" :"text"}
                          sx={{ display: "block" }}
                          // LinkComponent={Link}
                          // to={menu?.path}
                        >
                          {menu?.name}
                        </Button>
                      </MenuItem>
                    ))}
                </Menu>
              </Box>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
      <Outlet />
    </Box>
  );
};

export default AdminHeader;
