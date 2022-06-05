import { Theme } from "@material-ui/core";
import { ApexOptions } from "apexcharts";
import dateFormat from "dateformat";
import { getLastMistypeFromChartOptions } from "./helpFunction";
// import { customTooltip_mistypedWords } from "./customTooltip_mistypedWords";

export const createLatestResultsChartOptions = (theme: Theme): ApexOptions => ({
  colors: ["rgba(0, 143, 251, 0.9)", "rgba(0, 227, 150, 0.9)", "rgba(254, 176, 25, 0.9)"],
  chart: {
    id: "lastResultsChart",
    toolbar: {
      show: false
    },
    selection: {
      enabled: false
    },
    zoom: {
      enabled: false
    },
    foreColor: theme.palette.text.primary
  },
  markers: {
    size: 5
  },
  stroke: {
    colors: ["rgba(0, 143, 251, 0.9)", "rgba(0, 227, 150, 0.9)", "rgba(254, 176, 25, 0.9)"],
    curve: "smooth",
    lineCap: "round",
    width: 2
  },
  dataLabels: {
    enabled: false
  },
  tooltip: {
    y: {
      formatter: (value, { seriesIndex }) => {
        const suffixes = ["%", " úhozů/m", " znaků"];
        return `${value}${suffixes[seriesIndex]}`;
      }
    },
    theme: theme.palette.type
  },
  xaxis: {
    crosshairs: {
      show: false
    },
    tooltip: {
      enabled: false
    }
  },
  yaxis: [
    {
      crosshairs: {
        show: false
      },
      title: {
        text: "přesnost"
      },
      labels: {
        formatter: value => `${value}%`
      }
    },
    {
      crosshairs: {
        show: false
      },
      opposite: true,
      title: {
        text: "rychlost (úhozy za minutu)"
      },
      labels: {
        formatter: value => `${value}`
      }
    },
    {
      crosshairs: {
        show: false
      },
      show: false
    }
  ]
});

export const createMistypedWordsChartOptions = (theme: Theme): ApexOptions => ({
  chart: {
    id: "mistypedWordsChart",
    toolbar: {
      show: false
    },
    foreColor: theme.palette.text.primary,
    offsetY: -15,
    selection: {
      enabled: false
    },
    zoom: {
      enabled: false
    }
  },
  plotOptions: {
    bar: {
      horizontal: true
    }
  },
  dataLabels: {
    formatter: value => `${value}x`
  },
  tooltip: {
    y: {
      title: {
        formatter: () => "posledí překlep"
      },
      formatter: (_, options) => {
        return getLastMistypeFromChartOptions(options);
      }
    },
    followCursor: true,
    theme: theme.palette.type
  },
  xaxis: {
    labels: {
      show: false
    },
    axisBorder: {
      show: false
    },
    axisTicks: {
      show: false
    }
  }
});

export const timestampsToXAxisCategories = (timestamps: number[]) => {
  return timestamps.map(timestamp => dateFormat(timestamp, "d. m. HH:MM"));
};
