import React from "react";
import { makeStyles, Typography } from "@material-ui/core";

interface Props {
  invalidSymbols: string[];
}

const useStyles = makeStyles({
  invalidSymbolsText: {
    textAlign: "center"
  }
});

export default function InvalidSymbolsMessage({ invalidSymbols }: Props) {
  const classes = useStyles();

  return (
    <div className={classes.invalidSymbolsText}>
      {!!invalidSymbols.length &&
        <Typography>
          Text k opsání obsahuje tyto neplatné symboly, které nebudou v opisu zobrazeny: {invalidSymbols.join(", ")}
        </Typography>
      }
    </div>
  );
}
