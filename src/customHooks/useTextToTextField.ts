import { useState } from "react";
import { MAXIMUM_TEXT_LENGTH } from "../constants/constants";

export const useTextToTextField = () => {
  const [textFieldText, setTextFieldText] = useState("");

  const setTextField = (text: string) => {
    if(text.length > MAXIMUM_TEXT_LENGTH) {
      console.log(`Maximum text length of ${MAXIMUM_TEXT_LENGTH} symbols was exceed.`);
    }
  
    setTextFieldText(text.slice(0, MAXIMUM_TEXT_LENGTH));
  };

  return [textFieldText, setTextField] as [string, typeof setTextField];
};
