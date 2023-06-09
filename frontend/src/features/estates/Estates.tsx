import React, {useEffect, useState} from 'react';
import {useAppDispatch, useAppSelector} from "../../app/hooks";
import {selectEstates, selectEstatesCount, selectEstatesFetching} from "./estatesSlice";
import {fetchEstates} from "./estatesThunks";
import {Alert, CircularProgress, Grid, Pagination, Typography} from "@mui/material";
import EstateItem from "./components/EstateItem";
import FilterForm from "./components/FilterForm";
import WarningAmberOutlinedIcon from '@mui/icons-material/WarningAmberOutlined';

const Estates = () => {
  const dispatch = useAppDispatch();
  const estates = useAppSelector(selectEstates);
  const loading = useAppSelector(selectEstatesFetching);
  const totalCount = useAppSelector(selectEstatesCount);
  const [page, setPage] = useState(1);
  const limit = 21;

  useEffect(() => {
    dispatch(fetchEstates({page, limit}));
  }, [dispatch, page, limit]);

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
      {totalCount > 21 && (
        <Grid item xs mt={2}>
          <Pagination
            count={Math.ceil(totalCount / 21)}
            page={page}
            onChange={(_, newPage) => setPage(newPage)}
          />
        </Grid>
      )}
    </Grid>
  );
};

export default Estates;