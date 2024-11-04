
  // src/App.js
  import React from "react";
  import { useState } from "react";
  import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
  import PublicLayout from "./layouts/publicLayout";
  import AdminLayout from "./layouts/adminLayout";
  import Home from "./home/home";
  import Register from "./register/register";
  import Login from "./login/login";
  import Detailmovie from "./detailmovie/detailmovie";
  import SearchResult from "./search/searchResult";
  import ForgotPassword from "./login/forgotPassowrd";
  import ResetPassword from "./login/Reset";
  import Dashboard from "./dashboard/Home";
  import DramaInput from './InputDrama/InputDrama';
  import ListDrama from "./ListDrama/ListDrama";
  import ValidateDrama from "./ValidateDrama/ValidateDrama";
  import ValidateHistory from "./ValidateHistory/validateHistory"; // Import ValidateHistory component
  import ReviewManager from "./ReviewManager/ReviewManager";
  // import ActorManager from './InputActor/InputActors';
  import GenreManager from "./InputGenres/InputGenres";
  import CountryManager from "./InputCountry/InputCountry";
  import AwardsManager from "./InputAward/InputAward";
  import UserSetting from "./UserSettings/UserSetting";
  import MovieTrash from "./MovieTrash/movieTrash"; // Import MovieTrash component
  import ActorManager from './InputActor/InputActors'
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
