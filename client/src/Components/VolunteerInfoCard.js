import * as React from 'react';
import { useState, useEffect } from 'react';
import { Box, Card, CardContent, Typography, Button } from '@mui/material';
import BadgeIcon from '@mui/icons-material/Badge';
import PhoneIcon from '@mui/icons-material/Phone';
import TelegramIcon from '@mui/icons-material/Telegram';
import WcIcon from '@mui/icons-material/Wc';
import CakeIcon from '@mui/icons-material/Cake';
import FavoriteIcon from '@mui/icons-material/Favorite';
import HomeIcon from '@mui/icons-material/Home';
import axios from 'axios';

export default function VolunteerInfoCard({ userId }) {
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState({});

    // get user details
    useEffect(() => {
        if (loading && userId) {
            axios.get(`http://localhost:4000/user/${userId}`)
                .then((response) => {
                    setUser(response.data.data);
                    setLoading(false);
                })
                .catch((error) => {
                    console.log(error);
                    setLoading(true);
                });
        }

        console.log(user)
    }, [userId, user, loading]);

    return (loading) ? (
        <div>Loading...</div>
    ) : (
        <Card sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', m: 2, borderRadius: '1rem', maxWidth: '90%', backgroundColor: "#D0E199" }}>
            <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', flexDirection: 'row' }}>
                    <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#000000'}}>
                        {user.fullName}
                    </Typography>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', mt: 1, fontSize: 16 }}>
                    <BadgeIcon sx={{mr: 0.4}} />
                    <Typography sx={{maxWidth: 300}}>{user.username}</Typography>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', mt: 1, fontSize: 16 }}>
                    <PhoneIcon sx={{mr: 0.4}} />
                    <Typography sx={{maxWidth: 300}}>{user.mobile}</Typography>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', mt: 1, fontSize: 16 }}>
                    <TelegramIcon sx={{mr: 0.4}} />
                    <Typography sx={{maxWidth: 300}}>{user.telehandle}</Typography>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', mt: 1, fontSize: 16 }}>
                    <WcIcon sx={{mr: 0.4}} />
                    <Typography sx={{maxWidth: 300}}>{user.gender}</Typography>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', mt: 1, fontSize: 16 }}>
                    <CakeIcon sx={{mr: 0.4}} />
                    <Typography sx={{maxWidth: 300}}>{user.birthYear}</Typography>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', mt: 1, fontSize: 16 }}>
                    <FavoriteIcon sx={{mr: 0.4}} />
                    <Typography sx={{maxWidth: 300}}>{user.currentStatus}</Typography>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', mt: 1, fontSize: 16 }}>
                    <HomeIcon sx={{mr: 0.4}} />
                    <Typography sx={{maxWidth: 300}}>{user.location}</Typography>
                </Box>
            </CardContent>
        </Card>
    )
  }