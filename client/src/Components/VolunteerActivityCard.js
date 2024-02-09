import React from "react";
import {styled} from "@mui/material/styles"
import { CardHeader } from "@mui/material";
import Rating from '@mui/material/Rating';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';

import { Box, Card, CardContent, CardMedia, IconButton, Menu, MenuItem, Typography } from '@mui/material';
import AccessTimeFilledIcon from '@mui/icons-material/AccessTimeFilled';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import PlaceIcon from '@mui/icons-material/Place';

export default function VolunteerActivityCard({ activity }) {
  return (
    <Card sx={{ display: 'flex', borderRadius: '1rem', m: 2, width: 300, height:180 }} style={{backgroundColor: "#D0E199"}}>
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>

            <CardContent sx = {{mt:0}}>
                <Typography component="div" variant="h5" sx = {{ fontWeight: 'bold', textDecoration: 'none'}} color="#000000" >
                    {activity.title}
                </Typography>
            </CardContent>

            <Box sx={{ display: 'flex', alignItems: 'center', ml: 1, mb: 1, fontSize: 16 }}>
                <CalendarTodayIcon sx={{mr: 0.4}} />
                <Typography sx={{maxWidth: 300}}>{activity.scheduleDays.map(day => day.substring(0, 3)).join(', ')}</Typography>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', ml: 1, mb: 1, fontSize: 16 }}>
                <AccessTimeFilledIcon sx={{mr: 0.4, mb: -0.7, ml: 0.4}} />
                <Typography sx={{maxWidth: 300}}>{activity.scheduleTime}</Typography>
            </Box>

            <Box sx={{ display: 'flex', ml: 1, mb: 1, fontSize:16 }}>
                <Typography>
                    <PlaceIcon sx = {{mr: 0.3, mb: -0.7, ml: 0.4}}/>
                    {activity.location.substring(0, 60)}
                    {activity.location.length > 60 && '...'}

                </Typography>
            </Box>
        </Box>
    </Card>
  );
}
