import React from "react";
import { IconButton, makeStyles, Typography, Tooltip, Badge } from "@material-ui/core";
import Simplebar from "simplebar-react";
import { PlaylistAdd } from "@material-ui/icons";

interface Props {
  loadedParagraph: string;
  paragraphId: number;
  handleInsertParagraph: (paragraph: string) => void;
}

const useStyles = makeStyles({
  loadedParagraph: {
    display: "flex",
    alignItems: "center",
    padding: "0.3rem"
  },
  paragraphId: {
    marginRight: "0.2rem"
  },
  paragraphText: {
    grow: 1
  },
  badge: {
    // TODO find a better(not hardcoded) way
    width: "300px", // this is the default max-width of the Tooltip component
    "& .MuiBadge-badge": {
      transform: "translate(40%, -90%)"
    },
    paddingRight: "10px"
  },
  addParagraphButton: {
    margin: " 0 0.3rem 0 0.2rem"
  }
});

export default function LoadedParagraph({
  loadedParagraph, paragraphId, handleInsertParagraph
}: Props) {
  const classes = useStyles();

  return (
    <div className={classes.loadedParagraph}>
      <IconButton
        className={classes.addParagraphButton}
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
              <Simplebar
                style={{ paddingRight: "10px", maxHeight: "200px", width: "100%" }}
                autoHide={false}
              >
                  {loadedParagraph}
              </Simplebar>
            </Badge>
          }
          arrow
          interactive
          enterDelay={500}
          enterNextDelay={500}
          placement="top"
          // open={paragraphId === 1}
          aria-label={`paragraph ${paragraphId}`}
        >
          <Typography className={classes.paragraphText} noWrap>{loadedParagraph}</Typography>
        </Tooltip>
    </div>
  );
}
