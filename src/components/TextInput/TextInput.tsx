import React from "react";
import { normalizeWhitespace } from "../../textFunctions/normalizeWhitespace";

interface Props {
  setText: React.Dispatch<React.SetStateAction<string>>;
  text: string;
}

export default function TextInput({ setText, text }: Props) {
  return(
    <div>
      <input
        name="textInput"
        onChange={e => setText(normalizeWhitespace(e.target.value))}
        type="text"
        value={text} />
    </div>
  )
}
