import * as React from 'react';
import { useState, useEffect } from 'react';
import { ButtonBase, Box, Card, CardContent, IconButton, Menu, MenuItem, Typography } from '@mui/material';
import AccessTimeFilledIcon from '@mui/icons-material/AccessTimeFilled';
import PlaceIcon from '@mui/icons-material/Place';
import PeopleIcon from '@mui/icons-material/People';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import axios from 'axios';

const formatDate = (date) => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    const d = new Date(date);
    const dd = d.getDate();
    const mmm = months[d.getMonth()];
    const yyyy = d.getFullYear();
    return `${dd} ${mmm} ${yyyy}`;
}

export default function AdminSessionCard({ session, handleClickSession, handleClickCapacity }) {
    const [loading, setLoading] = useState(true);
    const [activity, setActivity] = useState({});

    useEffect(() => {
        console.log("Session card: ", session);

        if (session) {
            axios.get(`http://localhost:4000/activities/${session.activityId}`)
                .then((response) => {
                    console.log(response.data.data)
                    if (response.data.succcess && response.data.data) {
                        setActivity(response.data.data);
                        setLoading(false);
                    }
                })
                .catch((error) => {
                    console.log(error);
                    setLoading(true);
                });
        }
    }, [session, activity, loading]);

    return loading ? (
        <p>Loading...</p>
    ) : (
        <Card sx={{ display: 'flex', flexDirection: 'column', borderRadius: '1rem', m: 2, width: 400, backgroundColor: "#D0E199" }}>
            <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', flexDirection: 'row' }}>
                    <ButtonBase onClick={() => handleClickSession(session)}>
                        <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#000000'}}>
                            {activity.title}
                        </Typography>
                    </ButtonBase>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', mt: 1, fontSize: 16 }}>
                    <CalendarTodayIcon sx={{mr: 0.4}} />
                    <Typography sx={{maxWidth: 300}}>{formatDate(session.sessionDate)}</Typography>
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

                <ButtonBase onClick={() => handleClickCapacity(session)}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mt: 1, fontSize: 16 }}>
                        <PeopleIcon sx={{mr: 0.4}} />
                        <Typography sx={{maxWidth: 300}}>{session.volunteers.length}</Typography>
                    </Box>
                </ButtonBase>
            </CardContent>
        </Card>
    );
}
