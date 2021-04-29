import React, { ReactNode } from "react";
import { useTheme } from "@material-ui/core";
import { Transition, TransitionStatus } from "react-transition-group";
import { TransitionProps } from "react-transition-group/Transition";
import classnames from "classnames";

interface Props {
    inProp: boolean;
    children: ReactNode;
    className?: String;
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
  inProp, children, className, ...transitionProps
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
          <div
            className={classnames(className)}
            style={{
              ...defaultStyle(timeout),
              ...transitionStyles[phase]
            }}
          >
            {children}
          </div>
      )}
    </Transition>
  );
}
