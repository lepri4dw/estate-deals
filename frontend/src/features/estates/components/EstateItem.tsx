import React from 'react';
import {Estate} from "../../../types";
import {Box, Card, CardActionArea, CardContent, CardMedia, Chip, Grid, styled, Typography} from "@mui/material";
import {apiURL} from "../../../constants";
import {Link} from "react-router-dom";

interface Props {
  estate: Estate;
}

const ImageCardMedia = styled(CardMedia)({
  height: 0,
  paddingTop: '56.25%',
});

const EstateItem: React.FC<Props> = ({estate}) => {
  return (
    <Card component={Link} to={'/estates/' + estate._id} style={{textDecoration: "none", position: 'relative', display: 'block'}} >
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
                {estate.usdPrice.toLocaleString()} $
              </Typography>
            </Grid>
            <Grid item>
              <Typography variant="h6">
                {estate.kgsPrice.toLocaleString()} сом
              </Typography>
            </Grid>
          </Grid>
          <Typography variant="body1">
            {`${estate.numberOfRooms ? (estate.numberOfRooms + '-комн.') : ''} ${estate.estateType === 'Квартира' ? 'кв.' : estate.estateType}${estate.square ? (', ' + estate.square + `м${'\u00B2'}`) : ''}`}
          </Typography>
          <Typography variant="body2" >
            {estate.address}
          </Typography>
        </CardContent>
      </CardActionArea>
      {!estate.isPublished && <Box style={{position: 'absolute', top: '15px', right: '15px'}}>
        <Chip label="на модерации" color="warning" style={{fontSize: '20px', padding: '8px'}}/>
      </Box>}
    </Card>
  );
};

export default EstateItem;