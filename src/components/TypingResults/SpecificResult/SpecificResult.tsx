import React from "react";
import { Box, SvgIcon, Typography } from "@mui/material";
import { usePlayPageTheme } from "../../../styles/themeContexts";
import { type CSSObjects } from "../../../types/themeTypes";

interface Props {
  Icon: React.FunctionComponent<React.SVGProps<SVGSVGElement> & {
    title?: string | undefined;
  }>;
  description: string;
  children?: React.ReactNode;
}

const styles: CSSObjects = {
  results: {
    display: "grid",
    gridTemplateColumns: "1fr 2fr",
    gap: "2rem",
    alignItems: "center"
  },
  resultDescription: {
    justifySelf: "end",
    minWidth: "10rem",
    display: "flex",
    flexDirection: "column",
    alignItems: "center"
  }
};

export default function SpecificResult({ Icon, description, children }: Props) {
  const { state: textDisplayTheme } = usePlayPageTheme()!;

  return (
    <Box sx={styles.results}>
      <Box sx={styles.resultDescription}>
        <SvgIcon
          sx={{ fill: textDisplayTheme.text.main, fontSize: "5.5rem" }}
          component={Icon}
          inheritViewBox />
        <Typography component="h6" variant="h4">{description}</Typography>
      </Box>
      {children}
    </Box>
  );
}
