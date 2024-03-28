import { type GameStatus } from "../types/otherTypes";

interface SelfTypeOptions {
  delay: number,

}

const defaultOptions: SelfTypeOptions = {
  delay: 0,

}

export const selfTypeSymbol = (
  symbol: string,
  setEnteredSymbol: React.Dispatch<React.SetStateAction<string>>,
  options = defaultOptions
) => {
  setTimeout(() => setEnteredSymbol(symbol), options.delay);
};

export const shouldStartSelfType = (ctrlKey: boolean, key: string, gameStatus: GameStatus) => {
  return (
    gameStatus !== "selfType" &&
    ctrlKey &&
    key.toLowerCase() === "arrowdown" &&
    process.env.NODE_ENV === "development"
  ); 
};

export const shouldStopSelfType = (ctrlKey: boolean, key: string, gameStatus: GameStatus) => {
  return (
    gameStatus === "selfType" &&
    ctrlKey &&
    key.toLowerCase() === "arrowdown" &&
    process.env.NODE_ENV === "development"
  ); 
};
