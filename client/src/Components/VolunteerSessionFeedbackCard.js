import * as React from 'react';
import { useState, useEffect } from 'react';
import { Box, Card, CardContent, Typography, Button } from '@mui/material';
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

export default function VolunteerSessionFeedbackCard({ userId, session, handleClickReview }) {
    const [loading, setLoading] = useState(true);
    const [activity, setActivity] = useState({});
    const [reviewedStatus, setReviewedStatus] = useState(false);


    // get activity details of session
    useEffect(() => {
        if (session) {
            axios.get(`http://localhost:4000/activities/${session.activityId}`)
                .then((response) => {
                    setActivity(response.data.data);
                    setLoading(false);
                })
                .catch((error) => {
                    console.log(error);
                    setLoading(true);
                });
        }
    }, [session]);

    // check if volunteer has already reviewed the session
    useEffect(() => {
        if (session && userId && session.feedbackForm) {
            axios.get("http://localhost:4000/response")
                .then((res) => {
                    const responses = res.data.data;
                    const reviewed = responses.some((response) => response.feedbackFormId === session.feedbackForm && response.userId === userId);
                    setReviewedStatus(reviewed);
                    setLoading(false);
                })
                .catch((error) => {
                    console.log(error);
                    setLoading(false);
                });
        }
    }, [session, userId, reviewedStatus]);

    if (loading) {
        return <div>Loading...</div>
    } else if (reviewedStatus) {
        return (
            <Card sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', borderRadius: '1rem', maxWidth: 600, backgroundColor: "#D0E199" }}>
                <CardContent sx={{ display: 'flex', flexDirection: 'column', m: 2, maxWidth: 400}}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', flexDirection: 'row' }}>
                        <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#000000'}}>
                            {activity.title}
                        </Typography>
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
                </CardContent>

                <Button sx={{bgcolor: "#FFFFFF", borderRadius: "1rem"}} onClick={() => handleClickReview(session, reviewedStatus)}>
                    <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#000000'}}>
                        Reviewed
                    </Typography>
                </Button>
            </Card>
        )
    } else {
        return (
            <Card sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', borderRadius: '1rem', maxWidth: 600, backgroundColor: "#FA9654" }}>
                <CardContent sx={{ display: 'flex', flexDirection: 'column', m: 2, maxWidth: 400}}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', flexDirection: 'row' }}>
                        <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#000000'}}>
                            {activity.title}
                        </Typography>
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
                </CardContent>

                <Button sx={{bgcolor: "#FFFFFF", borderRadius: "1rem"}} onClick={() => handleClickReview(session, reviewedStatus)}>
                    <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#000000'}}>
                        Review
                    </Typography>
                </Button>
            </Card>
        )
    }
  }