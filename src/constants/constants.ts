export const LAST_RESULTS_SAVE_COUNT = 10;
export const LOCAL_STORAGE_KEYS = {
  FONT_DATA: "typingPracticeFontData",
  MISTYPE_SETTINGS: "typingPracticeMistypeSettings",
  THEME_TYPES: "typingPracticeAppThemeType",
  TEXT_DISPLAY_THEME: "typingPracticeTextDisplayTheme"
};
export const MAXIMUM_TEXT_LENGTH = 1500;

export const MS_IN_A_DAY = 86400000;
export const MS_IN_A_MINUTE = 60000;

/**
 * Small size text (up to ~100 characters has a chance of producing a size larger than its length). This size should prevent insufficient memory error.
 */
export const MINIMUM_BUFFER_LENGTH = 150;
