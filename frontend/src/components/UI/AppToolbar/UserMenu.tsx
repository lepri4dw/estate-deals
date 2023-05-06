import React, { useState } from 'react';
import { User } from '../../../types';
import {Avatar, Button, CircularProgress, Menu, MenuItem} from '@mui/material';
import {useAppDispatch, useAppSelector} from '../../../app/hooks';
import { logout } from '../../../features/users/usersThunks';
import {selectLogoutLoading} from "../../../features/users/usersSlice";
import {apiURL} from "../../../constants";

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
        Hello, {user.displayName} <Avatar sx={{ml: 2}} src={apiURL + '/' + user.avatar} alt={user.username}/>
      </Button>
      <Menu
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <MenuItem>Profile</MenuItem>
        <MenuItem>My account</MenuItem>
        <MenuItem onClick={handleLogout} disabled={logoutLoading}>{logoutLoading && <CircularProgress size={20} sx={{mr: 1}}/>}Logout</MenuItem>
      </Menu>
    </>
  );
};

export default UserMenu;