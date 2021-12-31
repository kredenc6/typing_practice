export default function transformPixelSizeToNumber (pixelSize: string) {
  if(!pixelSize.endsWith("px")) {
    console.error("Received pixel size does not have the proper format.");
    return -1;
  }
  return Number(pixelSize.slice(0, -2));
}
