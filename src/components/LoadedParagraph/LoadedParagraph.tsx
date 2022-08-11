import { IconButton, Typography, Tooltip, Badge, Box } from "@mui/material";
import Simplebar from "simplebar-react";
import { PlaylistAdd } from "@mui/icons-material";

interface Props {
  loadedParagraph: string;
  paragraphId: number;
  handleInsertParagraph: (paragraph: string) => void;
}

const styles = {
  loadedParagraph: {
    display: "flex",
    alignItems: "center",
    marginTop: "1rem",
    padding: "0.3rem"
  },
  paragraphId: {
    marginRight: "0.2rem"
  },
  paragraphText: {
    grow: 1
  },
  addParagraphButton: {
    margin: " 0 0.3rem 0 0.2rem"
  },
  badge: {
    maxWidth: "94%",
    "& .MuiBadge-badge": {
      transform: "translate(-25%, -100%)"
    }
  },
  tooltip: {
    "& .MuiTooltip-tooltip": {
      maxWidth: "20rem",
      width: "20rem"
    }
  }
};

export default function LoadedParagraph({
  loadedParagraph, paragraphId, handleInsertParagraph
}: Props) {

  return (
    <Box sx={styles.loadedParagraph}>
      <IconButton
        sx={styles.addParagraphButton}
        color="primary"
        size="small"
        onClick={() => handleInsertParagraph(loadedParagraph)}>
        <PlaylistAdd />
      </IconButton>
      <Badge
        sx={styles.badge}
        badgeContent={`${loadedParagraph.length} znaků`}
        color="primary"
        anchorOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
      >
        <Typography sx={styles.paragraphId}>{paragraphId})</Typography>
          <Tooltip
            title={
              <Simplebar
                style={{ paddingRight: "0.6rem", maxHeight: "200px", width: "20rem" }}
                autoHide={false}
              >
                  {loadedParagraph}
              </Simplebar>
            }
            arrow
            enterDelay={500}
            enterNextDelay={500}
            leaveDelay={200}
            placement="top"
            aria-label={`paragraph ${paragraphId}`}
            PopperProps={{ sx: styles.tooltip }}
          >
            <Typography sx={styles.paragraphText} noWrap>{loadedParagraph}</Typography>
          </Tooltip>
      </Badge>
    </Box>
  );
}
