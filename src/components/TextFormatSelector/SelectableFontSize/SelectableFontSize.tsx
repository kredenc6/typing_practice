import { Box, Typography, type TypographyProps } from "@mui/material";
import { type TypeDescription } from "../FontSizeSelector/FontSizeSelector";

interface Props {
  typographyVariant: Partial<TypographyProps["variant"]>;
  typeDescription: TypeDescription;
}

export default function SelectableFontSize({ typeDescription, typographyVariant }: Props) {
  return(
    <Box>
      <Typography
        variant={typographyVariant}
        variantMapping={{ [typographyVariant as string]: "p" }}
      >
        A
      </Typography>
      <Typography>{typeDescription}</Typography>
    </Box>
  );
}
