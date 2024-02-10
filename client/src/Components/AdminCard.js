import React from "react";
import {styled} from "@mui/material/styles"
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import { CardHeader } from "@mui/material";

const StyledCard = styled((props) => (
    <Card
        {...props}
    />
  ))(({ theme }) => ({
    maxWidth: 300,
    height: '15vw',
      // margin: "0 auto",
      marginBottom: "2rem",
      marginTop: "2rem",
      marginRight: "3rem",
      display: "inline-block",
      backgroundColor: '#D6F379' 
  }));

  export default function AdminCardComponent({ title, count }) {

    return (
      <StyledCard sx={{ minWidth: 275 }} elevation={5}>
        <CardHeader title={title} />
        <CardContent sx={{ml: 14}}>
          {count}
        </CardContent>
      </StyledCard>
    );
  };
  
  