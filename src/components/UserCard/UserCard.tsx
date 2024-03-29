import React from "react";
import { Avatar, Box, Button, IconButton, Popover, Typography, type AvatarProps } from "@mui/material";
import { type User } from "../../types/otherTypes";

interface Props {
  user: User | null;
  logout: () => void;
}

export default function UserCard({ user, logout }: Props) {
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "user-popover" : undefined;
  
  return (
    <Box>
      <IconButton aria-describedby={id} onClick={handleClick}>
        <UserAvatar user={user} />
      </IconButton>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left"
        }}
      >
        <UserAvatar user={user} sx={{ width: 56, height: 56 }} />
          <Typography align="center" color="text.secondary" gutterBottom noWrap paragraph variant="h6">
            {user?.name || "anonymní"}
          </Typography>
        <Button onClick={logout} size="small">Odhlásit se</Button>
      </Popover>
    </Box>
  );
}

interface UserAvatarProps extends AvatarProps {
  user: User | null;
}

function UserAvatar({ user, ...avatarProps}: UserAvatarProps) {
return (
    user?.picture
      ? <Avatar alt="user" src={user?.picture} {...avatarProps} />
      : <Avatar alt="user" {...avatarProps}>A</Avatar>
  );
}
