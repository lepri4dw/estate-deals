import React, {useEffect} from 'react';
import {useAppDispatch, useAppSelector} from "../../../app/hooks";
import {useNavigate, useParams} from "react-router-dom";
import {EstateMutation} from "../../../types";
import {fetchOneEstate, removeImage, updateEstate} from "../estatesThunks";
import {selectOneEstate} from "../estatesSlice";
import {Container, Grid, Typography} from "@mui/material";
import EstateForm from "./EstateForm";

const EditEstate = () => {
  const dispatch = useAppDispatch();
  const id = (useParams()).id as string;
  const navigate = useNavigate();
  const estate = useAppSelector(selectOneEstate);

  useEffect(() => {
    dispatch(fetchOneEstate(id));
  }, [dispatch, id]);

  const onSubmit = async (estateMutation: EstateMutation) => {
    await dispatch(updateEstate({id, estate: estateMutation})).unwrap();
    navigate(`/estates/${id}`);
  };

  const onDelete = async (index: number) => {
    await dispatch(removeImage({estateId: id, index})).unwrap();
    dispatch(fetchOneEstate(id));
  }

  const existingEstate = estate && {
    usdPrice: estate.usdPrice.toString(),
    kgsPrice: estate.kgsPrice.toString(),
    floor: estate.floor ? estate.floor.toString() : '',
    numberOfRooms: estate.numberOfRooms ? estate.numberOfRooms.toString() : '',
    numberOfFloors: estate.numberOfFloors ? estate.numberOfFloors.toString() : '',
    square: estate.square ? estate.square.toString() : '',
    condition: estate.condition,
    town: estate.town,
    description: estate.description,
    dealType: estate.dealType,
    landArea: estate.landArea ?  estate.landArea.toString() : '',
    address: estate.address,
    estateType: estate.estateType,
    images: null,
  };

  console.log(existingEstate)
  return (
    <Container maxWidth="md">
      <Grid container direction="column" spacing={2}>
        <Grid item xs>
          <Typography variant="h4">Редактировать объявление</Typography>
        </Grid>
        <Grid item xs>
          <EstateForm onSubmit={onSubmit} existingEstate={existingEstate || undefined} isEdit images={estate?.images} onDelete={onDelete}/>
        </Grid>
      </Grid>
    </Container>
  );
};

export default EditEstate;