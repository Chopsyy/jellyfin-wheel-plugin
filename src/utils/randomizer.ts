export function getRandomValue<T>(values: T[]): T {
  const randomIndex = Math.floor(Math.random() * values.length);
  return values[randomIndex];
}