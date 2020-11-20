export default function calcTypingSpeed(seconds: number, count: number) {
  if(!seconds) return 0;
  return Math.round(count / seconds * 60);
}