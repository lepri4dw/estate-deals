import React from 'react';
import AppToolbar from "./components/UI/AppToolbar/AppToolbar";
import {Container, CssBaseline} from "@mui/material";
import {Route, Routes} from "react-router-dom";
import Register from "./features/users/Register";
import Login from "./features/users/Login";
import Estates from "./features/estates/Estates";
import NewEstate from "./features/estates/components/NewEstate";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";
import {useAppSelector} from "./app/hooks";
import {selectUser} from "./features/users/usersSlice";
import EditEstate from "./features/estates/components/EditEstate";
import FullEstateItem from "./features/estates/components/FullEstateItem";
import Profile from "./features/users/components/Profile";
import AddPhone from "./features/users/components/AddPhone";
import VerifyEmail from "./features/users/components/VerifyEmail";

function App() {
  const user = useAppSelector(selectUser);

  return (
    <div style={{position: 'relative'}}>
      <CssBaseline/>
      <header>
        <AppToolbar/>
      </header>
      <main>
        <Container maxWidth="xl">
          <Routes>
            <Route path="/profile" element={<ProtectedRoute isAllowed={Boolean(user)}><Profile/></ProtectedRoute>}/>
            <Route path="/register" element={<Register/>}/>
            <Route path="/verify-email/:token" element={<VerifyEmail/>}/>
            <Route path="/add-phone" element={<ProtectedRoute isAllowed={Boolean(user)}><AddPhone/></ProtectedRoute>}/>
            <Route path="/login" element={<Login/>}/>
            <Route path="/" element={<Estates/>}/>
            <Route path="/new-estate" element={<ProtectedRoute isAllowed={Boolean(user)}><NewEstate/></ProtectedRoute>}/>
            <Route path="/estates/:id" element={<FullEstateItem/>}/>
            <Route path="/estates/edit/:id" element={<ProtectedRoute isAllowed={Boolean(user)}><EditEstate/></ProtectedRoute>}/>
            <Route path="/*" element={<h1>Not Found! This page does not exist!</h1>}/>
          </Routes>
        </Container>
      </main>
    </div>
  );
}

export default App;
