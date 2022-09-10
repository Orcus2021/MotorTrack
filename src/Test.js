import React, { useState } from "react";

import { FormProvider, useForm, useFormContext } from "react-hook-form";

// export const ConnectForm = ({ children }) => {

//   return children({ ...kkkkk });
// };

export const DeepNest = () => {
  const { register } = useFormContext();

  return (
    <div>
      <input {...register("deepNestedInput")} />
    </div>
  );
};

const Test = () => {
  const methods = useForm();
  const { handleSubmit } = methods;
  const formHandler = (data) => {
    // console.log(data);
  };
  return (
    <FormProvider {...methods}>
      <form>
        <DeepNest />
      </form>
      <button onClick={handleSubmit(formHandler)}>上傳</button>
    </FormProvider>
  );
};

export default Test;
