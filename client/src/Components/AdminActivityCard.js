import * as React from 'react';
import { useState } from 'react';
import { ButtonBase, Box, Card, CardContent, IconButton, Menu, MenuItem, Typography } from '@mui/material';
import AccessTimeFilledIcon from '@mui/icons-material/AccessTimeFilled';
import PlaceIcon from '@mui/icons-material/Place';
import PeopleIcon from '@mui/icons-material/People';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

export default function AdminActivityCard({ activity, handleEditActivity, handleDeleteActivity, handleClickActivity }) {
    const [anchorElActivity, setAnchorElActivity] = useState(null);
    const settings = ['Edit','Delete'];

    const handleOpenActivityMenu = (event) => {
        setAnchorElActivity(event.currentTarget);
    };

    const handleCloseActivityMenu = () => {
        setAnchorElActivity(null);
    };

    const settingsBar = (command) => {
        if (command === "Edit") {
            handleEditActivity(activity);
        } else if (command === "Delete") {
            handleDeleteActivity(activity);
        }
    };

    const settingsUI = (command) => {
        if (command === "Edit") {
            return <EditIcon color="primary" sx = {{mb: -0.5, ml: -0.9, mr: 0.8}}/>;
        } else if (command === "Delete") {
            return <DeleteIcon color="error" sx = {{mb: -0.5, ml: -1, mr: 0.8}}/>;
        }
    };

  return (
    <Card sx={{ display: 'flex', flexDirection: 'column', borderRadius: '1rem', m: 2, width: 400, backgroundColor: "#D0E199" }}>
        <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', flexDirection: 'row' }}>
                <ButtonBase onClick={() => handleClickActivity(activity)}>
                    <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#000000'}}>
                        {activity.title}
                    </Typography>
                </ButtonBase>

                <IconButton aria-label="settings" onClick={handleOpenActivityMenu}>
                    <MoreVertIcon />
                </IconButton>
            </Box>

            <Menu
                sx={{ mt: '35px' }}
                anchorEl={anchorElActivity}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                keepMounted
                transformOrigin={{ vertical: 35, horizontal: 'left' }}
                open={Boolean(anchorElActivity)}
                onClose={handleCloseActivityMenu}
            >
            {settings.map((setting) => (
                <MenuItem key={setting} onClick={() => settingsBar(setting)}>
                <Typography textAlign="center">
                    {settingsUI(setting)}
                    {setting}
                </Typography> 
                </MenuItem>
            ))}
            </Menu>

            <Box sx={{ display: 'flex', alignItems: 'center', mt: 1, fontSize: 16 }}>
                <CalendarTodayIcon sx={{mr: 0.4}} />
                <Typography sx={{maxWidth: 300}}>{activity.scheduleDays.map(day => day.substring(0, 3)).join(', ')}</Typography>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', mt: 1, fontSize: 16 }}>
                <AccessTimeFilledIcon sx={{mr: 0.4}} />
                <Typography sx={{maxWidth: 300}}>{activity.scheduleTime}</Typography>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', mt: 1, fontSize: 16 }}>
                <PlaceIcon sx={{mr: 0.4}} />
                <Typography>
                    {activity.location.substring(0, 60)}
                    {activity.location.length > 60 && '...'}
                </Typography>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', mt: 1, fontSize: 16 }}>
                <PeopleIcon sx={{mr: 0.4}} />
                <Typography sx={{maxWidth: 300}}>{activity.capacity}</Typography>
            </Box>
        </CardContent>
    </Card>
  );
}
