import { type FontSize } from "../types/themeTypes";

export const LAST_RESULTS_SAVE_COUNT = 10;
export const LOCAL_STORAGE_KEYS = {
  FONT_DATA: "typingPracticeFontData",
  MISTYPE_SETTINGS: "typingPracticeMistypeSettings",
  THEME_TYPES: "typingPracticeAppThemeType",
  PLAY_PAGE_THEME: "typingPracticeTextDisplayTheme",
  REMEMBER_LOGIN: "typingPracticeRememberLogin",
  EMAIL_AUTH: "typingPracticeEmailAuth"
};
export const MAXIMUM_TEXT_LENGTH = 1500;

export const RECAPTCHA_SITEKEY = "6Lf7TYspAAAAAKkNDi6tKnh7mqmn-RgrpKHKsbk6";

export const MS_IN_A_DAY = 86400000;
export const MS_IN_A_MINUTE = 60000;
export const DEFAULT_FONT_SIZE: FontSize = "30px";
export const BUTTON_SPINNER_SIZE_COEFICIENT = 1.45;
export const ALLOWED_PROVIDER_IDS = ["google.com", "password"];

export const RECAPTCHA_KEYS = {
  EMAIL_AUTH: "emailAuth",
  SIGN_IN: "signIn"
};

export const URLS = {
  APP: "https://eloquent-ramanujan-5d9ccc.netlify.app/",
  LOCAL: "http://localhost:8888"
};

export const RESEND_VERIFICATION_EMAIL = {
  INTERVAL: 1000,
  DELAY: 45
};
