import { TextDisplayTheme } from "../types/types";

export const blue1TextDisplayTheme: TextDisplayTheme = {
  palette: {
    text: {
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
      }
    }
  },
  offset: {
    display: {
      margin: "20px auto",
      padding: "10px 20px"
    },
    text: {
      padding: "0 1px",
      marginRight: "1px"
    }
  }
};

export const blue2TextDisplayTheme: TextDisplayTheme = {
  palette: {
    text: {
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
      }
    }
  },
  offset: {
    display: {
      margin: "20px auto",
      padding: "10px 20px"
    },
    text: {
      padding: "0 1px",
      marginRight: "1px"
    }
  }
};