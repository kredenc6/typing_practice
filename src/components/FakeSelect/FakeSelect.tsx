import React, { HTMLProps } from "react";
import classNames from "classnames";
import { Box, makeStyles } from "@material-ui/core";
import { ArrowDropDown } from "@material-ui/icons";

interface Props extends HTMLProps<HTMLDivElement> {
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
    borderBottom: `2px solid ${palette.secondary.contrastText}`,
    overflow: "hidden",
    transition: "all 0.2s",
    "&:hover": {
      cursor: "pointer",
      color: palette.info.main,
      borderBottomColor: palette.info.main
    }
  }
}));

export default function FakeSelect({ className, value, ...divProps }: Props) {
  const classes = useStyles();

  return (
    <Box className={classNames(classes.fakeSelect, className)} {...divProps}>
      {value} <ArrowDropDown />
    </Box>
  );
}
