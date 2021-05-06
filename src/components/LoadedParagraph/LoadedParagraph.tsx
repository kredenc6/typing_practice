import React from "react";
import { IconButton, makeStyles, Typography, Tooltip, Badge } from "@material-ui/core";
import { PlaylistAdd } from "@material-ui/icons";

interface Props {
  loadedParagraph: string;
  paragraphId: number;
  handleInsertParagraph: (paragraph: string) => void;
}

const useStyles = makeStyles({
  loadedParagraph: {
    display: "flex",
    padding: "0.3rem"
  },
  paragraphId: {
    marginRight: "0.8rem"
  },
  paragraphText: {
    grow: 1
  },
  badge: {
    "& .MuiBadge-badge": {
      transform: "translate(50%, -90%)"
    }
  }
});

export default function LoadedParagraph({
  loadedParagraph, paragraphId, handleInsertParagraph
}: Props) {
  const classes = useStyles();

  return (
    <div className={classes.loadedParagraph}>
      <IconButton
        color="primary"
        size="small"
        onClick={() => handleInsertParagraph(loadedParagraph)}>
        <PlaylistAdd />
      </IconButton>
      <Typography className={classes.paragraphId}>{paragraphId})</Typography>
      <Tooltip
        title={
          <Badge
            className={classes.badge}
            color="primary"
            badgeContent={`${loadedParagraph.length} znaků`}
          >
            {loadedParagraph}
          </Badge>}
        arrow
        enterDelay={500}
        enterNextDelay={500}
        placement="top"
        aria-label={`paragraph ${paragraphId}`}
      >
        <Typography className={classes.paragraphText} noWrap>{loadedParagraph}</Typography>
      </Tooltip>
    </div>
  );
}
