import React, { useState } from "react";
import { IconButton, Popover, SvgIconTypeMap } from "@material-ui/core";
import { OverridableComponent } from "@material-ui/core/OverridableComponent";

interface Props {
  IconComponent: OverridableComponent<SvgIconTypeMap<{}, "svg">>;
  PopoverContent: JSX.Element;
}

export default function ButtonIconPopover({ IconComponent, PopoverContent }: Props) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLButtonElement>(null);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    setAnchorEl(e.currentTarget);
  };

  const open = Boolean(anchorEl);

  return(
    <>
      <IconButton onClick={handleClick}>
        <IconComponent />
      </IconButton>
      <Popover anchorEl={anchorEl} onClose={() => setAnchorEl(null)} open={open}>
        {PopoverContent}
      </Popover>
    </>
  );
}