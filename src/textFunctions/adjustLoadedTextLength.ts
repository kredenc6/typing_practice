export default function adjustLoadedTextLength(paragraphArr: string[], assignedTextLength: number) {
  const DEVIATION = 10; // in %
  const allowedDeviation = Math.round(assignedTextLength * DEVIATION / 100);

  let text = "";
  for(const paragraph of paragraphArr) {
    if((text.length + paragraph.length) < (assignedTextLength + allowedDeviation)) {
      text += ` ${paragraph}`;
    } else {
      const remainingLength = assignedTextLength - text.length - allowedDeviation;
      const endOfSentence = paragraph.indexOf(". ", remainingLength - 1);
      text += ` ${paragraph.slice(0, endOfSentence + 1)}`;
    }

    if(text.length > assignedTextLength - allowedDeviation) {
      return text.trim();
    }
  }

  return text.trim();
};
