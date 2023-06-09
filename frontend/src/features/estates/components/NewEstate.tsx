import React, {useEffect} from 'react';
import {useAppDispatch, useAppSelector} from "../../../app/hooks";
import {createEstate} from "../estatesThunks";
import {EstateMutation} from "../../../types";
import {useNavigate} from "react-router-dom";
import {Container, Grid, Typography} from "@mui/material";
import EstateForm from "./EstateForm";
import {selectUser} from "../../users/usersSlice";

const NewEstate = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const user = useAppSelector(selectUser);

  useEffect(() => {
    if (user && !user.phoneNumber) {
      navigate('/add-phone')
    }
  }, [])

  const onSubmit = async (estateMutation: EstateMutation) => {
    await dispatch(createEstate(estateMutation)).unwrap();
    navigate('/profile');
  };

  return (
    <Container maxWidth="md">
      <Grid container direction="column" spacing={2}>
        <Grid item xs>
          <Typography variant="h4">Создать объявление</Typography>
        </Grid>
        <Grid item xs>
            <EstateForm onSubmit={onSubmit}/>
        </Grid>
      </Grid>
    </Container>
  );
};

export default NewEstate;