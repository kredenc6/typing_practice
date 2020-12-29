export default function (remSize: string) {
  if(!remSize.endsWith("rem")) {
    console.error("Received rem size does not have the proper format.");
    return -1;
  }
  return Number(remSize.slice(0, -3));
}
