import React from "react";
import { makeStyles } from "@material-ui/core";

interface Props {
  height?: string;
}

const useStyles = makeStyles(({ palette }) => ({
  textCursor: {
    position: "absolute",
    bottom: 0,
    left: 0,
    width: "100%",
    height: "100%",
    borderBottomWidth: ({ height }: Props) => height ? height : "3px",
    borderBottomStyle: "solid",
    borderBottomColor: `${palette.info.main}`
  }
}));

export default function TextCursor({ height }: Props) {
  const classes = useStyles({ height });

  return (
    <div className={classes.textCursor}></div>
  );
}
