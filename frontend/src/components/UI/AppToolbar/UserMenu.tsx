import React, { useState } from 'react';
import { User } from '../../../types';
import {Avatar, Button, CircularProgress, Menu, MenuItem} from '@mui/material';
import {useAppDispatch, useAppSelector} from '../../../app/hooks';
import { logout } from '../../../features/users/usersThunks';
import {selectLogoutLoading} from "../../../features/users/usersSlice";
import {apiURL} from "../../../constants";
import {Link, useNavigate} from "react-router-dom";
import {fetchEstates} from "../../../features/estates/estatesThunks";

interface Props {
  user: User;
}

const UserMenu: React.FC<Props> = ({user}) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const logoutLoading = useAppSelector(selectLogoutLoading);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    await dispatch(logout()).unwrap();
    navigate('/');
    dispatch(fetchEstates());
  };

  return (
    <>
      <Button
        onClick={handleClick}
        color="inherit"
      >
        {user.displayName} <Avatar sx={{ml: 2}} src={apiURL + '/' + user.avatar} alt={user.displayName}/>
      </Button>
      <Menu
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        {user.phoneNumber && <MenuItem component={Link} to="/new-estate">Разместить объявление</MenuItem>}
        <MenuItem component={Link} to="/profile">Мой профиль</MenuItem>
        <MenuItem onClick={handleLogout} disabled={logoutLoading}>{logoutLoading && <CircularProgress size={20} sx={{mr: 1}}/>}Выйти</MenuItem>
      </Menu>
    </>
  );
};

export default UserMenu;