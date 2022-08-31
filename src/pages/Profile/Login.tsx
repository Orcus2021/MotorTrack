import React, { useState } from "react";
import asyncUserAction from "../../store/user/asyncUserAction";
import { useAppDispatch, useAppSelector } from "../../store/index";
import styled from "styled-components";

// Initialize Firebase

const Login = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [updateData, setUpdateData] = useState("");
  const user = useAppSelector((state) => state.user.user);

  const dispatch = useAppDispatch();
  console.log(user);
  const signUp = async () => {
    const user = {
      email,
      password,
      name,
    };
    dispatch(asyncUserAction.signUp(user));
  };
  const signIn = async () => {
    const user = {
      email,
      password,
    };
    dispatch(asyncUserAction.signIn(user));
  };
  const updateUser = () => {
    const newUser = {
      selectCar: updateData,
      cars: 2,
    };
    dispatch(asyncUserAction.updateUser(user.id, newUser));
  };

  return (
    <div>
      <input
        type="text"
        value={email}
        placeholder="email"
        onChange={(e) => {
          setEmail(e.target.value);
        }}
      />
      <input
        type="text"
        value={password}
        placeholder="password"
        onChange={(e) => {
          setPassword(e.target.value);
        }}
      />
      <input
        type="text"
        value={name}
        placeholder="name"
        onChange={(e) => {
          setName(e.target.value);
        }}
      />
      <input
        type="text"
        value={updateData}
        placeholder="更新資料"
        onChange={(e) => {
          setUpdateData(e.target.value);
        }}
      />
      <button onClick={signUp}>SIGNUP</button>
      <button onClick={signIn}>SIGNIN</button>
      <button onClick={updateUser}>更新個人資料</button>
    </div>
  );
};

export default Login;
