import React, { useState } from 'react';
import { User } from '../../../types';
import {Avatar, Button, CircularProgress, Menu, MenuItem} from '@mui/material';
import {useAppDispatch, useAppSelector} from '../../../app/hooks';
import { logout } from '../../../features/users/usersThunks';
import {selectLogoutLoading} from "../../../features/users/usersSlice";
import {apiURL} from "../../../constants";
import {Link} from "react-router-dom";

interface Props {
  user: User;
}

const UserMenu: React.FC<Props> = ({user}) => {
  const dispatch = useAppDispatch();
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const logoutLoading = useAppSelector(selectLogoutLoading);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <>
      <Button
        onClick={handleClick}
        color="inherit"
      >
        {user.displayName} <Avatar sx={{ml: 2}} src={apiURL + '/' + user.avatar} alt={user.email}/>
      </Button>
      <Menu
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <MenuItem component={Link} to="/new-estate">Разместить объявление</MenuItem>
        <MenuItem>My account</MenuItem>
        <MenuItem onClick={handleLogout} disabled={logoutLoading}>{logoutLoading && <CircularProgress size={20} sx={{mr: 1}}/>}Выйти</MenuItem>
      </Menu>
    </>
  );
};

export default UserMenu;