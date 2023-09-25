export default function parseStorageItem<T>(storage: string | null): T | null {
  return JSON.parse(storage as string);
}
