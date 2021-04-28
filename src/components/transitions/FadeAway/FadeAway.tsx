import React, { ReactNode } from "react";
import { useTheme } from "@material-ui/core";
import { Transition } from "react-transition-group";
import classnames from "classnames";

type transitionPhase = "entering" | "entered" | "exiting" | "exited";

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
};

export default function FadeAway({ inProp, children, className }: Props) {
  const { transitions } = useTheme();
  
  return (
    <Transition in={inProp} timeout={transitions.duration.complex} unmountOnExit>
      {(phase: transitionPhase) => (
          <div
            className={classnames(className)}
            style={{
              ...defaultStyle(transitions.duration.complex),
              ...transitionStyles[phase]
            }}
          >
            {children}
          </div>
      )}
    </Transition>
  );
}
