import React from "react";
import TextInput from "../TextInput/TextInput";

interface Props {
  setText: React.Dispatch<React.SetStateAction<string>>;
  text: string;
}

export default function Settings({ setText, text }: Props) {
  return(
    <div>
      <p>Paste the text here:</p>
      <TextInput setText={setText} text={text} />
    </div>
  );
}
