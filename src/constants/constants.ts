import { AllowedMistype } from "../types/otherTypes";
import { FontData } from "../types/themeTypes";

const LOCAL_STORAGE = "";

type LocalStorageGameInfo = {
  typingPracticeFontData: FontData | null;
  typingPracticeMistypeSettings: AllowedMistype | null;
};

const localStorageUserInfo = {

};