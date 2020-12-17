import React, { HTMLProps } from "react";
import classNames from "classnames";
import { makeStyles } from "@material-ui/core";
import { ArrowDropDown } from "@material-ui/icons";
import { TextDisplayTheme } from "../../types/types";

interface Props extends HTMLProps<HTMLDivElement> {
  textDisplayTheme: TextDisplayTheme;
  value: string;
}

const useStyles = makeStyles( ({ palette, typography }) => ({
  fakeSelect: {
    width: "150px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    margin: "4px 0",
    padding: "3px 5px",
    fontFamily: typography.fontFamily,
    fontSize: typography.fontSize,
    borderBottom: ({ palette }: TextDisplayTheme) => `2px solid ${palette.text.secondary}`,
    overflow: "hidden",
    transition: "all 0.2s",
    "&:hover": {
      cursor: "pointer",
      color: palette.info.main,
      borderBottomColor: palette.info.main
    }
  }
}));

export default function FakeSelect({ className, textDisplayTheme, value, ...divProps }: Props) {
  const classes = useStyles(textDisplayTheme);

  return (
    <div className={classNames(classes.fakeSelect, className)} {...divProps}>
      {value} <ArrowDropDown />
    </div>
  );
}
