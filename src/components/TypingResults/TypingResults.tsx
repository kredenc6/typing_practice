import React from "react";
import Simplebar from "simplebar-react";
import { makeStyles, Paper, Typography, useTheme } from "@material-ui/core";
import { Results } from "../../types/otherTypes";
import MistypedWord from "./MistypedWord/MistypedWord";
import SpecificResult from "./SpecificResult/SpecificResult";
import { ReactComponent as TopSpeed } from "../../svg/top-speed.svg";
import { ReactComponent as Target } from "../../svg/target.svg";
import { ReactComponent as ErrorCircle } from "../../svg/error-circle.svg";
import { ReactComponent as ThumbUp } from "../../svg/thumb-up.svg";
import { ReactComponent as Clock } from "../../svg/time.svg";

interface Props {
  resultObj: Results | null;
}

const useStyles = makeStyles(({ textDisplayTheme, typography, palette }) => ({
  resultsWrapper: {
    width: "100%",
    height: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    color: textDisplayTheme.text.main,
    backgroundColor: textDisplayTheme.background.main
  },
  typingResultsWrapper: {
    display: "grid",
    gap: "2rem"
  },
  mistypedWordsWrapper: {
    height: "200px",
    padding: "10px",
    color: textDisplayTheme.text.main,
    backgroundColor: textDisplayTheme.background.main,
    border: `1px solid ${palette.divider}`,
    overflow: "hidden"
  },
  mistypedWords: {
    display: "flex",
    flexWrap: "wrap",
    fontSize: "40px"
  },
  thumbUp: {
    width: typography.h2.fontSize,
    height: typography.h2.fontSize,
    fill: textDisplayTheme.text.main
  }
}));

export default function TypingResults({ resultObj }: Props) {
  const classes = useStyles();
  const { textDisplayTheme } = useTheme();

  const MistypedWordsComponents = resultObj?.mistypedWords.map((mistypedWord, i) => {
    if(i === resultObj?.mistypedWords.length - 1) {
      return <MistypedWord key={i} mistypedWord={mistypedWord} textDisplayTheme={textDisplayTheme} />
    }
    return <div style={{ display: "flex" }}>
      <MistypedWord key={i} mistypedWord={mistypedWord} textDisplayTheme={textDisplayTheme} />
      <span>,&nbsp;</span>
    </div>
  });

  return (
    <div className={classes.resultsWrapper}>
      {resultObj &&
      <>
        <div className={classes.typingResultsWrapper}>
          <SpecificResult Icon={Clock} description="Čas">
            <Typography component="h6" variant="h4">
              {resultObj.time}
            </Typography>
          </SpecificResult>
          <SpecificResult Icon={TopSpeed} description="Rychlost">
            <Typography component="h6" variant="h4">
              {resultObj.typingSpeed} úderů za minutu ({resultObj.wpm} slov za minutu).
            </Typography>
          </SpecificResult>
          <SpecificResult Icon={Target} description="Přesnost">
            <Typography component="h6" variant="h4">
              {resultObj.precision}%
            </Typography>
          </SpecificResult>
          {
            !!MistypedWordsComponents &&
            <SpecificResult Icon={ErrorCircle} description="Překlepy">
              {MistypedWordsComponents.length > 0 ?
                <Paper className={classes.mistypedWordsWrapper} variant="outlined" elevation={0}>
                  <Simplebar style={{ maxHeight: "100%" }} autoHide={false}>
                    <div className={classes.mistypedWords}>
                      {MistypedWordsComponents}
                    </div>
                  </Simplebar>
                </Paper>
                :
                <Typography component="h6" variant="h4">
                  Bez překlepů! Pěkná práce.&nbsp;
                  <ThumbUp className={classes.thumbUp} />
                </Typography>
              }
            </SpecificResult>
          }
        </div>
      </>
      }
    </div>
  );
}
