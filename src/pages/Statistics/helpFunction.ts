import dateFormat from "dateformat";
import { MistypedWordsLog, SortBy } from "../../types/otherTypes";

export const sortMistypedWords = (
  mistypedWordsObj: MistypedWordsLog, filteredIndexes: number[], sortBy: SortBy
) => {
  const [sort, direction] = sortBy
    .split(":") as [keyof MistypedWordsLog["sorting"], "asc" | "desc"];
  
  let sortedWords: ([string, number[]] | undefined)[] = [];
  filteredIndexes.forEach(wordIndex => {
    const [word, timestamps] = mistypedWordsObj["words"][wordIndex];
    const sorting = mistypedWordsObj["sorting"];
    const wordPosition = sorting[sort][wordIndex];
    sortedWords[wordPosition] = [word, timestamps];
  });

  const tempSet = new Set(sortedWords); // get rid of empty spaces (remove all undefined duplicates)
  tempSet.delete(undefined); // get rid of the remaining undefined
  const refinedSortedWords = Array.from(tempSet) as [string, number[]][];

  if(direction === "desc") {
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
  mistypedWordsObj: MistypedWordsLog, filter: string
) => {
  return mistypedWordsObj["words"].reduce((filteredIndexes, [word], i) => {
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
