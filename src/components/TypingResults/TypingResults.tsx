import Simplebar from "simplebar-react";
import { Box, Paper, SvgIcon, Typography } from "@mui/material";
import { Results } from "../../types/otherTypes";
import MistypedWord from "./MistypedWord/MistypedWord";
import SpecificResult from "./SpecificResult/SpecificResult";
import { ReactComponent as TopSpeed } from "../../svg/top-speed-24px.svg";
import { ReactComponent as Target } from "../../svg/target-24px.svg";
import { ReactComponent as ErrorCircle } from "../../svg/error-circle-24px.svg";
import { ReactComponent as ThumbUpIcon } from "../../svg/thumb-up-24px.svg";
import { ReactComponent as Clock } from "../../svg/time-24px.svg";
import { useContext } from "react";
import { PlayPageThemeContext } from "../../styles/themeContexts";
import { CSSObjectFunctionsWithProp, TextDisplayTheme } from "../../types/themeTypes";

interface Props {
  resultObj: Results | null;
}

const styles = {
  typingResultsWrapper: {
    display: "grid",
    gap: "2rem"
  },
  mistypedWords: {
    display: "flex",
    flexWrap: "wrap",
    fontSize: "40px"
  },
  mistypedWordComma: {
    transform: "translateY(15%)"
  }
};

const styleFunctions: CSSObjectFunctionsWithProp = {
  resultsWrapper: (_, prop) => {
    const textDisplayTheme = prop as TextDisplayTheme;

    return {
      width: "100%",
      height: "100%",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      color: textDisplayTheme.text.main,
      backgroundColor: textDisplayTheme.background.main
    }
  },
  mistypedWordsWrapper: ({ palette }, prop) => {
    const textDisplayTheme = prop as TextDisplayTheme;

    return {
      height: "200px",
      padding: "10px",
      color: textDisplayTheme.text.main,
      backgroundColor: textDisplayTheme.background.main,
      border: `1px solid ${palette.divider}`,
      overflow: "hidden"
    }
  },
  thumbUp: ({ typography }, prop) => {
    const textDisplayTheme = prop as TextDisplayTheme;

    return {
      width: typography.h2.fontSize,
      height: typography.h2.fontSize,
      fill: textDisplayTheme.text.main
    }
  }
};

export default function TypingResults({ resultObj }: Props) {
  const { state: textDisplayTheme } = useContext(PlayPageThemeContext);

  const MistypedWordsComponents = resultObj?.mistypedWords.map((mistypedWord, i) => {
    if(i === resultObj?.mistypedWords.length - 1) { // don't add a comma after the last word
      return <MistypedWord key={i} mistypedWord={mistypedWord} textDisplayTheme={textDisplayTheme} />
    }
    return <div key={i} style={{ display: "flex" }}>
      <MistypedWord mistypedWord={mistypedWord} textDisplayTheme={textDisplayTheme} />
      <Box component="span" sx={styles.mistypedWordComma}>,&nbsp;</Box>
    </div>
  });

  return (
    <Box sx={theme => styleFunctions.resultsWrapper(theme, textDisplayTheme)}>
      {resultObj &&
      <>
        <Box sx={styles.typingResultsWrapper}>
          <SpecificResult Icon={Clock} description="Čas">
            <Typography component="h6" variant="h4">
              {resultObj.time}
            </Typography>
          </SpecificResult>
          <SpecificResult Icon={TopSpeed} description="Rychlost">
            <Typography component="h6" variant="h4">
              {resultObj.typingSpeed >= 0
                ? `${resultObj.typingSpeed} úderů za minutu (${resultObj.wpm} slov za minutu).`
                : `Příliš mnoho překlepů.`
              }
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
              {/* TODO mistyped word symbols don't react to font size change */}
              {resultObj?.precision === 100
                ? <Typography component="h6" variant="h4">
                    Bez překlepů! Pěkná práce.&nbsp;
                    <SvgIcon
                      sx={theme => styleFunctions.thumbUp(theme, textDisplayTheme)}
                      component={ThumbUpIcon}
                      inheritViewBox />
                  </Typography>
                : !MistypedWordsComponents.length ?
                  <Typography component="h6" variant="h4">
                    Žádná chybně napsaná slova.
                    <SvgIcon
                      sx={theme => styleFunctions.thumbUp(theme, textDisplayTheme)}
                      component={ThumbUpIcon}
                      inheritViewBox />
                  </Typography>
                  :
                  <Paper
                    sx={theme => styleFunctions.mistypedWordsWrapper(theme, textDisplayTheme)}
                    variant="outlined"
                    elevation={0}
                  >
                    <Simplebar style={{ maxHeight: "100%" }} autoHide={false}>
                      <Box sx={styles.mistypedWords}>
                        {MistypedWordsComponents}
                      </Box>
                    </Simplebar>
                  </Paper>
              }
            </SpecificResult>
          }
        </Box>
      </>
      }
    </Box>
  );
}

// BUG there's a body scrollbar on notebook screen
