import React, {useState} from 'react';
import {Avatar, Box, Container, Grid, TextField, Typography} from "@mui/material";
import {useAppDispatch, useAppSelector} from "../../../app/hooks";
import NoEncryptionGmailerrorredIcon from '@mui/icons-material/NoEncryptionGmailerrorred';
import {selectRegisterError, selectRegisterLoading} from "../usersSlice";
import {addPhone} from "../usersThunks";
import {useNavigate} from "react-router-dom";
import {LoadingButton} from "@mui/lab";

const AddPhone = () => {
  const dispatch = useAppDispatch();
  const [state, setState] = useState('');
  const error = useAppSelector(selectRegisterError);
  const loading = useAppSelector(selectRegisterLoading);
  const navigate = useNavigate();

  const getFieldError = (fieldName: string) => {
    try {
      return error?.errors[fieldName].message;
    } catch {
      return undefined;
    }
  }

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setState(event.target.value);
  }

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await dispatch(addPhone(state)).unwrap();
    navigate('/profile');
  }

  return (
    <Container component="main" maxWidth="sm">
      <Box
        style={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
          <NoEncryptionGmailerrorredIcon />
        </Avatar>

        <Typography variant="h5" textAlign="center">
          Для создания объявления добавьте свой номер телефона
        </Typography>
        <Box
          component="form"
          onSubmit={onSubmit}
          sx={{ mt: 3, width: '100%' }}
        >
          <Grid container direction="column" spacing={2}>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                label="Номер телефона +996 ХХХ ХХХ ХХХ"
                name="phoneNumber"
                autoComplete="new-phoneNumber"
                value={state}
                onChange={onChange}
                error={Boolean(getFieldError('phoneNumber'))}
                helperText={getFieldError('phoneNumber')}
                type="tel" required
                sx={{ width: '100%' }}
              />
            </Grid>
            <Grid item xs={12} sx={{ width: '100%' }}>
              <LoadingButton
                variant="contained"
                type="submit"
                sx={{ mb: 2 }}
                fullWidth loading={loading}
                loadingIndicator="Loading..."
              >
                Отправить телефон
              </LoadingButton>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
};

export default AddPhone;