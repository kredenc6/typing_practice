import _ from "lodash";
import { MistypedWordsLog } from "../../types/otherTypes";

export const sortMistypedWords = (mistypedWords: MistypedWordsLog) => {
  return _.orderBy(
    Object.entries(mistypedWords),
    [
      ([,{ sumOfMistypes }]) => sumOfMistypes,
      ([,{ timestamps }]) => timestamps[timestamps.length - 1]
    ],
    ["desc", "desc"]
  );
};

export const calcMistypedWordsChartWidth = (mistypeCount: number) => {
  const widthByMistypeCount = mistypeCount * 100;
  const width = Math.min(window.innerWidth * 0.94, widthByMistypeCount);
  return `${width}px`;
};
