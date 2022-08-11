import { Box, Typography } from "@mui/material";

interface Props {
  invalidSymbols: string[];
}

export default function InvalidSymbolsMessage({ invalidSymbols }: Props) {
  return (
    <Box sx={{ textAlign: "center" }}>
      {!!invalidSymbols.length &&
        <Typography>
          Text k opsání obsahuje tyto neplatné symboly, které nebudou v opisu zobrazeny: {invalidSymbols.join(", ")}
        </Typography>
      }
    </Box>
  );
}
