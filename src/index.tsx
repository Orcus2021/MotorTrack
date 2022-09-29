import React from "react";
import ReactDOM from "react-dom/client";
// import * as serviceWorkerRegistration from "./serviceWorkerRegistration";
import App from "./App";
import Home from "./pages/Home/Home";
import Login from "./pages/Profile/Login";
import Profile from "./pages/Profile/Profile";
import Manage from "./pages/Car/Manage";
import Record from "./pages/Car/Record/Record";
import AddCar from "./pages/Car/SetCar/AddCar";
import EditCar from "./pages/Car/SetCar/EditCar";
import Status from "./pages/Status/Status";
import StoreMap from "./pages/Map/StoreMap";
import Mileage from "./pages/Mileage/Mileage";
import MyMap from "./pages/Map/MyMap";
import NotFound from "./components/Layout/NotFound";
import Test from "./Test";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./store/index";
import Chart from "./pages/Chart/Chart";
// import swDev from "./swDev";

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
          <Route path="status" element={<Status />} />
          <Route path="test" element={<Test />} />
          <Route path="store" element={<StoreMap />} />
          <Route path="my_map/:userID" element={<MyMap />} />
          <Route path="mileage" element={<Mileage />} />
          <Route path="car_manage" element={<Manage />}>
            <Route path="record" element={<Record />} />
            <Route path="add" element={<AddCar />} />
            <Route path="edit" element={<EditCar />} />
            <Route path="chart" element={<Chart />} />
          </Route>
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Provider>
  </BrowserRouter>
);
// swDev();
// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
// serviceWorkerRegistration.register();
