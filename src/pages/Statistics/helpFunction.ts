import dateFormat from "dateformat";
import _ from "lodash";
import { MistypedWordsLog, SortBy } from "../../types/otherTypes";

export const sortMistypedWords = (mistypedWords: MistypedWordsLog, sortBy: SortBy) => {
  const [sort, direction] = sortBy.split(":") as [string, "asc" | "desc"];

  if(sort === "count") {
    return _.orderBy(
      Object.entries(mistypedWords),
      [
        ([,{ timestamps }]) => timestamps.length,
        ([,{ timestamps }]) => timestamps[timestamps.length - 1]
      ],
      [direction, "desc"]
    );
  }

  if(sort === "time") {
    return _.orderBy(
      Object.entries(mistypedWords),
      [
        ([,{ timestamps }]) => timestamps[timestamps.length - 1],
        ([,{ timestamps }]) => timestamps.length
      ],
      [direction, "desc"]
    );
  }

  // default fallback
  return _.orderBy(
    Object.entries(mistypedWords),
    [
      ([,{ timestamps }]) => timestamps.length,
      ([,{ timestamps }]) => timestamps[timestamps.length - 1]
    ],
    ["desc", "desc"]
  );
};

export const transformMistypeWordsToSeries = (mistypedwords: ReturnType<typeof sortMistypedWords>) => {
  return mistypedwords
    // .slice(0, 5)
    .map(([key, { timestamps }]) => {
      return {
        x: key,
        y: timestamps.length,
        timestamps: {
          name: "poslední překlep",
          array: timestamps,
        }
      };
  });
};

export const calculateHeight_MistypedWordsChart = (wordCount: number) => {
  const MIN_HEIGHT_PX = 250;
  const HEIGHT_PER_WORD_PX = 30;
  const calculatedHeight = wordCount * HEIGHT_PER_WORD_PX;

  return `${Math.max(MIN_HEIGHT_PX, calculatedHeight)}px`;
};

export const getLastMistypeFromChartOptions = (options: any) => {
  const { dataPointIndex, w: { config: { series } } } = options;
  const timestamps = series[0]?.data[dataPointIndex]?.timestamps?.array;
  const lastMistype = new Date(timestamps[timestamps.length - 1]);
  return dateFormat(lastMistype, "d.m. H:MM");
};