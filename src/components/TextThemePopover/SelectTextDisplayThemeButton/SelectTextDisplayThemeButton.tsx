import React from "react";
import { Button } from "@material-ui/core";

interface Props {
  handleClick: () => void;
  themeName: string;
}

export default function SelectTextDisplayThemeButton({ handleClick, themeName }: Props) {
  return (
    <Button onClick={handleClick}>{themeName}</Button>
  );
}
