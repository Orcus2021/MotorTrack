import React from "react";
import { useNavigate } from "react-router-dom";

const useNav = (path: string) => {
  const navigate = useNavigate();
  navigate(path);
};
export default useNav;
