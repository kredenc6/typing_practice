import React from "react";
import { makeStyles } from "@material-ui/core";

const useStyles = makeStyles(({ palette }) => ({
  textCursor: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    borderBottom: `3px solid ${palette.info.main}`
  }
}));

export default function TextCursor() {
  const classes = useStyles();

  return (
    <div className={classes.textCursor}></div>
  );
}