import createCtx from "../helpFunctions/createCtx";
import appTheme from "./appTheme";

const [Context, Provider] = createCtx(appTheme);
export const ThemeContext = Context;
export const ThemeProvider = Provider;
