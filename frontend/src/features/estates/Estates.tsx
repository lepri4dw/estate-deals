import React, {useEffect} from 'react';
import {useAppDispatch, useAppSelector} from "../../app/hooks";
import {selectEstates, selectEstatesFetching} from "./estatesSlice";
import {fetchEstates} from "./estatesThunks";
import {CircularProgress, Grid, Typography} from "@mui/material";
import EstateItem from "./components/EstateItem";
import FilterForm from "./components/FilterForm";

const Estates = () => {
  const dispatch = useAppDispatch();
  const estates = useAppSelector(selectEstates);
  const loading = useAppSelector(selectEstatesFetching);

  useEffect(() => {
    dispatch(fetchEstates());
  }, [dispatch]);

  return (
    <Grid container direction="column" spacing={3}>
      <Grid item>
        <FilterForm/>
      </Grid>
      <Grid item>
        <Typography variant="h4">
          Обьявления
        </Typography>
      </Grid>
      {loading ? <CircularProgress/> : <Grid item container spacing={2}>
        {estates.map(estate => (
          <Grid key={estate._id} item xs={12} md={6} lg={4}>
            <EstateItem estate={estate}/>
          </Grid>
        ))}
      </Grid>}
    </Grid>
  );
};

export default Estates;