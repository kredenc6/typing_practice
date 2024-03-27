import { FontSize } from "../types/themeTypes";

export const LAST_RESULTS_SAVE_COUNT = 10;
export const LOCAL_STORAGE_KEYS = {
  FONT_DATA: "typingPracticeFontData",
  MISTYPE_SETTINGS: "typingPracticeMistypeSettings",
  THEME_TYPES: "typingPracticeAppThemeType",
  PLAY_PAGE_THEME: "typingPracticeTextDisplayTheme",
  REMEMBER_LOGIN: "typingPracticeRememberLogin"
};
export const MAXIMUM_TEXT_LENGTH = 1500;

export const RECAPTCHA_SITEKEY = "6Lf7TYspAAAAAKkNDi6tKnh7mqmn-RgrpKHKsbk6";

export const MS_IN_A_DAY = 86400000;
export const MS_IN_A_MINUTE = 60000;

/**
 * Small size text (up to ~100 characters has a chance of producing a size larger than its length). This size should prevent insufficient memory error.
 */
export const MINIMUM_BUFFER_LENGTH = 150;

export const DEFAULT_FONT_SIZE: FontSize = "30px";
export const BUTTON_SPINNER_SIZE_COEFICIENT = 1.45;