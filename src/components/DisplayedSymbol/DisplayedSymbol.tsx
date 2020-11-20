import React from "react";
import { createUseStyles } from "react-jss";

interface Props {
  symbol: string;
  relativePosition: number;
  wasCorrect: boolean;
}

const useStyles = createUseStyles({
  textSymbol: {
    // color: ({ relativePosition }: Omit<Props, "symbol">) => {
    //   if(relativePosition > 0) return "grey";
    // },
    backgroundColor: ({ relativePosition, wasCorrect }: Omit<Props, "symbol">) => {
      if(relativePosition > 0) return wasCorrect ? " rgba(40, 149, 40, 0.3)" : "rgb(211, 79, 79, 0.7)";
      return "inherit";
    },
    borderBottom: ({ relativePosition }: Omit<Props, "symbol">) => {
      return `3px solid ${relativePosition === 0 ? "blue" : "transparent"}`;
    }
  }
});

const DisplayedSymbol = ({ relativePosition, symbol, wasCorrect }: Props) => {
  const styles = useStyles({ relativePosition, wasCorrect });
  return (
    symbol === " " ?
      <span className={styles.textSymbol}> <i></i></span>
      :
      <span className={styles.textSymbol}>{symbol}</span>
  );
};

export default React.memo(DisplayedSymbol);
