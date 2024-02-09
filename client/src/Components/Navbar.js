import { useState, useEffect } from 'react';
import { AppBar, Box, Toolbar, IconButton, Typography, Menu, Container, Avatar, Button, Tooltip, MenuItem } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useCookies } from "react-cookie";
import axios from "axios";

const adminPages = ['Dashboard', 'Impact Tracker', "Program Tracker"];
const volunteerPages = ['Dashboard', 'Volunteering History'];
const settings = ['Profile','Logout'];

export default function NavBar() {
  const navigate = useNavigate();

  const [cookies, removeCookie] = useCookies([]);
  const [role, setRole] = useState("");
  const [username, setUsername] = useState("");
  const [anchorElUser, setAnchorElUser] = useState(null);

  useEffect(() => {
    const verifyCookie = async () => {
      if (!cookies.token) {
        navigate("/login");
        return;
      }
      
      const { data } = await axios.post("http://localhost:4000", {}, { withCredentials: true });
 
      const {status, user} = data;

      if (!user) {
        removeCookie("token");
        navigate("/login");
        return;
      }

      setUsername(user.username);
      setRole(user.role);

      return status
        ? null
        : (removeCookie("token"), navigate("/login"));
    };
    
    verifyCookie();
  }, [cookies, navigate, removeCookie]);

  function logout() {
    removeCookie("token");
    navigate("/login");
  }

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };
  
  function stringAvatar(name) {
    return {
      sx: {
        bgcolor: '#9FEDD7',
        color: 'black'
      },
      children: `${name.split(' ')[0][0]}`,
    };
  }

  const navigationBar = (command) => {
    switch (command) {
      case "Dashboard":
        if (role === "Admin") navigate("/admin/home");
        if (role === "Volunteer") navigate("/volunteer/home");
        break;
      case "Impact Tracker":
        // navigate to page
        alert("Impact Tracker");
        break;
      case "Program Tracker":
        // navigate to page
        if (role === "Admin") navigate("/admin/programtracker");
        break;
      case "Volunteering History":
        // navigate to page
        alert("Volunteering History");
        break;

      default:
        navigate("/");
    }
  }
  const settingsBar = (command) => {
    if (command === "Logout") {
        logout();
    } else if (command === "Profile") {
        // navigate to profile page
        navigate("/profile");
    }
  }

  return role === "Admin" ? (
    <AppBar position="static"  style={{ background: '#FA9654' }}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Typography
            variant="h6"
            noWrap
            component="a"
            sx={{
              mr: 2,
              display: { xs: 'none', md: 'flex' },
              flexGrow: 1,
              fontFamily: 'roboto',
              fontWeight: 700,
              letterSpacing: '.2rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            GUI
          </Typography>

          <Box sx={{ flexGrow: 0.03, display: { xs: 'none', md: 'flex' } }}>
            {adminPages.map((page) => (
              <Button
                key={page}
                onClick={() => navigationBar(page)}
                sx={{ my: 2, color: 'white', display: 'block' }}
              >
                {page}
              </Button>
            ))}
          </Box>

          <Box sx={{ flexGrow: 0.01, display: { xs: 'none', md: 'flex' } }}>
            <Tooltip title="Open settings">
              <IconButton 
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true" 
                onClick={handleOpenUserMenu} 
                sx={{ p: 0 }}
              >
                <Avatar {...stringAvatar(username)} />
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: '45px' }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              {settings.map((setting) => (
                <MenuItem key={setting} onClick={() => settingsBar(setting)}>
                    <Typography textAlign="center">
                        {setting}
                    </Typography> 
                </MenuItem>
              ))}
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  ) : (
    <AppBar position="static"  style={{ background: '#FA9654' }}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Typography
            variant="h6"
            noWrap
            component="a"
            sx={{
              mr: 2,
              display: { xs: 'none', md: 'flex' },
              flexGrow: 1,
              fontFamily: 'roboto',
              fontWeight: 700,
              letterSpacing: '.2rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            GUI
          </Typography>

          <Box sx={{ flexGrow: 0.03, display: { xs: 'none', md: 'flex' } }}>
            {volunteerPages.map((page) => (
              <Button
                key={page}
                onClick={() => navigationBar(page)}
                sx={{ my: 2, color: 'white', display: 'block' }}
              >
                {page}
              </Button>
            ))}
          </Box>

          <Box sx={{ flexGrow: 0.01, display: { xs: 'none', md: 'flex' } }}>
            <Tooltip title="Open settings">
              <IconButton 
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true" 
                onClick={handleOpenUserMenu} 
                sx={{ p: 0 }}
              >
                <Avatar {...stringAvatar(username)} />
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: '45px' }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              {settings.map((setting) => (
                <MenuItem key={setting} onClick={() => settingsBar(setting)}>
                    <Typography textAlign="center">
                        {setting}
                    </Typography> 
                </MenuItem>
              ))}
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}