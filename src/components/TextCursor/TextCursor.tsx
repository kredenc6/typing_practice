import { Box } from "@mui/material";

interface Props {
  height: string;
}

export default function TextCursor({ height }: Props) {
  return (
    <Box sx={({ palette }) => ({
      position: "absolute",
      bottom: 0,
      left: 0,
      width: "100%",
      height: "100%",
      borderBottomWidth: height,
      borderBottomStyle: "solid",
      borderBottomColor: `${palette.info.main}`
    })} />
  );
}
