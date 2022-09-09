import React, { useEffect, useState, useRef } from "react";
import { userActions } from "../../store/user/userReducer";
import { useAppDispatch, useAppSelector } from "../../store";
import Loading from "../../components/Loading/Loading";

import Input from "../../components/Input";
import { useForm } from "react-hook-form";

const Home = () => {
  const isLoading = useAppSelector((state) => state.user.isLoading);
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(userActions.loading(true));
    setTimeout(() => {
      dispatch(userActions.loading(false));
    }, 1000);
  }, [dispatch]);

  // -----------------------------
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm();

  const createFrom = () => {
    // console.log(data);
  };

  return (
    <>
      {isLoading && <Loading />}
      <div>Home</div>
      <div>
        <Input
          register={register}
          setValue={setValue}
          watch={watch}
          name="insuranceDate"
          content="保險到期日"
          error={{ key: "kkk" }}
          require={{ required: true }}
          type="text"
        />
        <button onClick={handleSubmit(createFrom)}>典籍</button>
      </div>
    </>
  );
};

export default Home;
