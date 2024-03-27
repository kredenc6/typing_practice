export default function scaleCssLength(length: string, coefficient: number): string {
  const match = length.match(/(\d+(?:\.\d+)?)(.*)/);
  if (!match) {
    throw new Error(`Invalid CSS length format: ${length}`);
  }

  const [, value, unit] = match;
  const scaledValue = parseFloat(value) * coefficient;
  return `${scaledValue}${unit}`;
}
