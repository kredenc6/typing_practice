import React from "react";
import { Box, Typography, TypographyProps } from "@material-ui/core";

interface Props {
  typographyVariant: Partial<TypographyProps["variant"]>;
  typeDescription: "small" | "medium" | "large";
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
