import { Box, BoxProps } from "@mui/material";
import { ArrowDropDown } from "@mui/icons-material";
import { CSSObjects } from "../../types/themeTypes";

interface Props extends BoxProps {
  value: string;
  onClick: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
}

const styles: CSSObjects = {
  fakeSelect: ({ palette, typography }) => ({
    width: "150px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    margin: "4px 0",
    padding: "3px 5px",
    fontFamily: typography.fontFamily,
    fontSize: typography.fontSize,
    borderBottom: `2px solid ${palette.secondary.contrastText}`,
    overflow: "hidden",
    transition: "all 0.2s",
    "&:hover": {
      cursor: "pointer",
      color: palette.info.main,
      borderBottomColor: palette.info.main
    }
  })
};

export default function FakeSelect({ sx, value, onClick }: Props) {
  return (
    <Box
      sx={[
        styles.fakeSelect,
        ...(Array.isArray(sx) ? sx : [sx])
      ]}
      onClick={onClick}
    >
      {value} <ArrowDropDown />
    </Box>
  );
}
