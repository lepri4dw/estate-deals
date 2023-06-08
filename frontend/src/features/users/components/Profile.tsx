import React, {useEffect} from 'react';
import {useAppDispatch, useAppSelector} from "../../../app/hooks";
import {selectUser} from "../usersSlice";
import {selectEstates, selectEstatesFetching} from "../../estates/estatesSlice";
import {fetchEstates} from "../../estates/estatesThunks";
import {Alert, Button, CircularProgress, Grid, Typography} from "@mui/material";
import userIcon from '../../../assets/images/user-icon.jpg';
import {apiURL} from "../../../constants";
import EstateItem from "../../estates/components/EstateItem";
import WarningAmberOutlinedIcon from "@mui/icons-material/WarningAmberOutlined";
import {Link} from "react-router-dom";

const Profile = () => {
  const user = useAppSelector(selectUser);
  const dispatch = useAppDispatch();
  const estates = useAppSelector(selectEstates);
  const loading = useAppSelector(selectEstatesFetching);

  useEffect(() => {
    dispatch(fetchEstates({user: user?._id}));
  }, [dispatch, user]);

  return (
    <Grid container spacing={2} direction="column">
      <Grid container spacing={2} item>
        <Grid item xs={3}>
          <img
            src={user?.avatar ? `${apiURL}/${user.avatar}` : userIcon}
            alt={user?.displayName || 'User icon'}
            width={200}
          />
        </Grid>
        <Grid item xs={9} mt={5}>
          <Typography variant="h6">
            <b>Имя:</b> {user?.displayName}
          </Typography>

          <Typography variant="h6">
            <b>Email:</b> {user?.email}
          </Typography>

          <Typography variant="h6">
            <b>Телефон:</b> {user?.phoneNumber}
          </Typography>
        </Grid>
      </Grid>
      <Grid item>
        <Grid container spacing={2}>
          <Grid item>
            <Typography variant="h4" mb={3}>Мои объявления: </Typography>
          </Grid>
          <Grid item>
            <Button component={Link} to="/new-estate" variant="contained">Создать</Button>
          </Grid>
        </Grid>
        {loading ? <CircularProgress/> : <Grid container spacing={2}>
          {estates.length > 0 ? estates.map(estate => (
            <Grid key={estate._id} item xs={12} md={6} lg={4}>
              <EstateItem estate={estate}/>
            </Grid>
          )) : <Alert severity="warning" style={{fontSize: '25px', width: '100%'}} iconMapping={{
            warning: <WarningAmberOutlinedIcon fontSize="large"/>
          }}>У вас пока неи объявлений!</Alert>}
        </Grid>}
      </Grid>
    </Grid>
  );
};

export default Profile;