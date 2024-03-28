import { Box, useTheme } from "@mui/material";
import { WbSunnyOutlined, NightsStay } from "@mui/icons-material";
import { Transition } from "react-transition-group";
import { type CSSObjects } from "../../types/themeTypes";

const styles: CSSObjects = {
  themeSwitch: ({ palette }) => ({
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
  }),
  themeSwitchIcon: ({ palette }) => ({
    color: palette.text.primary
  }),
  moonIcon: ({ palette, transitions }) => ({
    color: "ff0000",
    fill: "ff0000",
    transition:
      `left ${transitions.duration.complex * 2}ms, ` +
      `transform ${transitions.duration.complex * 2}ms, ` +
      (palette.mode === "dark"
        ? `opacity ${transitions.duration.complex}ms ${transitions.duration.complex}ms`
        : `opacity ${transitions.duration.complex}ms`)
  }),
  sunIcon: ({ palette, transitions }) => ({
    transition:
      `right ${transitions.duration.complex * 2}ms, ` +
      `transform ${transitions.duration.complex * 2}ms, ` +
      (palette.mode === "light"
        ? `opacity ${transitions.duration.complex}ms ${transitions.duration.complex}ms`
        : `opacity ${transitions.duration.complex}ms`)
  })
};

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
  const { palette, transitions, updateTheme } = useTheme();
  const toggleTheme = () => {
    updateTheme(palette.mode === "light" ? "dark" : "light");
  };
  
  return (
    <Box
      component="button"
      sx={styles.themeSwitch}
      onClick={toggleTheme}
    >
      <Transition in={palette.mode === "light"} timeout={transitions.duration.complex * 2}>
        {state => (
          <WbSunnyOutlined
            sx={[ styles.themeSwitchIcon, styles.sunIcon, sunTransitionStyles[state] ]}
          />
        )}
      </Transition>
      <Transition in={palette.mode === "dark"} timeout={transitions.duration.complex * 2}>
        {state => (
          <NightsStay
            sx={[ styles.themeSwitchIcon, styles.moonIcon, moonTransitionStyles[state] ]}
          />
        )}
      </Transition>
    </Box>
  );
}

// TODO implement system preference:
// https://mui.com/material-ui/customization/dark-mode/#system-preference
