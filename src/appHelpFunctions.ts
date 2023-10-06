import { MS_IN_A_MINUTE } from "./constants/constants";
import { MinifiedMistypedWordsLog, MistypedWordsLog, User, UserDB } from "./types/otherTypes";

export const minifyMistypedWordsLog = (
  mistypedWordsLog: MistypedWordsLog
): MinifiedMistypedWordsLog => {

  // Extract unique mistype word timestamps into this array.
  const uniqueTimestamps: number[] = [];

  // Replace the timestamps with indexes pointing to the correct timestamp in this array.
  // This will shorten a later coming JSON string by replacing a lot of repeating...
  //... timestamp numbers with shorter index numbers.
  const minifiedWords: Array<[string, number[]]> = [];
  
  for(const [word, mistypes] of mistypedWordsLog.words) {
    const minifiedWord: [string, number[]] = [word, []];
    
    for(const mistype of mistypes) {
      
      // Shorten the UNIX time number to minutes. - even more space saving
      const shortenedMistype = Math.trunc(mistype / MS_IN_A_MINUTE);
      const indexOfTheMistype = uniqueTimestamps.indexOf(shortenedMistype);
      if(indexOfTheMistype === -1) {
        uniqueTimestamps.push(shortenedMistype);
        minifiedWord[1].push(uniqueTimestamps.length - 1);
      }
      else {
        minifiedWord[1].push(indexOfTheMistype);
      }
    }

    minifiedWords.push(minifiedWord);
  }

  return {
    w: minifiedWords,
    t: uniqueTimestamps,
    s: {
      t: mistypedWordsLog.sorting.byTime,
      c: mistypedWordsLog.sorting.byMistypeCount
    }
  };
};

export const unminifyMistypedWordsLog = (
  mistypedWordsLog: MinifiedMistypedWordsLog
): MistypedWordsLog => {
  const unminifiedWords: Array<[string, number[]]> = [];

  for(const [word, indexes] of mistypedWordsLog.w) {
    unminifiedWords.push([word, []]);
      for(const index of indexes) {
        const unminifiedTimestamp = mistypedWordsLog.t[index] * MS_IN_A_MINUTE;
        unminifiedWords[unminifiedWords.length - 1][1].push(unminifiedTimestamp);
      }
  }

  return {
    words: unminifiedWords,
    sorting: {
      byTime: mistypedWordsLog.s.t,
      byMistypeCount: mistypedWordsLog.s.c
    }
  };
};

export const extractUserFromDbUser = (userDB: UserDB | null): User | null => {
  if(!userDB) {
    return null;
  }
  
  return {
    id: userDB.i,
    name: userDB.n,
    isAdmin: userDB.a,
    createdAt: userDB.c,
    picture: userDB.p
  };
};

export const extractUserDBFromUser = (user: User | null): UserDB | null => {
  if(!user) {
    return null;
  }
  
  return {
    i: user.id,
    n: user.name,
    a: user.isAdmin,
    c: user.createdAt,
    p: user.picture
  }
};
