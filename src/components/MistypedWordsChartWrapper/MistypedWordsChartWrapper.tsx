import { useState, useLayoutEffect, useRef } from "react";
import { Box, Paper, Typography, makeStyles } from "@material-ui/core";
import MistypedWordsFilter from "../MistypedWordsFilter/MistypedWordsFilter";
import SimpleBar from "simplebar-react";
import MistypedWordsChart from "../MistypedWordsChart/MistypedWordsChart";
import "simplebar/dist/simplebar.min.css";
import { SortBy } from "../../types/otherTypes";

const useStyles = makeStyles({
  mistypedWordsWrapper: {
    position: "relative",
    width: "90vw",
    height: "48vh",
    margin: "0 auto",
    paddingBottom: "1rem"
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
  sortBy: SortBy;
  handleSortChange: (value: SortBy) => void;
}

export default function MistypedWordsChartWrapper({
  mistypedWordsSeries, sortBy, handleSortChange
}: Props) {
  const classes = useStyles();
  const [simpleBarHeight, setSimpleBarHeight] = useState("0px");
  const mistypedWordsWrapperRef = useRef<null | HTMLDivElement>(null);
  const mistypedWordsHeadingRef = useRef<null | HTMLDivElement>(null);

  useLayoutEffect(() => {
    const setSimpleBarHeightFun = () => {
      if(mistypedWordsWrapperRef.current && mistypedWordsHeadingRef.current) {
        const {
          height,
          paddingTop,
          paddingBottom
        } = getComputedStyle(mistypedWordsWrapperRef.current);
      
        const { height: headingHeight } =
          getComputedStyle(mistypedWordsHeadingRef.current);

        setSimpleBarHeight(`calc(${height} - ${headingHeight} - ${paddingTop} - ${paddingBottom})`);
      }
    };
    
    setSimpleBarHeightFun();
    window.addEventListener("resize", setSimpleBarHeightFun);
    return () => window.removeEventListener("resize", setSimpleBarHeightFun);
  },[mistypedWordsSeries])

  return (
    <Paper
      variant="outlined"
      className={classes.mistypedWordsWrapper}
      ref={mistypedWordsWrapperRef}
    >
      <Typography
        ref={mistypedWordsHeadingRef}
        variant="h6"
        align="center"
      >
        Chybně napsaná slova
      </Typography>
      {mistypedWordsSeries?.length > 1 &&
        <MistypedWordsFilter sortBy={sortBy} handleSortChange={handleSortChange} />
      }
      {!mistypedWordsSeries?.length
        ? <Box className={classes.noDataWrapper}>
            <Typography>...žádná nenalezena</Typography>
          </Box>
        
        : <SimpleBar style={{ maxHeight: simpleBarHeight }}>
            <MistypedWordsChart mistypedWordsSeries={mistypedWordsSeries} />
          </SimpleBar>
      }
    </Paper>
  );
}
