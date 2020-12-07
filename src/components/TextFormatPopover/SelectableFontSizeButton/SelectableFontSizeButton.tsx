import React from "react";
import { Box, Button, ButtonProps, makeStyles, Theme, Typography, TypographyProps } from "@material-ui/core";

interface Props extends ButtonProps {
  typographyVariant: Partial<TypographyProps["variant"]>;
  typeDescription: "small" | "medium" | "large";
}

const useStyles = makeStyles(({ palette }: Theme) => ({
  fontSizeButton: {
    height: "100%",
    "& .MuiTypography-body1": {
      borderBottom: "2px solid transparent",
    },
    "&.Mui-disabled": {
      color: palette.info.main,
      "& .MuiTypography-body1": {
        borderBottomColor: palette.info.main,
      }
    },
    "&:hover": {
      color: palette.info.main,
      "& .MuiTypography-body1": {
        borderBottomColor: palette.info.main
      }
    }
  }
}));

export default function SelectableFontSizeButton(props: Props) {
  const classes = useStyles();
  const { typeDescription, typographyVariant, ...buttonProps } = props;
  
  return(
    <Button className={classes.fontSizeButton} {...buttonProps}>
      <Box>
        <Typography
          variant={typographyVariant}
          variantMapping={{ [typographyVariant as string]: "p" }}
        >
          A
        </Typography>
        <Typography>{typeDescription}</Typography>
      </Box>
    </Button>
  );
}
