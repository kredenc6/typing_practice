export default function promiseWithTimeout<T>(time: number, promise: Promise<T>): Promise<T> {
  const timeoutPromise = new Promise((_, reject) => {
    setTimeout(() => {
      reject(new Error("Request timed out"));
    }, time);
  }) as Promise<T>;

  return Promise.race([promise, timeoutPromise]);
}
