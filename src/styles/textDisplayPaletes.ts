import { TextDisplayTheme } from "../types/themeTypes";

export const defaultPalette: Omit<TextDisplayTheme, "offset"> = {
  name: "defaultPalette",
  background: {
    main: "#fff",
    secondary: "#fff"
  },
  text: {
    main: "rgba(0, 0, 0, 0.87)",
    secondary: "#777"
  },
  symbols: {
    active: {
      backgroundColor: "inherit",
      color: "#757575"
    },
    correct: {
      backgroundColor: "#e7fbd3",
      color: "#0e630e"
    },
    corrected: {
      backgroundColor: "#ffe9b2",
      color: "green"
    },
    pending: {
      backgroundColor: "inherit",
      color: "#757575"
    },
    mistyped: {
      backgroundColor: "pink",
      color: "darkred"
    },
    invalid: {
      backgroundColor: "pink",
      color: "white"
    }
  }
};

export const blue1: Omit<TextDisplayTheme, "offset"> = {
  name: "blue1",
  background: {
    main: "#fff",
    secondary: "#fff",
  },
  text: {
    main: "rgba(0, 0, 0, 0.87)",
    secondary: "#777"
  },
  symbols: {
    active: {
      backgroundColor: "inherit",
      color: "#555"
    },
    correct: {
      backgroundColor: "#004f80",
      color: "#d3e6fb"
    },
    corrected: {
      backgroundColor: "#ffe9b2",
      color: "green"
    },
    pending: {
      backgroundColor: "inherit",
      color: "#555"
    },
    mistyped: {
      backgroundColor: "pink",
      color: "darkred"
    },
    invalid: {
      backgroundColor: "pink",
      color: "white"
    }
  }
};

export const blue2: Omit<TextDisplayTheme, "offset"> = {
  name: "blue2",
  background: {
    main: "#fff",
    secondary: "#fff",
  },
  text: {
    main: "rgba(0, 0, 0, 0.87)",
    secondary: "#777"
  },
  symbols: {
    active: {
      backgroundColor: "inherit",
      color: "#555"
    },
    correct: {
      backgroundColor: "#d6f4f9",
      color: "#366770"
    },
    corrected: {
      backgroundColor: "#ffd424",
      color: "#5c4500"
    },
    pending: {
      backgroundColor: "inherit",
      color: "#555"
    },
    mistyped: {
      backgroundColor: "#ed8525",
      color: "#613209"
    },
    invalid: {
      backgroundColor: "pink",
      color: "white"
    }
  }
};

export const black1: Omit<TextDisplayTheme, "offset"> = {
  name: "black1",
  background: {
    main: "#272822",
    secondary: "#3c3c3c",
  },
  text: {
    main: "rgba(255, 255, 255, 0.87)",
    secondary: "rgba(255, 255, 255, 0.87)"
  },
  symbols: {
    active: {
      backgroundColor: "rgba(255, 255, 255, 0.1)",
      color: "#757575"
    },
    correct: {
      backgroundColor: "#ddd",
      color: "#000"
    },
    corrected: {
      backgroundColor: "#ffe9b2",
      color: "green"
    },
    pending: {
      backgroundColor: "inherit",
      color: "#757575"
    },
    mistyped: {
      backgroundColor: "#bd9292",
      color: "#6d0000"
    },
    invalid: {
      backgroundColor: "pink",
      color: "white"
    }
  }
};
