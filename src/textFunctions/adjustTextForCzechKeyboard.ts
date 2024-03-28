const ENGLISH_KEYBOARD_CHARACTERS_REGEXP = /[~`#$^&*{}[\]'<>]/g;

export default function adjustTextForCzechKeyboard(text: string) {
  return text.replace(ENGLISH_KEYBOARD_CHARACTERS_REGEXP, "");
}
