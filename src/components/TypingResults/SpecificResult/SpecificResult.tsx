import React, { useContext } from "react";
import { Box, SvgIcon, Typography } from "@mui/material";
import { PlayPageThemeContext } from "../../../styles/themeContexts";
import { CSSObjects } from "../../../types/themeTypes";

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
    display: "flex",
    flexDirection: "column",
    alignItems: "center"
  }
};

export default function SpecificResult({ Icon, description, children }: Props) {
  const { state: textDisplayTheme } = useContext(PlayPageThemeContext);

  return (
    <Box sx={styles.results}>
      <Box sx={styles.resultDescription}>
        <SvgIcon
          sx={{ fill: textDisplayTheme.text.main }}
          component={Icon}
          inheritViewBox />
          {/* TODO delete commented code if everything works */}
        {/* <Icon sx={{ fill: textDisplayTheme.text.main }} /> */}
        <Typography component="h6" variant="h4">{description}</Typography>
      </Box>
      {children}
    </Box>
  );
}
