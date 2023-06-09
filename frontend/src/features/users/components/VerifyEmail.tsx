import React, { useEffect } from 'react';
import {
  Box,
  Button,
  CircularProgress,
  Container,
  Typography,
} from '@mui/material';
import {Link, useParams} from "react-router-dom";
import {useAppDispatch, useAppSelector} from "../../../app/hooks";
import {selectUser, selectVerifyEmailLoading} from "../usersSlice";
import {verifyEmail} from "../usersThunks";


const VerifyEmail = () => {
  const token = (useParams()).token as string;
  const verifyLoading = useAppSelector(selectVerifyEmailLoading);
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);

  useEffect(() => {
    void dispatch(verifyEmail(token));
  }, [dispatch, token]);

  return (
    <>
      {verifyLoading ? (
        <CircularProgress />
      ) : (
        user &&
        user.verified && (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: '100vh',
            }}
          >
            <Container maxWidth="sm">
              <Typography variant="h4" gutterBottom>
                Электронная почта подтверждена
              </Typography>
              <Typography variant="body1" gutterBottom>
                Спасибо за подтверждение вашей электронной почты. Теперь вы
                можете получать уведомления от нашего сайта.
              </Typography>
              <Box
                sx={{ display: 'flex', justifyContent: 'center', marginTop: 4 }}
              >
                <Button
                  variant="contained"
                  color="primary"
                  component={Link}
                  to="/" sx={{mr: 2}}
                >
                  На главную страницу
                </Button>
                <Button
                  variant="contained"
                  color="success"
                  component={Link}
                  to="/profile"
                >
                  На страницу профиля
                </Button>
              </Box>
            </Container>
          </Box>
        )
      )}
    </>
  );
};

export default VerifyEmail;
