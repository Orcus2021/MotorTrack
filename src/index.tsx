import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import Home from "./pages/Home/Home";
import Login from "./pages/Profile/Login";
import Test from "./Test";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./store/index";

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
          <Route path="test" element={<Test />} />
        </Route>
      </Routes>
    </Provider>
  </BrowserRouter>
);
