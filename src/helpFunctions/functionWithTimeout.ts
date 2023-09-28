export default function functionWithTimeout<T>(time: number, asyncFn: () => Promise<T>) {
  const timeoutPromise = new Promise((_, reject) => {
    setTimeout(() => {
      reject(new Error(`${asyncFn.name}'s request timed out`));
    }, time);
  }) as Promise<T>;

  return Promise.race([asyncFn(), timeoutPromise]);
}
