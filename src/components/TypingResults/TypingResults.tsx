import React from "react";
import Simplebar from "simplebar-react";
import { makeStyles, Paper, Typography, useTheme } from "@material-ui/core";
import { Results } from "../../types/otherTypes";
import MistypedWord from "./MistypedWord/MistypedWord";
import { ReactComponent as TopSpeed } from "../../svg/top-speed.svg";
import { ReactComponent as Target } from "../../svg/target.svg";
import { ReactComponent as ErrorCircle } from "../../svg/error-circle.svg";
import { ReactComponent as ThumbUp } from "../../svg/thumb-up.svg";

// const temp = ["1234", "12345", "123456", "1234", "12345", "123456", "1234", "12345", "123456", "1234", "12345", "123456", "1234", "12345", "123456"];

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
    border: `1px solid ${palette.divider}`
  },
  mistypedWords: {
    display: "flex",
    flexWrap: "wrap",
    fontSize: "40px"
  },
  results: {
    display: "grid",
    gridTemplateColumns: "1fr 2fr",
    gap: "2rem",
    alignItems: "center"
  },
  resultDescription: {
    justifySelf: "end",
    display: "flex",
    flexDirection: "column",
    alignItems: "center"
  },
  icon: {
    fill: textDisplayTheme.text.main
  },
  thumbUp: {
    width: typography.h2.fontSize,
    height: typography.h2.fontSize
  }
}));

export default function TypingResults({ resultObj }: Props) {
  const classes = useStyles();
  const { textDisplayTheme } = useTheme();

  // const MistypedWordsComponents = temp.map((mistypedWord, i) => {
  //   if(i === temp.length - 1) {
  //     return <MistypedWord key={i} mistypedWord={mistypedWord} textDisplayTheme={textDisplayTheme} />
  //   }
  //   return <div style={{ display: "flex" }}>
  //     <MistypedWord key={i} mistypedWord={mistypedWord} textDisplayTheme={textDisplayTheme} />
  //     <span>,&nbsp;</span>
  //   </div>
  // });
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
          <div className={classes.results}>
            <div className={classes.resultDescription}>
              <TopSpeed className={classes.icon} />
              <Typography component="h6" variant="h4">Rychlost</Typography>
            </div>
            <Typography component="h6" variant="h4">
              {resultObj.typingSpeed} znaků za minutu ({resultObj.wpm} slov za minutu).
            </Typography>
          </div>
          <div className={classes.results}>
            <div className={classes.resultDescription}>
              <Target className={classes.icon} />
              <Typography component="h6" variant="h4">Přesnost</Typography>
            </div>
            <Typography component="h6" variant="h4">
              {resultObj.precision}%
            </Typography>
          </div>
          {
            !!MistypedWordsComponents &&
            <div className={classes.results}>
              <div className={classes.resultDescription}>
                <ErrorCircle className={classes.icon} />
                <Typography component="h6" variant="h4">Překlepy</Typography>
              </div>
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
                  <ThumbUp className={`${classes.icon} ${classes.thumbUp}`} />
                </Typography>
            }
            </div>
          }
        </div>
      </>
      }
    </div>
  );
}
