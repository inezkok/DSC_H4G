import * as React from 'react';
import { Box, Card, CardContent, Typography } from '@mui/material';
import DoneIcon from '@mui/icons-material/Done';
import ChatBubbleIcon from '@mui/icons-material/ChatBubble';
import FoodBankIcon from '@mui/icons-material/FoodBank';

export default function AdminResponseCard({ response }) {

  return (
    <Card sx={{ display: 'flex', flexDirection: 'column', borderRadius: '1rem', m: 2, width: 400, backgroundColor: "#D0E199" }}>
        <CardContent>

            <Box sx={{ display: 'flex', alignItems: 'center', mt: 1, fontSize: 16 }}>
                <ChatBubbleIcon sx={{mr: 0.4}} />
                <Typography sx={{maxWidth: 300}}>{'1. ' + response.answers[0].optionId}</Typography>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', mt: 1, fontSize: 16 }}>
                <DoneIcon sx={{mr: 0.4}} />
                <Typography sx={{maxWidth: 300}}>{'2. ' + response.answers[1].optionId}</Typography>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', mt: 1, fontSize: 16 }}>
                <FoodBankIcon sx={{mr: 0.4}} />
                <Typography sx={{maxWidth: 300}}>{'3. ' + response.answers[2].optionId}</Typography>
            </Box>

        </CardContent>
    </Card>
  );
}
