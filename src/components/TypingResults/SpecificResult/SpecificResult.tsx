import React from "react";
import { makeStyles, Typography } from "@material-ui/core";

interface Props {
  Icon: React.FunctionComponent<React.SVGProps<SVGSVGElement> & {
    title?: string | undefined;
  }>;
  description: string;
  children?: React.ReactNode;
}

const useStyles = makeStyles(({ textDisplayTheme }) => ({
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
    fill: textDisplayTheme.text.main
  }
}));

export default function SpecificResult({ Icon, description, children }: Props) {
  const classes = useStyles();

  return (
    <div className={classes.results}>
      <div className={classes.resultDescription}>
        <Icon className={classes.icon} />
        <Typography component="h6" variant="h4">{description}</Typography>
      </div>
      {children}
    </div>
  );
}
