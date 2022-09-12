import React, { ReactNode } from "react";
import { useForm } from "react-hook-form";
import { FormProvider } from "react-hook-form";

const InputFormProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const methods = useForm();
  return <FormProvider {...methods}>{children}</FormProvider>;
};

export default InputFormProvider;
