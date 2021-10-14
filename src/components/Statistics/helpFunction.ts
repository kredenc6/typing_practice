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
