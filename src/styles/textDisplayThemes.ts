import { NewTextDisplayTheme } from "../types/types";

export const defaultPalette: Omit<NewTextDisplayTheme, "offset"> = {
  name: "defaultPalette",
  background: {
    main: "#fff",
    secondary: "#ddd"
  },
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
  }
};

export const blue1: Omit<NewTextDisplayTheme, "offset"> = {
  name: "blue1",
  background: {
    main: "#fff",
    secondary: "#ddd",
  },
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
  }
};

export const blue2: Omit<NewTextDisplayTheme, "offset"> = {
  name: "blue2",
  background: {
    main: "#fff",
    secondary: "#ddd",
  },
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
  }
};

export const black1: Omit<NewTextDisplayTheme, "offset"> = {
  name: "black1",
  background: {
    main: "#272822",
    secondary: "#3c3c3c",
  },
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
  }
};
