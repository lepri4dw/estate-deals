import React from 'react';
import { Button } from '@mui/material';
import { Link as NavLink } from 'react-router-dom';

const AnonMenu = () => {
  return (
    <>
      <Button component={NavLink} to="/register" color="inherit">Регистрация</Button>
      <Button component={NavLink} to="/login" color="inherit">Войти</Button>
    </>
  );
};

export default AnonMenu;