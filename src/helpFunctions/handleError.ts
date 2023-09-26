export default function handleError (error: unknown | any, message?: string) {
  if (error instanceof Error) {
    if (message) {
      console.log(`${message} Error: ${error.message}`);
      return;
    }
      console.log(error.message);
  } else {
    console.log("o_O. We've received something else than error here.");
    // Throw the error again, because we don't know how to handle it.
    throw error;
  }
}
