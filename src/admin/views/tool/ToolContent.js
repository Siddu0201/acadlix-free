import React from "react";
import {
  Box,
  Card,
  useTheme,
  useMediaQuery,
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Drawer,
  List,
  ListItemButton,
  ListItemText,
  Grid,
} from "@mui/material";
import { __ } from "@wordpress/i18n";
import { useNavigate } from "react-router-dom";
import ImportExport from "./section/ImportExport";
import { IoMenu } from "@acadlix/helpers/icons";

const ToolContent = ({
  selected = 'import_export',
  filteredToolRoutes = []
}) => {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("sm"));

  const [open, setOpen] = React.useState(isDesktop ? true : false);
  const handleDrawerToggle = () => {
    setOpen(!open);
  };

  return (
    <Box>
      <Grid
        container
        spacing={{ xs: 2, sm: 4 }}
        sx={{
          padding: {
            xs: 2,
            sm: 4,
          },
        }}
      >
        <Grid size={{ lg: 12, md: 12, sm: 12, xs: 12 }}>
          <AppBar
            position="static"
          >
            <Toolbar>
              <IconButton
                size="large"
                edge="start"
                color="inherit"
                aria-label="menu"
                sx={{ mr: 2 }}
                onClick={handleDrawerToggle}
              >
                <IoMenu />
              </IconButton>
              <Typography
                variant="h3"
                component="div"
                sx={{
                  color: 'primary.contrastText',
                }}
              >
                {__('Tools', 'acadlix')}
              </Typography>
            </Toolbar>
          </AppBar>
        </Grid>
        <DesktopSidebar
          selected={selected}
          isDesktop={isDesktop}
          open={open}
          filteredToolRoutes={filteredToolRoutes}
        />
        <MobileSidebar
          selected={selected}
          isDesktop={isDesktop}
          open={open}
          setOpen={setOpen}
          filteredToolRoutes={filteredToolRoutes}
        />

        <Grid size={{
          lg: open ? 9 : 12,
          md: open ? 9 : 12,
          sm: open ? 8 : 12,
          xs: 12
        }}>
          {
            selected === "import_export" && (
              <ImportExport />
            )
          }
          
          {/* <React.Suspense fallback={null}>
            <SettingProContent
              {...methods}
              selected={selected}
              isPending={updateMutation?.isPending}
            />
          </React.Suspense> */}
        </Grid>
      </Grid>
    </Box>
  )
}

export default ToolContent

const DesktopSidebar = ({ selected, isDesktop, open, filteredToolRoutes }) => {
  const navigate = useNavigate();
  if (!isDesktop) return null;
  return (
    <Grid
      size={{
        lg: open ? 3 : 0,
        md: open ? 3 : 0,
        sm: open ? 4 : 0,
        xs: 12
      }}
      sx={{
        display: {
          lg: open ? 'block' : 'none',
          md: open ? 'block' : 'none',
          sm: open ? 'block' : 'none',
          xs: 'none',
        },
      }}
    >
      <Card sx={{ height: '100%' }}>
        <List component="nav">
          {
            filteredToolRoutes.map((route, index) => (
              <ListItemButton
                key={index}
                selected={selected === route.name}
                onClick={() => navigate(route.path)}
              >
                <ListItemText
                  primary={route.label}
                  slotProps={{
                    primary: {
                      sx: {
                        color: selected === route.name ? 'primary.main' : 'text.primary',
                      }
                    }
                  }}
                />
              </ListItemButton>
            ))
          }
        </List>
      </Card>
    </Grid>
  )
}

const MobileSidebar = ({ selected, isDesktop, open, setOpen, filteredToolRoutes }) => {
  const navigate = useNavigate();
  if (isDesktop) return null;
  return (
    <Box>
      <Drawer
        variant="temporary"
        anchor="left"
        open={open}
        onClose={() => setOpen(false)}
        sx={{
          '& .MuiDrawer-paper': {
            width: '200px',
            top: "46px"
          },
        }}
      >
        <List component="nav">
          {
            filteredToolRoutes.map((route, index) => (
              <ListItemButton
                key={index}
                selected={selected === route.name}
                onClick={() => {
                  navigate(route.path);
                  setOpen(false);
                }}
              >
                <ListItemText
                  primary={route.label}
                  slotProps={{
                    primary: {
                      sx: {
                        color: selected === route.name ? 'primary.main' : 'text.primary',
                      }
                    }
                  }}
                />
              </ListItemButton>
            ))
          }
        </List>
      </Drawer>
    </Box>
  )

}