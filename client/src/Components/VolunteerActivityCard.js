import * as React from 'react';
import { useState } from 'react';
import { ButtonBase, Box, Card, CardContent, IconButton, Menu, MenuItem, Typography } from '@mui/material';
import AccessTimeFilledIcon from '@mui/icons-material/AccessTimeFilled';
import PlaceIcon from '@mui/icons-material/Place';
import PeopleIcon from '@mui/icons-material/People';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';

export default function VolunteerActivityCard({ activity, handleClickActivity }) {
  return (
    <Card sx={{ display: 'flex', flexDirection: 'column', borderRadius: '1rem', m: 2, width: 400, backgroundColor: "#D0E199" }}>
        <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', flexDirection: 'row' }}>
                <ButtonBase onClick={() => handleClickActivity(activity)}>
                    <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#000000'}}>
                        {activity.title}
                    </Typography>
                </ButtonBase>
            </Box>

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
