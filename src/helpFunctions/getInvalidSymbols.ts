export const getInvalidSymbols = (text: string, validSymbols: string[]) => {
  const invalidSymbols: string[] = [];
  for(const symbol of text) {
    if(!validSymbols.includes(symbol) && !invalidSymbols.includes(symbol)) {
      const whiteSpaceRegExp = /\s/;
      if(whiteSpaceRegExp.test(symbol)) continue; // skip whitespace types

      invalidSymbols.push(symbol);
    }
  }
  return invalidSymbols;
};
