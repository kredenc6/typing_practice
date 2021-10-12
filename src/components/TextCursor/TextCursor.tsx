import React from "react";
import { Box, makeStyles } from "@material-ui/core";

interface Props {
  height: string;
}

const useStyles = makeStyles(({ palette }) => ({
  textCursor: {
    position: "absolute",
    bottom: 0,
    left: 0,
    width: "100%",
    height: "100%",
    borderBottomWidth: ({ height }: Props) => height,
    borderBottomStyle: "solid",
    borderBottomColor: `${palette.info.main}`
  }
}));

export default function TextCursor({ height }: Props) {
  const classes = useStyles({ height });

  return (
    <Box className={classes.textCursor}></Box>
  );
}
