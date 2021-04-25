import { TextDisplayTheme } from "../types/types";

export const defaultPalette: Pick<TextDisplayTheme, "palette"> = {
  palette: {
    background: {
      main: "#fff",
      secondary: "#ddd"
    },
    name: "defaultPalette",
    symbols: {
      active: {
        bgcColor: "inherit",
        color: "#757575"
      },
      correct: {
        bgcColor: "#e7fbd3",
        color: "#0e630e"
      },
      corrected: {
        bgcColor: "#ffe9b2",
        color: "green"
      },
      default: {
        bgcColor: "inherit",
        color: "#757575"
      },
      mistyped: {
        bgcColor: "pink",
        color: "darkred"
      },
      invalid: {
        bgcColor: "pink",
        color: "darkred"
      }
    },
    text: {
      main: "#000",
      secondary: "#000"
    }
  }
};

export const blue1: Pick<TextDisplayTheme, "palette"> = {
  palette: {
    background: {
      main: "#fff",
      secondary: "#ddd",
    },
    name: "blue1",
    symbols: {
      active: {
        bgcColor: "inherit",
        color: "#555"
      },
      correct: {
        bgcColor: "#004f80",
        color: "#d3e6fb"
      },
      corrected: {
        bgcColor: "#ffe9b2",
        color: "green"
      },
      default: {
        bgcColor: "inherit",
        color: "#555"
      },
      mistyped: {
        bgcColor: "pink",
        color: "darkred"
      },
      invalid: {
        bgcColor: "pink",
        color: "darkred"
      }
    },
    text: {
      main: "#000",
      secondary: "#000"
    }
  }
};

export const blue2: Pick<TextDisplayTheme, "palette"> = {
  palette: {
    background: {
      main: "#fff",
      secondary: "#ddd",
    },
    name: "blue2",
    symbols: {
      active: {
        bgcColor: "inherit",
        color: "#555"
      },
      correct: {
        bgcColor: "#d6f4f9",
        color: "#366770"
      },
      corrected: {
        bgcColor: "#ffd424",
        color: "#5c4500"
      },
      default: {
        bgcColor: "inherit",
        color: "#555"
      },
      mistyped: {
        bgcColor: "#ed8525",
        color: "#613209"
      },
      invalid: {
        bgcColor: "pink",
        color: "darkred"
      }
    },
    text: {
      main: "#000",
      secondary: "#000"
    }
  }
};

export const black1: Pick<TextDisplayTheme, "palette"> = {
  palette: {
    background: {
      main: "#272822",
      secondary: "#3c3c3c",
    },
    name: "black1",
    symbols: {
      active: {
        bgcColor: "inherit",
        color: "#757575"
      },
      correct: {
        bgcColor: "#ddd",
        color: "#000"
      },
      corrected: {
        bgcColor: "#ffe9b2",
        color: "green"
      },
      default: {
        bgcColor: "inherit",
        color: "#757575"
      },
      mistyped: {
        bgcColor: "#bd9292",
        color: "#6d0000"
      },
      invalid: {
        bgcColor: "pink",
        color: "darkred"
      }
    },
    text: {
      main: "#eee",
      secondary: "#999"
    }
  }
};
