import React from 'react';
import {Estate} from "../../../types";
import {Card, CardActionArea, CardContent, CardMedia, Grid, styled, Typography} from "@mui/material";
import {apiURL} from "../../../constants";
import {Link} from "react-router-dom";

interface Props {
  estate: Estate;
}

const ImageCardMedia = styled(CardMedia)({
  height: 0,
  paddingTop: '56.25%', // 16:9
});

const EstateItem: React.FC<Props> = ({estate}) => {
  return (
    <Card component={Link} to={'/estates/' + estate._id} style={{textDecoration: "none"}}>
      <CardActionArea>
        <ImageCardMedia
          sx={{ height: 140 }}
          image={`${apiURL}/${estate.images[0]}`}
          title={estate.address}
        />
        <CardContent>
          <Grid container item spacing={2}>
            <Grid item>
              <Typography variant="h5">
                {estate.usdPrice} $
              </Typography>
            </Grid>
            <Grid item>
              <Typography variant="h6">
                {estate.kgsPrice.toLocaleString()} сом
              </Typography>
            </Grid>
          </Grid>

          <Typography variant="body1">
            {`${estate.numberOfRooms}-комн. ${estate.estateType === 'Квартира' ? 'кв.' : estate.estateType}, ${estate.square} м${'\u00B2'}`}
          </Typography>
          <Typography variant="body2" >
            {estate.address}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default EstateItem;