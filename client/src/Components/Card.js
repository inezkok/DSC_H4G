import * as React from 'react';
import { Card, CardContent, Typography, Stack, Button, Box, CardMedia } from "@mui/material"
import { LineChart } from '@mui/x-charts'

const card = (
    <React.Fragment><Stack
    direction="row"
  >
  <Card sx={{ display: 'flex',  borderRadius: '15px'}}>
  <Box sx={{ display: 'flex', flexDirection: 'column' }}>
    <CardContent sx={{ flex: '1 0 auto' }}>
      <Typography component="div" variant="h4">
        John Smith
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" component="div">
        Administrator
      </Typography>
    </CardContent>
  </Box>
  <CardMedia
    component="img"
    sx={{ width: 151 }}
    image=""
    alt="image"
  />
</Card>
<Card sx={{ display: 'flex',  borderRadius: '15px'}}>
  <Box sx={{ display: 'flex', flexDirection: 'column' }}>
    <CardContent sx={{ flex: '1 0 auto' }}>
        <CardMedia
        component="img"
        sx={{ width: 151 }}
        image="C:\Users\User\Documents\GitHub\DSC_H4G\client\src\Images\image 21.png"
        alt="image"
      />
      <Typography variant="subtitle1" color="text.secondary" component="div">
        Search here...
      </Typography>
    </CardContent>
  </Box>
  <CardMedia
    component="img"
    sx={{ width: 151 }}
    image="C:\Users\User\Documents\GitHub\DSC_H4G\client\src\Images\image 21.png"
    alt=""
  />
</Card></Stack>
  <div>
    <Typography sx={{ fontWeight: "bold", fontSize: "30px"}}>Dashboard</Typography>  
    <Button variant="contained">Contained</Button>
  </div>  
  <Stack
    direction="row"
    spacing={2}
  >
    <Card sx={{bgcolor: '#D6F379'}}>
      <CardContent>
        <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
          Donations
        </Typography>
        <Typography variant="h5" component="div" sx={{ fontWeight: "bold" }}>
          $7,750.00
        </Typography>
        <Typography sx={{ mb: 1.5 }} color="text.secondary">
          +$1,250 From last month
        </Typography>
      </CardContent>
    </Card>

      <Card sx={{bgcolor: '#FD5800'}}>
        <CardContent>
          <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
            Fundraising
          </Typography>
          <Typography variant="h5" component="div" sx={{ fontWeight: "bold" }}>
            $9,500.00
          </Typography>
          <Typography sx={{ mb: 1.5 }} color="text.secondary">
            +$4,000 From last month
          </Typography>
        </CardContent>
      </Card>

      <Card sx={{bgcolor: '#D6F379'}}>
        <CardContent>
          <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
            Volunteers
          </Typography>
          <Typography variant="h5" component="div" sx={{ fontWeight: "bold" }}>
            250
          </Typography>
          <Typography sx={{ mb: 1.5 }} color="text.secondary">
            +100 From last month
          </Typography>
        </CardContent>
      </Card>
  </Stack>
  <Card>
        <CardContent>
          <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
            Fundraising Statistics
          </Typography>
          <LineChart
            xAxis={[{ data: [1, 2, 3, 5, 8, 10] }]}
            series={[
              {
                curve: "linear",
                label: "High Fundraising",
                data: [2, 5.5, 2, 8.5, 1.5, 5],
              },
            ]}
            width={500}
            height={300}
          />
        </CardContent>
      </Card>
    </React.Fragment>
);

export default function OutlinedCard() {
    return (
        <Card variant="outlined">{card}</Card>
    )
}
   
