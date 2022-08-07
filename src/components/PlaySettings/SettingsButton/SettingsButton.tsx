import { Button, ButtonProps } from "@mui/material";

export default function SettingsButton({ children, className, ...buttonProps }: ButtonProps) {
  return (
    <Button
      sx={({ palette }) => ({
        height: "100%",
        color: "inherit",
        "& .MuiButton-label": {
          borderBottom: "2px solid transparent",
        },
        "&.Mui-disabled": {
          color: palette.info.main,
          "& .MuiButton-label": {
            borderBottomColor: palette.info.main,
          }
        },
        "&:hover": {
          color: palette.info.main,
          "& .MuiButton-label": {
            borderBottomColor: palette.info.main
          }
      }})}
      {...buttonProps}
    >
      {children}
    </Button>
  );
}
