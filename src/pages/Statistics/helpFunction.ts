import dateFormat from "dateformat";
import {
  type MistypedWords, type MistypedWordsLog, type  SortBy, type SortingDirection,
  type SortingType
} from "../../types/otherTypes";

export const sortMistypedWords = (
  mistypedWordsObj: MistypedWordsLog, filteredIndexes: number[], sortBy: SortBy
) => {
  const [sortingType, sortingDirection] = sortBy.split(":") as [SortingType, SortingDirection];
  
  const sortedWords: ([string, number[]] | undefined)[] = [];
  filteredIndexes.forEach(wordIndex => {
    const [word, timestamps] = mistypedWordsObj["words"][wordIndex];

    // filteredIndexes are already alphabetically sorted, so wordIndex can be used directly
    if(sortingType === "alphabetical") {
      sortedWords[wordIndex] = [word, timestamps];

    // for other sorting types word positions are in the sorting arrays
    } else {
      const sortedWordPosition = mistypedWordsObj.sorting[sortingType][wordIndex];
      sortedWords[sortedWordPosition] = [word, timestamps];
    }
  });

  const tempSet = new Set(sortedWords); // get rid of empty spaces (remove all undefined duplicates)
  tempSet.delete(undefined); // get rid of the remaining undefined
  const refinedSortedWords = Array.from(tempSet) as [string, number[]][];

  if(sortingDirection === "desc") {
    refinedSortedWords.reverse();
  }

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

export const getFilteredMistypeWordIndexes = (
  mistypedWordsObj: MistypedWords, filter: string
) => {
  return mistypedWordsObj.reduce((filteredIndexes, [word], i) => {
    if(word.includes(filter)) {
      filteredIndexes.push(i);
    }

    return filteredIndexes;
  }, [] as number[]);
};

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
