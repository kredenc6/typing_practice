import React from "react";
import { Link } from "react-router-dom";
import TextInput from "../../components/TextInput/TextInput";
import normalizeText from "../../textFunctions/normalizeText";

interface Props {
  setText: React.Dispatch<React.SetStateAction<string>>;
  text: string;
}

export default function MainMenu({ setText, text }: Props) {
  const handleTextChange = async (text: string) => {
    setText(await normalizeText(text));
  };

  return (
    <div>
      <Link to="playArea">play</Link>
      <p>Paste the text here:</p>
      <TextInput handleTextChange={handleTextChange} name="textInput" type="text" value={text} />
    </div>
  );
}
