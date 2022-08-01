import { Box, useTheme } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { WbSunnyOutlined, NightsStay } from "@material-ui/icons";
import classNames from "classnames";
import { Transition } from "react-transition-group";

const useStyles = makeStyles( ({ palette, transitions }) => ({
  themeSwitch: {
    position: "absolute",
    top: "1rem",
    right: "1rem",
    minWidth: "4rem",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "0.4rem",
    border: `1px solid ${palette.divider}`,
    borderRadius: "30px",
    backgroundColor: palette.background.default,
    zIndex: 1,
    "&:hover": {
      cursor: "pointer"
    }
  },
  themeSwitchIcon: {
    color: palette.text.primary
  },
  moonIcon: {
    transition:
      `left ${transitions.duration.complex * 2}ms, ` +
      `transform ${transitions.duration.complex * 2}ms, ` +
      (palette.mode === "dark"
        ? `opacity ${transitions.duration.complex}ms ${transitions.duration.complex}ms`
        : `opacity ${transitions.duration.complex}ms`)
  },
  sunIcon: {
    transition:
      `right ${transitions.duration.complex * 2}ms, ` +
      `transform ${transitions.duration.complex * 2}ms, ` +
      (palette.mode === "light"
        ? `opacity ${transitions.duration.complex}ms ${transitions.duration.complex}ms`
        : `opacity ${transitions.duration.complex}ms`)
  },
}));

const moonTransitionStyles = {
  entering: {
    opacity: 100,
    left: 0
  },
  entered: {
    opacity: 100,
    left: 0
  },
  exiting: {
    opacity: 0,
    left: "100%",
    transform: "translateX(-100%)"
  },
  exited: {
    opacity: 0,
    left: "100%",
    transform: "translateX(-100%)"
  },
  unmounted: {
    opacity: 0,
    left: 0
  }
};

const sunTransitionStyles = {
  entering: {
    opacity: 100,
    right: 0
  },
  entered: {
    opacity: 100,
    right: 0
  },
  exiting: {
    opacity: 0,
    right: "100%",
    transform: "translateX(100%)"
  },
  exited: {
    opacity: 0,
    right: "100%",
    transform: "translateX(100%)"
  },
  unmounted: {
    opacity: 0,
    right: 0
  }
};

export default function ThemeSwitch() {
  const classes = useStyles();
  const { palette, transitions, updateTheme } = useTheme();
  const toggleTheme = () => {
    updateTheme(palette.mode === "light" ? "dark" : "light");
  };
  
  return (
    <Box
      component="button"
      className={classes.themeSwitch}
      onClick={toggleTheme}
    >
      <Transition in={palette.mode === "light"} timeout={transitions.duration.complex * 2}>
        {state => (
          <WbSunnyOutlined
            className={classNames(classes.themeSwitchIcon, classes.sunIcon)}
            style={{ ...sunTransitionStyles[state] }} />
        )}
      </Transition>
      <Transition in={palette.mode === "dark"} timeout={transitions.duration.complex * 2}>
        {state => (
          <NightsStay
            className={classNames(classes.themeSwitchIcon, classes.moonIcon)}
            style={{ ...moonTransitionStyles[state] }} />
        )}
      </Transition>
    </Box>
  );
}
