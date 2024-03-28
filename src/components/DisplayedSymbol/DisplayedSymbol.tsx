import { Box } from "@mui/material";
import { type SymbolStyle } from "../../types/themeTypes";

interface Props {
  symbolStyle: SymbolStyle;
  symbol: string;
}

export default function DisplayedSymbol({ symbol, symbolStyle }: Props) {
  const { symbolOffset, color, backgroundColor } = symbolStyle;

  return (
    <Box
      component="span"
      sx={{
        marginRight: symbolOffset.marginRight,
        paddingLeft: symbolOffset.paddingLeft,
        paddingRight: symbolOffset.paddingRight,
        color,
        backgroundColor,
        borderRadius: "3px"
      }}
    >
      {symbol}
    </Box>
  );
}
