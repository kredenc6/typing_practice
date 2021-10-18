import React, { useState, useLayoutEffect, useRef } from "react";
import { Box, Paper, Typography, makeStyles } from "@material-ui/core";
import SimpleBar from "simplebar-react";
import MistypedWordsChart from "../MistypedWordsChart/MistypedWordsChart";
import "simplebar/dist/simplebar.min.css";

const useStyles = makeStyles({
  mistypedWordsWrapper: {
    maxWidth: "95%",
    maxHeight: "90%",
    height: "calc(48vh - 2rem)",
    margin: "0 auto",
    padding: "5px 0 7px"
  },
  noDataWrapper: {
    height: "50%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center"
  }
});

interface Props {
  mistypedWordsSeries: {x: string; y: number; }[];
  mistypedWordsChartHeight: number;
  mistypedWordsChartWidth: string;
}

export default function MistypedWordsChartWrapper({
  mistypedWordsChartHeight, mistypedWordsSeries, mistypedWordsChartWidth
}: Props) {
  const classes = useStyles({mistypedWordsChartWidth});
  const [simpleBarHeight, setSimpleBarHeight] = useState("0px");
  const mistypedWordsWrapperRef = useRef<null | HTMLDivElement>(null);

  useLayoutEffect(() => {
    const setSimpleBarHeightFun = () => {
      if(mistypedWordsWrapperRef.current) {
        const {
          height,
          paddingTop,
          paddingBottom
        } = getComputedStyle(mistypedWordsWrapperRef.current);
        setSimpleBarHeight(`calc(${height} - ${paddingTop} - ${paddingBottom})`);
      }
    };
    
    setSimpleBarHeightFun();
    window.addEventListener("resize", setSimpleBarHeightFun);
    return () => window.removeEventListener("resize", setSimpleBarHeightFun);
  },[mistypedWordsSeries])

  return (
    <Box>
        <Typography variant="h6" align="center">Chybně napsaná slova</Typography>
        {!mistypedWordsSeries?.length
          ? <Box className={classes.noDataWrapper}>
              <Typography variant="h6">...žádná data</Typography>
            </Box>
          
          : <Paper
              variant="outlined"
              className={classes.mistypedWordsWrapper}
              ref={mistypedWordsWrapperRef}
            >
              <SimpleBar
                style={{ overflowX: "hidden", padding: "0 10px", maxHeight: simpleBarHeight }}
              >
                <MistypedWordsChart
                  mistypedWordsSeries={mistypedWordsSeries}
                  mistypedWordsChartHeight={mistypedWordsChartHeight}
                  mistypedWordsChartWidth={mistypedWordsChartWidth} />
              </SimpleBar>
            </Paper>
        }
    </Box>
  );
}
