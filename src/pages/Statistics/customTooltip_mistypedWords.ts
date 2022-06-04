import dateFormat from "dateformat";
import { PaletteType, Theme } from "@material-ui/core";
import "./customTooltip_mistypedWords.css";

// TODO if not used/fixed - this file can be deleted

/** Theme is stuck within a closure so it's not possible to follow the theme changes.
* @ not-working
*/
export const customTooltip_mistypedWords = (
  { series, dataPointIndex, w: { config } }: any, themeMode: PaletteType
) => {
  const tooltipNode = document.getElementsByClassName("apexcharts-tooltip")[0];
  console.dir(tooltipNode)

  // const { series, dataPointIndex, w: { config } } = data;
  const internalTheme = config.theme;
  // console.log(internalTheme)
  // console.log(themeMode)
  // const value = "TEMP_VALUE";
  // const { timestamps } = series[0]?.data[dataPointIndex];
  // const lastMistype = new Date(timestamps[timestamps.length - 1]);
  // const lastMistypeFormatted = dateFormat(lastMistype, "d.m. H:MM");
  
  return (
    `<div class="custom-mistypedWords-tooltip custom-mistypedWords-tooltip--${themeMode}">
      test
      </div>`
  );
  // return (
  //   `<div class="custom-mistypedWords-tooltip custom-mistypedWords-tooltip--${theme.palette.type}">
  //     <p class="custom-mistypedWords-tooltip__header custom-mistypedWords-tooltip__header--${theme.palette.type}">
  //       ${w.globals.labels[dataPointIndex]}
  //     </p>
  //     <div class="custom-mistypedWords-tooltip__line custom-mistypedWords-tooltip__line--${theme.palette.type}">
  //       <div class="custom-mistypedWords-tooltip__dot"></div>
  //       <span>počet překlepů:</span><span class="custom-mistypedWords-tooltip__value custom-mistypedWords-tooltip__value--${theme.palette.type}">${value}</span>
  //     </div>
  //     <div class="custom-mistypedWords-tooltip__line custom-mistypedWords-tooltip__line--${theme.palette.type}">
  //       <div class="custom-mistypedWords-tooltip__dot"></div>
  //       <span>poslední překlep:</span><span class="custom-mistypedWords-tooltip__value custom-mistypedWords-tooltip__value--${theme.palette.type}">${lastMistypeFormatted}</span>
  //     </div>`
  // );
};
