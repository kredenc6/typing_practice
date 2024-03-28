import dateFormat from "dateformat";
import { type MistypedWordsLogV2, type SortBy } from "../../types/otherTypes";

// export const sortMistypedWords = (mistypedWords: MistypedWordsLog, sortBy: SortBy) => {
//   const [sort, direction] = sortBy.split(":") as [string, "asc" | "desc"];

//   if(sort === "count") {
//     return _.orderBy(
//       Object.entries(mistypedWords),
//       [
//         ([,{ timestamps }]) => timestamps.length,
//         ([,{ timestamps }]) => timestamps[timestamps.length - 1]
//       ],
//       [direction, "desc"]
//     );
//   }

//   if(sort === "time") {
//     return _.orderBy(
//       Object.entries(mistypedWords),
//       [
//         ([,{ timestamps }]) => timestamps[timestamps.length - 1],
//         ([,{ timestamps }]) => timestamps.length
//       ],
//       [direction, "desc"]
//     );
//   }

//   if(sort === "alphabetical") {
//     const sortingCoefficient = direction === "asc" ? 1 : -1;
//     return Object.entries(mistypedWords)
//       .sort(([wordA], [wordB]) => {
//         return (
//           sortingCoefficient *
//           new Intl.Collator("cz").compare(wordA, wordB)
//         );
//       });
//   }

//   // default fallback
//   return _.orderBy(
//     Object.entries(mistypedWords),
//     [
//       ([,{ timestamps }]) => timestamps.length,
//       ([,{ timestamps }]) => timestamps[timestamps.length - 1]
//     ],
//     ["desc", "desc"]
//   );
// };

export const sortMistypedWords = (
  mistypedWordsObj: MistypedWordsLogV2, filteredIndexes: number[], sortBy: SortBy
) => {
  const [sort, direction] = sortBy
    .split(":") as [keyof MistypedWordsLogV2[0]["sorting"], "asc" | "desc"];
  
  const sortedWords: ([string, number[]] | undefined)[] = [];
  filteredIndexes.forEach(wordIndex => {
    const { word, timestamps, sorting } = mistypedWordsObj[wordIndex];
    const wordPosition = sorting[sort];
    sortedWords[wordPosition] = [word, timestamps];
  });

  const tempSet = new Set(sortedWords); // get rid of empty spaces (remove all undefined duplicates)
  tempSet.delete(undefined); // get rid of the remaining undefined
  const refinedSortedWords = Array.from(tempSet) as [string, number[]][];

  if(direction === "desc") {
    refinedSortedWords.reverse();
  }

  console.log(mistypedWordsObj)
  console.log({filteredIndexes, refinedSortedWords, sort, direction})
  return refinedSortedWords;
};

export const transformMistypeWordsToSeries = (mistypedwords: [string, number[]][]) => {
  return mistypedwords
    .map(([word, timestamps]) => {
      return {
        x: word,
        y: timestamps.length,
        timestamps: {
          name: "poslední překlep",
          array: timestamps,
        }
      };
  });
};

export const getMistypedWordsChartHeight = (wrapperHeight: number) => {
  const LINE_COUNT = 10;
  const MIN_HEIGHT_PX = 250;
  const WRAPPER_HEIGHT_DIVIDER = 11.5;
  const calculatedHeight = Math.round(wrapperHeight / WRAPPER_HEIGHT_DIVIDER * LINE_COUNT);

  return `${Math.max(MIN_HEIGHT_PX, calculatedHeight)}px`;
};

export const getLastMistypeFromChartOptions = (options: any) => {
  const { dataPointIndex, w: { config: { series } } } = options;
  const timestamps = series[0]?.data[dataPointIndex]?.timestamps?.array;
  const lastMistype = new Date(timestamps[timestamps.length - 1]);
  return dateFormat(lastMistype, "d.m. H:MM");
};

// export const filterMistypedWords = (
//   mistypedWords: MistypedWordsLog, filter: string
// ): MistypedWordsLog["words"] => {
//   if(filter === "") {
//     return mistypedWords.words;
//   }

//   return mistypedWords.words.filter(([key]) => key.includes(filter));
// };

export const getFilteredMistypeWordIndexes = (
  mistypedWordsObj: MistypedWordsLogV2, filter: string
) => {
  return mistypedWordsObj.reduce((filteredIndexes, { word }, i) => {
    if(word.includes(filter)) {
      filteredIndexes.push(i);
    }

    return filteredIndexes;
  }, [] as number[]);
};

// export const filterMistypedWordsOrders = (
//   mistypedWords: MistypedWordsLog, filter: string
// ): Omit<MistypedWordsLog, "words"> => {
//   const { alphabetical, byMistypeCount, byTime, words } = mistypedWords;
  
//   if(filter === "") {
//     return {
//       alphabetical,
//       byMistypeCount,
//       byTime
//     };
//   }

//   return {
//     alphabetical: alphabetical.filter(wordIndex => words[wordIndex].includes(filter)),
//     byMistypeCount,
//     byTime
//   };
// };

const merge = (left: any[], right: any[]) => {
  const result = [];
  while((left.length > 0) && (right.length > 0)) {
    if(left[0]["obj"].someProp > right[0]["obj"].someProp) {
      result.push(left.shift());
    }
    else {
      result.push(right.shift());
    }
  }

  return result.concat(left, right);
};

export const sort = (array: any[]): any[] => {
  const len = array.length;
  
  if(len < 2) { 
    return array;
  }

  const pivot = Math.ceil(len/2);
  return merge(sort(array.slice(0,pivot)), sort(array.slice(pivot)));
};
