export default function parseStorageItem<T>(storageId: string): T | null {
    return JSON.parse(localStorage.getItem(storageId) as string);
  }

// Here I tried to implement a null substitution, but I was strugling with the Typescript.
// Nullish coalescence solves it easily enough though.

// export default function parseStorageItem<T, U = undefined>(
//   storage: string | null, nullSubstitution?: U): T | (U extends undefined ? null : U
// ) {
//   return JSON.parse(storage as string);
// }
