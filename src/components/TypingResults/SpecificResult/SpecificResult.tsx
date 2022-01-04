import React, { useContext } from "react";
import { Box, makeStyles, Typography } from "@material-ui/core";
import { PlayPageThemeContext } from "../../../styles/themeContexts";
import { TextDisplayTheme } from "../../../types/themeTypes";

interface Props {
  Icon: React.FunctionComponent<React.SVGProps<SVGSVGElement> & {
    title?: string | undefined;
  }>;
  description: string;
  children?: React.ReactNode;
}

const useStyles = makeStyles({
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
  },
  icon: {
    fill: (textDisplayTheme: TextDisplayTheme) => textDisplayTheme.text.main
  }
});

export default function SpecificResult({ Icon, description, children }: Props) {
  const { state: textDisplayTheme } = useContext(PlayPageThemeContext);
  const classes = useStyles(textDisplayTheme);

  return (
    <Box className={classes.results}>
      <Box className={classes.resultDescription}>
        <Icon className={classes.icon} />
        <Typography component="h6" variant="h4">{description}</Typography>
      </Box>
      {children}
    </Box>
  );
}
