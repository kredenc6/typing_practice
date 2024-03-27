import { useEffect, useState } from "react";
import { Box, IconButton } from "@mui/material";
import { Menu } from "@mui/icons-material";
import { MistypedWordsLog, LatestResult } from "../../types/otherTypes";
import MistypedWordsChartWrapper from "../../components/MistypedWordsChartWrapper/MistypedWordsChartWrapper";
import LatestResultsChart from "../../components/LatestResultsChart/LatestResultsChart";
import ThemeSwitch from "../../components/ThemeSwith/ThemeSwith";
import { CSSObjects } from "../../types/themeTypes";
import { Link } from "react-router-dom";
import Footer from "../../components/Footer/Footer";

const styles: CSSObjects = {
  statistics: ({ palette }) => ({
    height: "100vh",
    display: "grid",
    gridTemplateColumns: "1fr",
    gridTemplateRows: "50% 50%",
    textAlign: "center",
    color: palette.text.primary,
    backgroundColor: palette.background.default
  }),
  menuButton: ({ palette }) => ({
    position: "absolute",
    m: 1,
    border: `1px solid ${palette.divider}`
  })
};

interface Props {
  savedMistypedWords: MistypedWordsLog | null;
  latestResults: LatestResult[] | null;
}

export default function Statistics({ savedMistypedWords, latestResults }: Props) {
  // TODO the state could be simplified? Precision, typingSpeed, textLength and timestamps could be in just one object?

  const [precision, setPrecision] = useState<number[]>([]);
  const [typingSpeed, setTypingSpeed] = useState<number[]>([]);
  const [textLength, setTextLength] = useState<number[]>([]);
  const [timestamps, setTimestamps] = useState<number[]>([]);

  const goToMainMenu = () => {
    document.getElementById("link-to-mainMenu")!.click();
  };

  // TODO make it a custom hook?
  useEffect(() => {
    const savedPrecision: number[] = [];
    const savedResultTimestamps: number[] = [];
    const savedTypingSpeed: number[] = [];
    const savedTextLength: number[] = [];
    
    if(latestResults) {
      latestResults.forEach(({ precision, timestamp, typingSpeed, textLength }) => {
        savedPrecision.push(precision);
        savedResultTimestamps.push(timestamp);
        savedTypingSpeed.push(typingSpeed);
        savedTextLength.push(textLength);
      });
    }

    setPrecision(savedPrecision);
    setTypingSpeed(savedTypingSpeed);
    setTextLength(savedTextLength);
    setTimestamps(savedResultTimestamps);

    // Run only on mount. To make any result changes user needs to leave this page
    // anyway.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <Box sx={styles.statistics}>
      <ThemeSwitch />
      <Link id="link-to-mainMenu" style={{ display: "none" }} to="mainMenu"></Link>
      <IconButton sx={styles.menuButton} size="large" onClick={goToMainMenu}>
        <Menu />
      </IconButton>
      <LatestResultsChart
        precision={precision}
        textLength={textLength}
        timestamps={timestamps}
        typingSpeed={typingSpeed} />
      <MistypedWordsChartWrapper
        mistypedWordsObj={savedMistypedWords} />
      <Footer />
    </Box>
  );
}

// TODO try to switch text length line for bar and the other two for line (in the chart)
