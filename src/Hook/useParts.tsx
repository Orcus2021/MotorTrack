import React from "react";
import { useAppSelector } from "../store";
import firebase from "../utils/firebase";

const useParts = () => {
  const part = useAppSelector((state) => state.record.parts);
  console.log(part);
};
export default useParts;
