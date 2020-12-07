import React, { HTMLProps } from "react";

interface Props {
  handleTextChange: (text: string) => void;
}

export default function TextInput({ handleTextChange, ...inputProps }: Props & HTMLProps<HTMLInputElement>) {
  return(
    <div>
      <input
        onChange={e => handleTextChange(e.target.value)}
        {...inputProps} />
    </div>
  )
}
