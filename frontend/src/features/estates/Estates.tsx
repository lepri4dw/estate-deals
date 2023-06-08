import React, {useEffect} from 'react';
import {useAppDispatch, useAppSelector} from "../../app/hooks";
import {selectEstates, selectEstatesFetching} from "./estatesSlice";
import {fetchEstates} from "./estatesThunks";
import {Alert, CircularProgress, Grid, Typography} from "@mui/material";
import EstateItem from "./components/EstateItem";
import FilterForm from "./components/FilterForm";
import WarningAmberOutlinedIcon from '@mui/icons-material/WarningAmberOutlined';

const Estates = () => {
  const dispatch = useAppDispatch();
  const estates = useAppSelector(selectEstates);
  const loading = useAppSelector(selectEstatesFetching);

  useEffect(() => {
    dispatch(fetchEstates());
  }, [dispatch]);

  return (
    <Grid container direction="column" spacing={3} mb={5}>
      <Grid item>
        <FilterForm/>
      </Grid>
      <Grid item>
        <Typography variant="h4">
          Объявления
        </Typography>
      </Grid>
      {loading ? <CircularProgress/> : <Grid item container spacing={2}>
        {estates.length > 0 ? estates.map(estate => (
          <Grid key={estate._id} item xs={12} md={6} lg={4}>
            <EstateItem estate={estate}/>
          </Grid>
        )) : <Alert severity="warning" style={{fontSize: '25px', width: '100%'}} iconMapping={{
          warning: <WarningAmberOutlinedIcon fontSize="large"/>
        }}>По таким параметрам пока нет объявлений!</Alert>}
      </Grid>}
    </Grid>
  );
};

export default Estates;