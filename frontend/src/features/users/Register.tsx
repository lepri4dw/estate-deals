import React, {useState} from 'react';
import {Link as RouterLink, useNavigate} from 'react-router-dom';
import {RegisterMutation} from '../../types';
import {Avatar, Box, Container, Grid, Link, TextField, Typography} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import {useAppDispatch, useAppSelector} from '../../app/hooks';
import {selectRegisterError, selectRegisterLoading} from './usersSlice';
import {googleLogin, register} from './usersThunks';
import {LoadingButton} from "@mui/lab";
import FileInput from "../../components/UI/FileInput/FileInput";
import {GoogleLogin} from "@react-oauth/google";

const Register = () => {
  const dispatch = useAppDispatch();
  const error = useAppSelector(selectRegisterError);
  const navigate = useNavigate();
  const loading = useAppSelector(selectRegisterLoading);

  const [state, setState] = useState<RegisterMutation>({
    email: '',
    phoneNumber: '',
    password: '',
    displayName: '',
    avatar: null
  });

  const inputChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    const {name, value} = event.target;
    setState(prevState => ({...prevState, [name]: value}));
  };

  const googleLoginHandler = async (credential: string) => {
    await dispatch(googleLogin(credential)).unwrap();
    navigate('/');
  };

  const submitFormHandler = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      await dispatch(register(state)).unwrap();
      navigate('/');
    } catch (e) {
      // error happened
    }
  };

  const phoneNumberPattern = '^+996\\d{9}$';

  const fileInputChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {name, files} = e.target;
    setState(prevState => ({
      ...prevState, [name]: files && files[0] ? files[0] : null,
    }));
  };

  const getFieldError = (fieldName: string) => {
    try {
      return error?.errors[fieldName].message;
    } catch {
      return undefined;
    }
  }

  return (
    <Container component="main" maxWidth="xs">
      <Box
        style={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Avatar sx={{m: 1, bgcolor: 'secondary.main'}}>
          <LockOutlinedIcon/>
        </Avatar>
        <Typography component="h1" variant="h5">
          Регистрация
        </Typography>
        <Box sx={{ pt: 2 }}>
          <GoogleLogin
            onSuccess={(credentialResponse) => {
              if (credentialResponse.credential) {
                void googleLoginHandler(credentialResponse.credential);
              }
            }}
            onError={() => {
              console.log('Login Failed');
            }}
          />
        </Box>
        <Box component="form" onSubmit={submitFormHandler} sx={{mt: 3}}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="Email"
                name="email"
                autoComplete="new-email"
                value={state.email} required
                onChange={inputChangeHandler}
                error={Boolean(getFieldError('email'))}
                helperText={getFieldError('email')}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                name="displayName"
                label="Имя"
                value={state.displayName}
                onChange={inputChangeHandler}
                error={Boolean(getFieldError('displayName'))}
                helperText={getFieldError('displayName')}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                label="Номер телефона +996 ХХХ ХХХ ХХХ"
                name="phoneNumber"
                autoComplete="new-phoneNumber"
                value={state.phoneNumber}
                onChange={inputChangeHandler}
                error={Boolean(getFieldError('phoneNumber'))}
                helperText={getFieldError('phoneNumber')}
                inputProps={{ pattern: phoneNumberPattern }}
                type="tel"
                sx={{ width: '100%' }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="password"
                label="Пароль"
                type="password"
                autoComplete="new-password"
                value={state.password} required
                onChange={inputChangeHandler}
                error={Boolean(getFieldError('password'))}
                helperText={getFieldError('password')}
              />
            </Grid>
          </Grid>
          <Grid item xs={12} sx={{mt: 2}}>
            <FileInput onChange={fileInputChangeHandler} name="avatar" label="Выберите картинку профиля"
                       error={Boolean(getFieldError('avatar'))} helperText={getFieldError('avatar')}/>
          </Grid>
          <LoadingButton
            type="submit"
            fullWidth
            variant="contained"
            sx={{mt: 3, mb: 2}}
            loading={loading}
            loadingIndicator="Loading…"
          >
            Завершить регистрацию
          </LoadingButton>
          <Grid container justifyContent="flex-end">
            <Grid item>
              <Link component={RouterLink} to="/login" variant="body2">
                Войти используя email и пароль
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
};

export default Register;