import React from "react";
import {styled} from "@mui/material/styles"
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import { CardHeader } from "@mui/material";
import Rating from '@mui/material/Rating';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';

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
    marginRight: "6rem",
    display: "inline-block",
    backgroundColor: '#D6F379'
}));

const StyledRating = styled(Rating)({
  '& .MuiRating-iconFilled': {
    color: '#ff6d75',
  },
  '& .MuiRating-iconHover': {
    color: '#ff3d47',
  },
});

const ActivityCardComponent = (props) => {
  return (
    <StyledCard sx={{ minWidth: 275 }} elevation={5}>
      <CardHeader title={props.title} />
      <CardContent>{new Date(props.date).toLocaleDateString()}
        <StyledRating
          name="customized-color"
          getLabelText={(value) => `${value} Heart${value !== 1 ? 's' : ''}`}
          icon={<FavoriteIcon fontSize="inherit" />}
          emptyIcon={<FavoriteBorderIcon fontSize="inherit" />}
        />
      </CardContent>
    </StyledCard>
  );
};

export default ActivityCardComponent;