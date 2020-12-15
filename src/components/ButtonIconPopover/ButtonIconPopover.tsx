import React, { useState } from "react";
import { IconButton, makeStyles, Popover, SvgIconTypeMap } from "@material-ui/core";
import { OverridableComponent } from "@material-ui/core/OverridableComponent";
import { TextDisplayTheme } from "../../types/types";

interface Props {
  IconComponent: OverridableComponent<SvgIconTypeMap<{}, "svg">>;
  PopoverContent: JSX.Element;
  textDisplayTheme: TextDisplayTheme;
}

const useStyles = makeStyles({
  iconButton: {
    color: ({ palette }: TextDisplayTheme) => palette.text.secondary
  },
  popover: {
    "& .MuiPopover-paper": {
      padding: "15px",
      backgroundColor: ({ palette }) => palette.background.secondary
    }
  }
});

/** Button blurs immediately after focus! */
export default function ButtonIconPopover({ IconComponent, PopoverContent, textDisplayTheme }: Props) {
  const classes = useStyles(textDisplayTheme);
  const [anchorEl, setAnchorEl] = useState<null | HTMLButtonElement>(null);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    setAnchorEl(e.currentTarget);
  };

  const open = Boolean(anchorEl);

  return(
    <>
      <IconButton className={classes.iconButton} onClick={handleClick} onFocus={({ target }) => target.blur()}>
        <IconComponent />
      </IconButton>
      <Popover
        anchorEl={anchorEl}
        anchorOrigin={{ horizontal: "left", vertical: "bottom" }}
        className={classes.popover}
        elevation={0}
        onClose={() => setAnchorEl(null)}
        open={open}
        PaperProps={{ square: true }}
      >
        {PopoverContent}
      </Popover>
    </>
  );
}
