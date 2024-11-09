
  // src/App.js
  import React from "react";
  import { useState } from "react";
  import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
  import PublicLayout from "./layouts/publicLayout";
  import AdminLayout from "./layouts/adminLayout";
  import Home from "./pages/client/home/home";
  import Register from "./pages/client/register/register";
  import Login from "./pages/client/login/login";
  import Detailmovie from "./pages/client/detailmovie/detailmovie";
  import SearchResult from "./pages/client/search/searchResult";
  import ForgotPassword from "./pages/client/login/forgotPassowrd";
  import ResetPassword from "./pages/client/login/Reset";
  import Dashboard from "./pages/admin/dashboard/Home";
  import DramaInput from './pages/admin/InputDrama/InputDrama';
  import ListDrama from "./pages/admin/ListDrama/ListDrama";
  import ValidateDrama from "./pages/admin/ValidateDrama/ValidateDrama";
  import ValidateHistory from "./pages/admin/ValidateHistory/validateHistory"; // Import ValidateHistory component
  import ReviewManager from "./pages/admin/ReviewManager/ReviewManager";
  // import ActorManager from './InputActor/InputActors';
  import GenreManager from "./pages/admin/InputGenres/InputGenres";
  import CountryManager from "./pages/admin/InputCountry/InputCountry";
  import AwardsManager from "./pages/admin/InputAward/InputAward";
  import UserSetting from "./pages/admin/UserSettings/UserSetting";
  import MovieTrash from "./pages/admin/MovieTrash/movieTrash"; // Import MovieTrash component
  import ActorManager from './pages/admin/InputActor/InputActors'
  import "./app.scss";

  function App() {
    return (
      <Router>
      <Routes>
        {/* Public Routes */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/movies/:id" element={<Detailmovie />} />
          <Route path="/searchresult" element={<SearchResult />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route path="/forgot-password" element={<ForgotPassword/>} />
        </Route>

          {/* Admin Routes */}
          <Route
            element={
              <AdminLayout
              />
            }
          >
            <Route path="/movie-input" element={<DramaInput />} />
            <Route path="/movie-list" element={<ListDrama />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/validate-drama" element={<ValidateDrama />} />
            <Route path="/validate-history" element={<ValidateHistory />} />
            <Route path="/manage-review" element={<ReviewManager />} />
            <Route path="/manage-country" element={<CountryManager />} />
            <Route path="/manage-awards" element={<AwardsManager />} />
            <Route path="/manage-genre" element={<GenreManager />} />
            <Route path="/movie-trash" element={<MovieTrash />} />
            <Route path="/manage-actor" element={<ActorManager />} />
            <Route path="/users" element={<UserSetting />} />
          </Route>
        </Routes>
      </Router>
    );
  }
  export default App;
