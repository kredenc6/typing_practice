import { Box, Typography } from "@mui/material";
import { makeStyles } from "@mui/styles";

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
    <Box className={classes.invalidSymbolsText}>
      {!!invalidSymbols.length &&
        <Typography>
          Text k opsání obsahuje tyto neplatné symboly, které nebudou v opisu zobrazeny: {invalidSymbols.join(", ")}
        </Typography>
      }
    </Box>
  );
}
