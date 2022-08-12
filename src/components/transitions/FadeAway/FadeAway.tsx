import { ReactNode } from "react";
import { Box, useTheme, CSSObject, Theme } from "@mui/material";
import { Transition, TransitionStatus } from "react-transition-group";
import { TransitionProps } from "react-transition-group/Transition";

interface Props {
    inProp: boolean;
    children: ReactNode;
    sx? : CSSObject | ((theme: Theme) => CSSObject);
}

const defaultStyle = (duration: number) => ({
  transition: `all ${duration}ms ease-in`,
  opacity: 0
});

const transitionStyles = {
  entering: {
    opacity: 1,
  },
  entered:  {
    opacity: 1,
  },
  exiting:  {
    opacity: 0,
  },
  exited:  {
    opacity: 1,
  },
  unmounted: {
    opacity: 1
  }
};

export default function FadeAway({
  inProp, children, sx, ...transitionProps
}: Props & TransitionProps) {
  const { transitions } = useTheme();
  const timeout = typeof transitionProps.timeout === "number"
    ? transitionProps.timeout
    : transitions.duration.complex;

  return (
    <Transition
      in={inProp}
      unmountOnExit
      {...transitionProps}
    >
      {(phase: TransitionStatus) => (
          <Box
            sx={sx}
            style={{
              ...defaultStyle(timeout),
              ...transitionStyles[phase]
            }}
          >
            {children}
          </Box>
      )}
    </Transition>
  );
}
