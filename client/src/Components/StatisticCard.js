import React from "react";
import {styled} from "@mui/material/styles"
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import { CardHeader } from "@mui/material";
import { LineChart } from '@mui/x-charts';

const StyledCard = styled((props) => (
    <Card
        {...props}
    />
  ))(({ theme }) => ({
    maxWidth: "100%",
    height: '25vw',
      // margin: "0 auto",
      marginBottom: "2rem",
      marginTop: "2rem",
      marginRight: "6rem",
      display: "inline-block",
      backgroundColor: '#F4F4F4' 
  }));

  const StatsCardComponent = (props) => {
    const {title,content}=props
  
    return (
      <StyledCard sx={{ minWidth: 275 }} elevation={5}>
        <CardHeader title={title} />
        <CardContent>{content}
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
      </StyledCard>
    );
  };
  
  export default StatsCardComponent;