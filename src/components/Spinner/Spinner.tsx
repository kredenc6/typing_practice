import { Box, useTheme } from "@mui/material";
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

export default function Spinner({ isLoading, offset }: Props) {
  const { palette } = useTheme();
  
  return (
    <Box sx={{
      position: "absolute",
      top: offset?.top ? offset.top : 0,
      right: offset?.right ? offset.right : 0,
      bottom: offset?.bottom ? offset.bottom : 0,
      left: offset?.left ? offset.left : 0,
      width: "100%",
      height: "95%",
      display: isLoading ? "flex" : "none",
      justifyContent: "center",
      alignItems: "flex-end",
      backgroundColor: "transparent"
    }}>
      <BarLoader color={palette.info.main} loading={true} width="50%" />
    </Box>
  );
}
