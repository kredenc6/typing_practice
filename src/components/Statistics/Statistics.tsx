import React, { useEffect, useState } from "react";
import { Box, Typography } from "@material-ui/core";
import { LOCAL_STORAGE_KEYS } from "../../constants/constants";
import { MistypedWordsLog, Results } from "../../types/otherTypes";

export default function Statistics() {
  const [lastResults, setLastResults] = useState<Results | null>(null);
  const [mistypedWords, setMistypedWords] = useState<MistypedWordsLog | null>(null);
  
  useEffect(() => {
    const lastResultsFromStorage = localStorage.getItem(LOCAL_STORAGE_KEYS.LAST_RESULTS);
    const mistypedWordsFromStorage = localStorage.getItem(LOCAL_STORAGE_KEYS.MISTYPED_WORDS);

    lastResultsFromStorage
      ? setLastResults( JSON.parse(lastResultsFromStorage) as Results )
      : setLastResults(null);

    mistypedWordsFromStorage
      ? setMistypedWords( JSON.parse(mistypedWordsFromStorage) as MistypedWordsLog )
      : setMistypedWords(null);
  }, [])
  
  return (
    <Box>
      <Typography variant="h5">Statistics</Typography>
      <Typography>{JSON.stringify(lastResults)}</Typography>
      <Typography>{JSON.stringify(mistypedWords)}</Typography>
    </Box>
  );
}
