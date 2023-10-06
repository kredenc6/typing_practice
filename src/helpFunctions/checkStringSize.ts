/**
 * 
 * @param string Has to be in the UTF-8 encoding.
 */
export default function checkStringSize(string: string) {
  const sizeInKb = string.length / 1024;

  console.log(`${sizeInKb.toFixed(2)} kB`);
}
