import { ApexOptions } from "apexcharts";
import dateFormat from "dateformat";

export const defaultLastResultsChartOptions: ApexOptions = {
  colors: ["rgba(0, 143, 251, 0.9)", "rgba(0, 227, 150, 0.9)", "rgba(254, 176, 25, 0.9)"],
  chart: {
    id: "lastResultsChart",
    toolbar: {
      show: false
    },
    selection: {
      enabled: false
    }
  },
  markers: {
    size: 5
  },
  legend: {
    // offsetY: -8
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
    }
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
};

export const mistypedWordsChartDefaultOptions: ApexOptions = {
  chart: {
    offsetY: -3,
    id: "mistypedWordsChart",
    toolbar: {
      show: false
    }
  },
  plotOptions: {
    treemap: {
      shadeIntensity: 0.3,
      useFillColorAsStroke: true
    }
  },
  tooltip: {
    marker: {
      show: false
    }
  }
};

export const timestampsToXAxisCategories = (timestamps: number[]) => {
  return timestamps.map(timestamp => dateFormat(timestamp, "d. m. HH:MM"));
};
