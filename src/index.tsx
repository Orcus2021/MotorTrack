import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import Home from "./pages/Home/Home";
import Login from "./pages/Profile/Login";
import Profile from "./pages/Profile/Profile";
import Manage from "./pages/Car/Manage";
import Record from "./pages/Car/Record/Record";
import AddCar from "./pages/Car/SetCar/AddCar";
import EditCar from "./pages/Car/SetCar/EditCar";
import Test from "./Test";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./store/index";
import Chart from "./pages/Car/Chart/Chart";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <BrowserRouter>
    <Provider store={store}>
      <Routes>
        <Route path="/" element={<App />}>
          <Route index element={<Home />} />
          <Route path="login" element={<Login />} />
          <Route path="profile" element={<Profile />} />
          <Route path="test" element={<Test />} />
          <Route path="car_manage" element={<Manage />}>
            <Route path="record" element={<Record />} />
            <Route path="add" element={<AddCar />} />
            <Route path="edit" element={<EditCar />} />
            <Route path="chart" element={<Chart />} />
          </Route>
        </Route>
      </Routes>
    </Provider>
  </BrowserRouter>
);
