export default async function promiseWithMinimumWaitTime<T>(
  minimumWaitTime: number, promise: Promise<T>
  ): Promise<T> {
    const timerPromise = new Promise(resolve => {
      setTimeout(resolve, minimumWaitTime);
    });
  
    const [resolvedPromise] = await Promise.all([promise, timerPromise]);
  return resolvedPromise;
}
