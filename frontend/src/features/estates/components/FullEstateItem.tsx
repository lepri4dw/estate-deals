import React, {useEffect, useState} from 'react';
import {useAppDispatch, useAppSelector} from "../../../app/hooks";
import {Link, useNavigate, useParams} from "react-router-dom";
import {
  selectEstateDeleting,
  selectEstateTogglingPublished,
  selectOneEstate,
  selectOneEstateFetching
} from "../estatesSlice";
import {deleteEstate, estateTogglePublished, fetchOneEstate} from "../estatesThunks";
import {selectUser} from "../../users/usersSlice";
import {Avatar, Button, Card, Chip, CircularProgress, Container, Grid, Typography} from "@mui/material";
import Carousel from 'react-material-ui-carousel';
import {apiURL} from "../../../constants";
import LocationOnIcon from '@mui/icons-material/LocationOn';
import {LoadingButton} from "@mui/lab";
import ImageModal from "../../../components/UI/ImageModal/ImageModal";
import dayjs from "dayjs";

const FullEstateItem = () => {
  const dispatch = useAppDispatch();
  const id = (useParams()).id as string;
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const estate = useAppSelector(selectOneEstate);
  const loading = useAppSelector(selectOneEstateFetching);
  const deleteLoading = useAppSelector(selectEstateDeleting);
  const publishedLoading = useAppSelector(selectEstateTogglingPublished);
  const user = useAppSelector(selectUser);
  const [selectedImage, setSelectedImage] = useState<string>('');

  const handleOpen = (image: string) => {
    setSelectedImage(apiURL + '/' + image);
    setOpen(true);
  }
  const handleClose = () => setOpen(false);

  const handleDelete = async () => {
    if (window.confirm('Подтвердите удаление этого объявления')) {
      await dispatch(deleteEstate(id));
      navigate('/'); // на личный кабинет
    }
  };

  const togglePublished = async () => {
    await dispatch(estateTogglePublished(id)).unwrap();
    dispatch(fetchOneEstate(id));
  }

  useEffect(() => {
    dispatch(fetchOneEstate(id));
  }, [dispatch, id]);

  return (
    <Container maxWidth="md">
      {loading ? <CircularProgress/> : estate && <Grid mt={3} container spacing={3} direction="column">
        <Grid item container>
          <Grid item xs>
            <Typography variant="h6" color="text.secondary">Опубликовано {dayjs(estate.createdAt).format('DD.MM.YYYY')}</Typography>
          </Grid>
          {!estate.isPublished && <Grid item xs container>
            <Chip label="на модерации" color="warning" style={{fontSize: '25px', padding: '8px', marginLeft: 'auto'}}/>
          </Grid>}
        </Grid>
        <Grid item xs>
          <Card style={{ width: '100%', padding: '16px' }}>
              <Grid container spacing={2} justifyContent="space-between" alignItems="center">
                <Grid item container alignItems="center" xs={8}>
                  <Grid item>
                    <Avatar sx={{ mr: 2, width: 60, height: 60 }} src={apiURL + '/' + estate.user.avatar} alt={estate.user.displayName} />
                  </Grid>
                  <Grid item>
                    <Typography variant="h4" component="span" >
                      {estate.user.displayName}
                    </Typography>
                  </Grid>
                </Grid>
                <Grid item xs={4}>
                  <Button color="success" variant="contained" sx={{ fontSize: 23 }}>
                    {estate.user.phoneNumber}
                  </Button>
                </Grid>
              </Grid>
          </Card>
        </Grid>
       <Grid container spacing={2} item xs>
          <Grid item xs={6}>
            <Typography variant="h3" mb={2}> {`${estate.numberOfRooms ? (estate.numberOfRooms + '-комн.') : ''} ${estate.estateType === 'Квартира' ? 'кв.' : estate.estateType}${estate.square ? (', ' + estate.square + `м${'\u00B2'}`) : ''} `}</Typography>
            <Grid spacing={2} container mb={2}>
              <Grid item>
                <Typography variant="h4">
                  Цена: {estate.usdPrice.toLocaleString()} $
                </Typography>
              </Grid>
              <Grid item>
                <Typography variant="h5">
                  {estate.kgsPrice.toLocaleString()} сом
                </Typography>
              </Grid>
            </Grid>
            <Typography variant="h5" mb={2} color="text.secondary"><LocationOnIcon/> {estate.town + ' ' + estate.address}</Typography>
            {estate.numberOfFloors && (estate.floor ? <Typography variant="h6" mb={2}>Этаж: <strong>{estate.floor}</strong> из <strong>{estate.numberOfFloors}</strong></Typography> :
              <Typography variant="h6" mb={2}>Количетсво этажей: <strong>{estate.numberOfFloors}</strong></Typography>)}
            {estate.condition && <Typography variant="h6" mb={2}>Состояние: <strong>{estate.condition}</strong></Typography>}
            {estate.numberOfRooms && <Typography variant="h6" mb={2}>Количество комнат: <strong>{estate.numberOfRooms}</strong></Typography>}
            {estate.square && <Typography variant="h6" mb={2}>Площадь: <strong>{`${estate.square} м${'\u00B2'}`}</strong></Typography>}
            {estate.landArea && <Typography variant="h6" mb={2}>Участок: <strong>{estate.landArea} соток</strong></Typography>}
            {(user?._id === estate?.user._id || user?.role === 'admin') && <Grid item container sx={{ mb: 3 }}>
              <Grid item sx={{ ml: 1 }}>
                <LoadingButton
                  color="error"
                  variant="contained"
                  loading={Boolean(deleteLoading)}
                  disabled={Boolean(deleteLoading)}
                  onClick={handleDelete}
                >
                  <span>Удалить</span>
                </LoadingButton>
              </Grid>
              <Grid item sx={{ ml: 1 }}>
                <Button
                  component={Link}
                  to={`/estates/edit/${id}`}
                  variant="contained"
                  color="primary"
                >
                  Редактировать
                </Button>
              </Grid>
              {user.role === 'admin' &&
                <Grid item sx={{ ml: 1 }} mt={!estate.isPublished ? 2 : 0}>
                  <LoadingButton
                    variant="contained"
                    color="warning"
                    onClick={togglePublished}
                    disabled={publishedLoading}
                    loading={publishedLoading}
                  >
                    {!estate.isPublished ? 'Опубликовать' : 'Скрыть'}
                  </LoadingButton>
                </Grid>}
            </Grid>}
          </Grid>
          <Grid item xs={6}>
            <Carousel animation="slide" autoPlay={false}>
              {estate.images.map(image => (
                  <img key={image} src={apiURL + '/' + image} alt={estate?.address} style={{width: '100%', height: '313px'}} onClick={() => handleOpen(image)}/>
              ))}
            </Carousel>
            <Typography variant="h6"><strong>Описание от продавца: </strong>{estate.description}</Typography>
          </Grid>
        </Grid>
      </Grid>}
      <ImageModal open={open} handleClose={handleClose} title={estate ? estate.address : ''} image={selectedImage}/>
    </Container>
  );
};

export default FullEstateItem;