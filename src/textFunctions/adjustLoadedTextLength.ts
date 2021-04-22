export default function adjustLoadedTextLength(paragraphArr: string[], maxLength: number) {
  const DEVIATION = 10; // in %
  return paragraphArr.reduce(( adjustedText, paragraph ) => {
    if(adjustedText.length < maxLength - maxLength * DEVIATION / 100) {
      return `${adjustedText} ${paragraph}`;
    }
    return adjustedText;
  }, "");
}
