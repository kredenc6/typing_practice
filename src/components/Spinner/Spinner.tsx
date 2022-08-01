import { Box, useTheme } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { BarLoader } from "react-spinners";

interface Props {
  isLoading: boolean;
  offset?: {
    top?: string | number;
    right?: string | number;
    bottom?: string | number;
    left?: string | number;
  }
}

const useStyles = makeStyles({
  spinner: {
    position: "absolute",
    top: ({ offset }: Props) => offset?.top ? offset.top : 0,
    right: ({ offset }: Props) => offset?.right ? offset.right : 0,
    bottom: ({ offset }: Props) => offset?.bottom ? offset.bottom : 0,
    left: ({ offset }: Props) => offset?.left ? offset.left : 0,
    width: "100%",
    height: "95%",
    display: ({ isLoading }: Props) => isLoading ? "flex" : "none",
    justifyContent: "center",
    alignItems: "flex-end",
    backgroundColor: "transparent"
  }
});

export default function Spinner({ isLoading, offset }: Props) {
  const classes = useStyles({ isLoading, offset });
  const { palette } = useTheme();
  
  return (
    <Box className={classes.spinner}>
      <BarLoader color={palette.info.main} loading={true} width="50%" />
    </Box>
  );
}
